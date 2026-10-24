const moment = require("moment");

const { addTimesheetEntry } = require("../services/timecardService");

const Company = require("../models/Company");
const Holiday = require("../models/Holiday");
const { bcStatHolidays, isBCCompany } = require("../utils/bcStatHolidays.util");
const Timesheet = require("../models/Timesheet");
const EmployeePayInfo = require("../models/EmployeePayInfo");
const { PAY_TYPES_TITLE } = require("../constants/pay.constants");
const { TIMESHEET_SOURCE, PARAM_HOURS } = require("../constants/timesheet.constants");
const { getPayrollActiveEmployees } = require("../services/userService");
const { safeNum } = require("../utils/time.util");

const addStatHolidayDefaultTimesheet = async (employeeId, companyName) => {
	const startOfToday = moment().startOf("day");
	const endOfToday = moment().endOf("day");

	const existingStatTimesheetInfo = await Timesheet.findOne({
		deleted: false,
		employeeId,
		companyName,
		payType: PAY_TYPES_TITLE.STAT_PAY,
		clockIn: {
			$gte: startOfToday.toDate(),
			$lt: endOfToday.toDate(),
		},
	});

	if (existingStatTimesheetInfo) {
		return;
	}
	const { employeeEarnings, numberOfDaysWorked, statPayRate } = await findStatPayMonthlyEarning(
		employeeId,
		companyName,
	);
	const statPayAmount = numberOfDaysWorked ? employeeEarnings / numberOfDaysWorked : 0;
	// NEW-16: a pay rate of 0 gave NaN hours (0/0) and the timesheet insert failed.
	const rate = safeNum(statPayRate);
	const statHours = rate > 0 && Number.isFinite(statPayAmount / rate) ? statPayAmount / rate : 0;

	const startTime = moment().set({
		hour: 13,
		minute: 0,
		second: 0,
		millisecond: 0,
	});
	const endTime = startTime.clone().add(statHours, "hours");
	const newStatTimeSheetRecord = {
		employeeId,
		companyName,
		payType: PAY_TYPES_TITLE.STAT_PAY,
		clockIn: startTime,
		clockOut: endTime,
		statDayHours: statHours.toFixed(2),
		source: TIMESHEET_SOURCE.SYSTEM,
	};
	await addTimesheetEntry(newStatTimeSheetRecord);
};

const addStatHolidayTimesheet = async (companyName) => {
	try {
		const result = await getPayrollActiveEmployees(companyName);
		await Promise.all(
			result.map(async (emp) => {
				try {
					if (!emp?.empId?._id) return;

					await addStatHolidayDefaultTimesheet(emp.empId._id, companyName);
				} catch (err) {
					console.error("[StatHoliday] Failed:", {
						empId: emp?.empId?._id,
						error: err.message,
					});
				}
			}),
		);

		console.log("StatHolidayDefaultTimesheet added");
	} catch (error) {
		console.error("Error adding stat holiday records:", {
			message: error.message,
			stack: error.stack,
		});
	}
};

const findStatPayMonthlyEarning = async (employeeId, companyName) => {
	const currentDate = moment.utc();
	const past30Days = moment.utc().subtract(30, "days");
	const timesheets = await Timesheet.find({
		deleted: false,
		employeeId,
		companyName,
		clockIn: {
			$gte: past30Days.toDate(), // 30 days ago
			$lte: currentDate.toDate(), // Up to the current date
		},
	});

	const empPayInfoResult = await EmployeePayInfo.findOne({ empId: employeeId, companyName });
	const record = empPayInfoResult?.roles?.[0];
	const statPayRate = safeNum(record?.payRate);
	const employeeEarnings = timesheets?.reduce((acc, item) => {
		return (
			acc +
			(item?.[PARAM_HOURS.REGULAR] * (record?.payRate || 0) +
				item?.overtimeHoursWorked * (record?.overTimePay || 0) +
				item?.dblOvertimeHoursWorked * (record?.dblOverTimePay || 0) +
				item?.statDayHoursWorked * (record?.statWorkPay || 0) +
				item?.statDayHours * (record?.statPay || 0) +
				item?.sickPayHours * (record?.sickPay || 0) +
				item?.vacationPayHours * (record?.vacationPay || 0) +
				item?.bereavementPayHours * (record?.bereavementPay || 0) +
				item?.personalPayHours * (record?.personalDayPay || 0))
		);
	}, 0);

	return {
		employeeEarnings,
		numberOfDaysWorked: timesheets?.length || 0,
		statPayRate,
	};
};

const getHolidays = async (record) =>
	await Holiday.find(record).sort({
		date: 1,
	});

const isYear = (year) => /^\d{4}$/.test(String(year)) && Number(year) >= 1990 && Number(year) <= 2100;

/**
 * STAT-HOLIDAYS: a BC company's statutory holidays for a year are filled in
 * from the BC rules the first time that year is used (holiday page, daily stat
 * job), so nobody has to type them in every year, for past or future years
 * alike. Only a year with no holidays at all is filled in, so holidays the
 * company deleted or renamed stay as the company left them. Upsert by
 * (company, year, name) with a unique index (uniq_holiday_per_year), so two
 * requests at the same moment cannot double them.
 * Returns the number of holidays added.
 */
const ensureStatHolidays = async (companyName, year) => {
	if (!companyName || !isYear(year)) return 0;
	const existing = await Holiday.countDocuments({ companyName, year: String(year) });
	if (existing > 0) return 0;
	const company = await Company.findOne({ name: companyName }).select("address").lean();
	if (!company || !isBCCompany(company)) return 0;
	const holidays = bcStatHolidays(year);
	await Promise.all(
		holidays.map(({ name, date }) =>
			Holiday.updateOne(
				{ companyName, year: String(year), name },
				{ $setOnInsert: { companyName, year: String(year), name, date, source: "BC_STATUTORY" } },
				{ upsert: true },
			).catch((error) => {
				// another request inserted it at the same moment (unique index)
				if (error?.code !== 11000) throw error;
			}),
		),
	);
	return holidays.length;
};

const getStatHoliday = async (req, res) => {
	const { companyName, year } = req.params;
	if (!isYear(year)) return res.status(400).json({ message: "year must be a 4-digit year" });
	try {
		await ensureStatHolidays(companyName, year);
		const holidays = await getHolidays({ companyName, year });
		return res.status(200).json(holidays);
	} catch (error) {
		console.error("[getStatHoliday Error]:", {
			message: error.message,
			stack: error.stack,
			params: req.params,
		});

		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

const addStatHoliday = async (req, res) => {
	const { name, date, company } = req.body;

	// NEW-16: the duplicate check used the current year, so the same holiday could
	// be added twice for another year and a next-year holiday was reported as a
	// duplicate of this year's. Use the year of `date` (as the create below does).
	const holidayDate = typeof date === "string" || typeof date === "number" ? moment.utc(date) : null;
	if (!holidayDate?.isValid()) {
		return res.status(400).json({ message: "A valid holiday date is required" });
	}
	if (typeof name !== "string") {
		return res.status(400).json({ message: "Holiday name is required" });
	}

	try {
		const data = {
			name,
			companyName: company,
			year: holidayDate.format("YYYY"),
		};

		const existingRecord = await Holiday.findOne(data);
		if (existingRecord) {
			return res.status(409).json({ message: "Record already exists" });
		}

		const newHoliday = await Holiday.create({
			...data,
			date,
			year: holidayDate.format("YYYY"),
		});

		return res.status(201).json(newHoliday);
	} catch (error) {
		// same name already in that year (unique index), e.g. two adds at once
		if (error?.code === 11000) return res.status(409).json({ message: "Record already exists" });
		console.error("[addStatHoliday Error]:", {
			message: error.message,
			stack: error.stack,
		});
		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

const updateStatHoliday = async (req, res) => {
	const { id } = req.params;
	try {
		const existingInfo = await Holiday.findById(id);
		if (!existingInfo) {
			return res.status(404).json({
				message: "Record not found.",
			});
		}

		const { _id, year: _ignored, ...updateData } = req.body;
		// STAT-HOLIDAYS: moving a holiday to a date in another year moves it to that
		// year's list (the year used to stay as it was).
		if (updateData.date !== undefined) {
			const newDate = moment.utc(updateData.date);
			if (!newDate.isValid()) {
				return res.status(400).json({ message: "A valid holiday date is required" });
			}
			updateData.year = newDate.format("YYYY");
		}

		const updatedInfo = await updateHolidayRecord(id, updateData);
		return res.status(200).json(updatedInfo);
	} catch (error) {
		if (error?.code === 11000) {
			return res.status(409).json({ message: "A holiday with this name already exists in that year" });
		}
		console.error("[updateStatHoliday Error]:", {
			message: error.message,
			stack: error.stack,
		});
		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

const deleteStatHoliday = async (req, res) => {
	const { id } = req.params;

	try {
		const resource = await Holiday.findByIdAndDelete(id);

		if (!resource) {
			return res.status(404).json({
				message: "Holiday Details not found.",
			});
		}

		return res.status(200).json({
			message: `Holiday ${id} deleted successfully`,
		});
	} catch (error) {
		console.error("[deleteStatHoliday Error]:", {
			message: error.message,
			stack: error.stack,
		});
		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

const updateHolidayRecord = async (id, data) =>
	await Holiday.findByIdAndUpdate(
		id,
		{ $set: data },
		{
			new: true,
		},
	);

module.exports = {
	addStatHoliday,
	updateStatHoliday,
	addStatHolidayTimesheet,
	getHolidays,
	getStatHoliday,
	ensureStatHolidays,
	deleteStatHoliday,
};
