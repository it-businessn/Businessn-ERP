const moment = require("moment");

const EmployeePayInfo = require("../models/EmployeePayInfo");
const Timesheet = require("../models/Timesheet");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");

const { calcPayRates, getPayType } = require("../helpers/payrollHelper");
const {
	addOvertimeRecord,
	addTimesheetEntry,
	calcTotalWorkedHours,
} = require("../services/timecardService");
const { findEmpPayInfo } = require("./employmentInfoController");
const { EARNING_TYPE } = require("../constants/earning.constants");
const { PAY_TYPES_TITLE } = require("../constants/pay.constants");
const { ROLES } = require("../constants/roles.constants");
const {
	TIMESHEET_STATUS,
	TIMESHEET_SOURCE,
	PUNCH_CODE,
	PARAM_HOURS,
} = require("../constants/timesheet.constants");
const { NEXT_DAY } = require("../utils/date.util");
const { safeNum } = require("../utils/time.util");

const findByRecordTimesheets = async (record, skip, limit) => {
	try {
		// const y = await Timesheet.deleteMany({
		// 	clockIn: {
		// 		$lte: moment("2024-10-22"),
		// 	},
		// });
		// console.log("del", y);
		const result = await Timesheet.find(record)
			// .skip(skip)
			// .limit(limit)
			// .limit(50)
			.populate({
				path: "employeeId",
				model: "Employee",
				select: ["fullName"],
			})
			.lean();
		// if (!result) {
		// 	console.warn("[Timesheet] No results found for record:", record);
		// 	return [];
		// }

		const empData = result.sort((a, b) => {
			const nameA = a.employeeId?.fullName || "";
			const nameB = b.employeeId?.fullName || "";

			if (nameA < nameB) return -1;
			if (nameA > nameB) return 1;

			return (a.clockIn ?? 0) - (b.clockIn ?? 0);
		});
		return empData;
	} catch (error) {
		console.error("❌ findByRecordTimesheets ERROR", {
			message: error.message,
			stack: error.stack,
			record,
		});
		throw error;
	}
};

const getTimesheetResult = async (companyName) => {
	try {
		const payInfoResult = await findEmpPayInfo(companyName);
		// if (!Array.isArray(payInfoResult)) {
		// 	console.warn("[PayInfo] Invalid result:", payInfoResult);
		// 	return new Map();
		// }

		const payInfoMapResult = new Map(
			payInfoResult
				.filter((p) => p?.empId) // prevent null keys breaking Map
				.map((payInfo) => {
					if (!payInfo.empId) {
						console.warn("[getTimesheetResult] Missing empId:", payInfo);
					}

					return [payInfo.empId, payInfo?.roles ?? []];
				}),
		);

		return payInfoMapResult;
	} catch (error) {
		console.error("❌ getTimesheetResult ERROR", {
			message: error.message,
			stack: error.stack,
			companyName,
		});

		throw error;
	}
};

const getEmploymentResult = async (companyName) => {
	try {
		const empInfoResult = await EmployeeEmploymentInfo.find({
			companyName,
			payrollStatus: "Payroll Active",
			employmentRole: { $ne: ROLES.SHADOW_ADMIN },
			empId: { $exists: true, $ne: null },
		}).select("empId positions");

		// if (!Array.isArray(empInfoResult)) {
		// 	console.warn("[EmpInfo] Invalid result:", empInfoResult);
		// 	return new Map();
		// }

		const empInfoMap = new Map();
		for (const empInfo of empInfoResult) {
			const empId = empInfo?.empId?.toString();

			if (!empId) {
				console.warn("[getEmploymentResult] Missing empId record:", empInfo);
				continue;
			}

			empInfoMap.set(empId, {
				positions: empInfo.positions ?? [],
			});
		}

		return empInfoMap;
	} catch (error) {
		console.error("❌ getEmploymentResult", {
			message: error.message,
			stack: error.stack,
			companyName,
		});

		throw error;
	}
};

const mapTimesheet = (payInfos, timesheets, empInfos, selectedPayGroupOption) => {
	let missingPayInfo = 0;
	let missingEmpInfo = 0;

	timesheets.forEach((timesheet) => {
		const empIdStr = timesheet?.employeeId?._id?.toString();
		if (!empIdStr) {
			console.warn("[Timesheet] Missing empId:", timesheet?._id);
			return;
		}

		if (empInfos?.has(empIdStr)) {
			timesheet.positions = empInfos.get(empIdStr)?.positions ?? [];
		} else {
			missingEmpInfo++;
		}
		if (payInfos?.has(empIdStr)) {
			const payInfo = payInfos.get(empIdStr) ?? [];
			timesheet.payInfo = payInfo;

			const empRole = timesheet?.role
				? payInfo.find(({ title }) => title === timesheet.role)
				: payInfo[0];

			if (empRole) {
				const empRoleRates = calcPayRates({
					...empRole,
					regPay: empRole?.payRate || 0,
				});

				Object.assign(timesheet, {
					regPay: empRoleRates?.regPay ?? 0,
					overTimePay: empRoleRates?.overTimePay ?? 0,
					dblOverTimePay: empRoleRates?.dblOverTimePay ?? 0,
					statWorkPay: empRoleRates?.statWorkPay ?? 0,
					statPay: empRoleRates?.statPay ?? 0,
					sickPay: empRoleRates?.sickPay ?? 0,
					vacationPay: empRoleRates?.vacationPay ?? 0,
					bereavementPay: empRoleRates?.bereavementPay ?? 0,
					personalDayPay: empRoleRates?.personalDayPay ?? 0,
					typeOfEarning: empRole?.typeOfEarning,
				});
			}
		} else {
			missingPayInfo++;
		}
	});
	console.log("[Timesheet Mapping Summary]", {
		total: timesheets.length,
		missingPayInfo,
		missingEmpInfo,
	});
	const nonSalariedTimeEntries = timesheets
		?.filter(({ typeOfEarning, positions }) => {
			return (
				typeOfEarning !== EARNING_TYPE.FT &&
				typeOfEarning !== EARNING_TYPE.PT &&
				Array.isArray(positions) &&
				positions.some((position) => position?.employmentPayGroup === selectedPayGroupOption)
			);
		})
		?.map((timesheet) => {
			const isEditableBase = timesheet.source !== TIMESHEET_SOURCE.EMPLOYEE;
			const isAppOrTad = timesheet.manualAdded || timesheet.source === TIMESHEET_SOURCE.TAD;
			const isEditable =
				isEditableBase && isAppOrTad
					? !moment(timesheet.clockIn).isSame(moment(), "day")
					: isEditableBase;

			const showBreak = timesheet.payType.includes("Break")
				? timesheet.approveStatus === TIMESHEET_STATUS.APPROVED
				: isEditable;
			return {
				...timesheet,
				isEditable,
				showBreak,
				isDisabled: !timesheet?.clockIn || !timesheet?.clockOut,
			};
		});
	return nonSalariedTimeEntries;
};

const getTimesheets = async (req, res) => {
	const { companyName } = req.params;
	try {
		const timesheets = await findByRecordTimesheets({
			deleted: false,
			companyName,
			clockIn: { $lte: NEXT_DAY },
		});

		const payInfo = await getTimesheetResult(companyName);
		const result = mapTimesheet(payInfo, timesheets);
		return res.status(200).json(result);
	} catch (error) {
		console.error("❌ getTimesheets ERROR", {
			message: error.message,
			stack: error.stack,
			params: req.params,
		});

		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

const getFilteredTimesheetsByStatus = async (req, res) => {
	let filteredData;
	try {
		const { companyName, filter } = req.params;
		if (!filter || !filter.includes("=")) {
			throw new Error("Invalid filter format");
		}
		const rawValue = filter.split("=").slice(1).join("=");
		const decoded = decodeURIComponent(rawValue);
		filteredData = JSON.parse(decoded);

		const { startDate, endDate } = filteredData;
		if (!startDate || !endDate) {
			console.error("❌ Missing date range:", filteredData);

			return res.status(400).json({
				message: "startDate and endDate are required",
			});
		}

		const start = moment(startDate).utc().startOf("day");
		const end = moment(endDate).utc().endOf("day");
		if (!start.isValid() || !end.isValid()) {
			console.error("❌ Invalid dates:", { startDate, endDate });

			return res.status(400).json({
				message: "Invalid date range",
			});
		}

		const timesheets = await Timesheet.find({
			deleted: false,
			companyName,
			clockIn: {
				$gte: start.toDate(),
				$lte: end.toDate(),
			},
		}).select("approveStatus");

		return res.status(200).json(timesheets);
	} catch (error) {
		console.error("❌ getFilteredTimesheetsByStatus ERROR", {
			message: error.message,
			stack: error.stack,
			params: req.params,
		});

		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

const getFilteredTimesheets = async (req, res) => {
	let filteredData;
	try {
		const { companyName, filter } = req.params;
		if (!filter || !filter.includes("=")) {
			throw new Error("Invalid filter format");
		}
		const rawValue = filter.split("=").slice(1).join("=");
		const decoded = decodeURIComponent(rawValue);
		filteredData = JSON.parse(decoded);

		const { startDate, endDate } = filteredData;
		const selectedPayGroupOption = filteredData?.selectedPayGroupOption;

		let { page, limit } = req.query;
		page = parseInt(page) || 1;
		limit = parseInt(limit) || 10;
		const skip = (page - 1) * limit;

		const filterRecordCriteria = {
			deleted: false,
			companyName,
			clockIn: {
				$gte: moment.utc(startDate).startOf("day").toDate(),
				$lte: moment.utc(endDate).endOf("day").toDate(),
			},
			// payType: { $ne: PAY_TYPES_TITLE.REG_PAY },
			// regHoursWorked: { $ne: 0 },
		};

		let timesheets = await findByRecordTimesheets(filterRecordCriteria, skip, limit);

		const payInfo = await getTimesheetResult(companyName);
		const employmentInfo = await getEmploymentResult(companyName);

		let result = mapTimesheet(payInfo, timesheets, employmentInfo, selectedPayGroupOption);

		// const total = await findByRecordTimesheets(filterRecordCriteria);

		if (filteredData?.filteredEmployees?.length) {
			result = result.filter((item) =>
				filteredData?.filteredEmployees?.includes(item?.employeeId?.fullName),
			);
		}
		if (filteredData?.filteredDept?.length) {
			result = result.filter((item) =>
				item?.positions?.some((p) => filteredData.filteredDept.includes(p?.employmentDepartment)),
			);
		}

		if (filteredData?.filteredCC?.length) {
			result = result.filter((item) =>
				item?.positions?.some((p) => filteredData.filteredCC.includes(p?.employmentCostCenter)),
			);
		}

		return res.status(200).json({
			page,
			limit,
			total: timesheets?.length,
			totalPages: Math.ceil(timesheets?.length / limit),
			items: result,
		});
	} catch (error) {
		console.error("❌ getFilteredTimesheets ERROR", {
			message: error.message,
			stack: error.stack,
		});

		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

const getEmployeeTimesheet = async (req, res) => {
	let filteredData;
	try {
		const { companyName, employeeId, filter } = req.params;
		if (!filter || !filter.includes("=")) {
			throw new Error("Invalid filter format");
		}
		const rawValue = filter.split("=").slice(1).join("=");
		const decoded = decodeURIComponent(rawValue);
		filteredData = JSON.parse(decoded);

		const { startDate, endDate } = filteredData;

		const timesheets = await Timesheet.find({
			deleted: false,
			companyName,
			employeeId,
			clockIn: {
				$gte: moment(startDate).startOf("day").toDate(),
				$lte: moment(endDate).endOf("day").toDate(),
			},
		}).sort({ createdOn: -1 });
		return res.status(200).json(timesheets);
	} catch (error) {
		console.error("❌ getEmployeeTimesheet ERROR", {
			message: error.message,
			stack: error.stack,
		});

		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

const createManualTimesheet = async (req, res) => {
	const { company, punch, employeeId, source } = req.body;

	try {
		const isClockIn = punch === PUNCH_CODE.CLOCK_IN;
		const isBreakIn = punch === PUNCH_CODE.BREAK_IN;
		const isClockOut = punch === PUNCH_CODE.CLOCK_OUT;
		const isBreakOut = punch === PUNCH_CODE.BREAK_OUT;

		const param_hours = isClockIn || isClockOut ? PARAM_HOURS.REGULAR : PARAM_HOURS.BREAK;
		const payType = getPayType(param_hours === PARAM_HOURS.BREAK);

		const date = new Date();
		date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

		if (isClockIn || isBreakIn) {
			const newEntry = {
				employeeId,
				clockIn: moment.utc(date).toISOString(),
				[param_hours]: 0,
				companyName: company,
				payType,
				manualAdded: true,
				source,
			};
			const newTimesheet = await addTimesheetEntry(newEntry);
			return res.status(201).json(newTimesheet);
		}
		const existingPunch = {
			employeeId,
			clockIn: { $ne: null },
			companyName: company,
			payType,
		};
		if (isClockOut) {
			existingPunch[param_hours] = 0;
		}
		const openEntry = await Timesheet.findOne(existingPunch).sort({
			clockIn: -1,
		});
		if (openEntry) {
			openEntry.clockOut = moment.utc(date).toISOString();
			if (isClockOut) {
				const totalWorkedHours = calcTotalWorkedHours(openEntry.clockIn, openEntry.clockOut);
				openEntry[param_hours] = totalWorkedHours;
			}
			await openEntry.save();
			return res.status(200).json(openEntry);
		} else {
			return res.status(400).json({
				message: "Invalid punch type",
			});
		}
	} catch (error) {
		console.error("❌ createManualTimesheet ERROR", {
			message: error.message,
			stack: error.stack,
			body: req.body,
		});

		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

const createTimesheet = async (req, res) => {
	let { company, type, clockIn, clockOut, employeeId, param_hours, startTime, endTime, source } =
		req.body;
	try {
		if (startTime) clockIn = setTime(clockIn, startTime);
		if (endTime) clockOut = setTime(clockIn, endTime);

		// const start = new Date(clockIn);
		// const end = new Date(clockOut);

		// if (isNaN(start) || isNaN(end)) {
		// 	return res.status(400).json({
		// 		message: "Invalid date values",
		// 	});
		// }

		// if (end <= start) {
		// 	return res.status(400).json({
		// 		message: "clockOut must be after clockIn",
		// 	});
		// }

		// // whitelist param_hours
		// const allowedParams = [PARAM_HOURS.REGULAR, PARAM_HOURS.BREAK];
		// if (!allowedParams.includes(param_hours)) {
		// 	return res.status(400).json({
		// 		message: "Invalid param_hours",
		// 	});
		// }

		// // optional: overlap check
		// const overlapping = await Timesheet.findOne({
		// 	employeeId,
		// 	companyName: company,
		// 	clockIn: { $lt: end },
		// 	clockOut: { $gt: start },
		// });

		// if (overlapping) {
		// 	return res.status(409).json({
		// 		message: "Overlapping timesheet exists",
		// 	});
		// }

		const totalWorkedHours = calcTotalWorkedHours(clockIn, clockOut);

		if (type === PAY_TYPES_TITLE.REG_PAY && totalWorkedHours > 8) {
			const adjustedClockOut = await addOvertimeRecord(
				clockIn,
				clockOut,
				employeeId,
				company,
				source,
			);
			const newEntry = {
				employeeId,
				clockIn,
				clockOut: adjustedClockOut,
				[param_hours]: 8,
				companyName: company,
				payType: type,
				source,
			};
			const newTimesheetWithOvertime = await addTimesheetEntry(newEntry);
			return res.status(201).json(newTimesheetWithOvertime);
		}

		const newEntry = {
			employeeId,
			clockIn,
			clockOut,
			[param_hours]: totalWorkedHours,
			companyName: company,
			payType: type,
			source,
		};

		const newTimesheet = await addTimesheetEntry(newEntry);
		return res.status(201).json(newTimesheet);
	} catch (error) {
		console.error("❌ createTimesheet ERROR", {
			message: error.message,
			stack: error.stack,
			body: req.body,
		});

		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

const setTime = (date, time) => {
	// const utcDate = date ? (notDevice ? moment(date) : moment.utc(date)) : moment.utc();
	if (!date || !time || typeof time !== "string") {
		throw new Error("Invalid date or time input");
	}

	const utcDate = moment.utc(date);

	if (!utcDate.isValid()) {
		throw new Error("Invalid date");
	}

	const [hoursStr, minutesStr] = time.split(":");

	const hours = parseInt(hoursStr, 10);
	const minutes = parseInt(minutesStr, 10);

	if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
		throw new Error("Invalid time format");
	}

	utcDate.set({
		hour: hours,
		minute: minutes,
		second: 0,
		// millisecond: 0,
	});

	return utcDate.toISOString();
};

const actionAllTimesheets = async (req, res) => {
	const { timesheetIDs, approveStatus } = req.body;

	try {
		if (approveStatus === TIMESHEET_STATUS.DELETE) {
			const result = await Timesheet.deleteMany({ _id: { $in: timesheetIDs } });
			return res.status(200).json(result);
		}

		const updatedIDs = await Timesheet.updateMany(
			{ _id: { $in: timesheetIDs } },
			{ $set: { approveStatus } },
		);

		return res.status(200).json(updatedIDs);
	} catch (error) {
		console.error("❌ actionAllTimesheets ERROR", {
			message: error.message,
			stack: error.stack,
			body: req.body,
		});

		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

const updateTimesheetRole = async (req, res) => {
	const { id } = req.params;
	const { role, positions = [] } = req.body;
	try {
		if (!Array.isArray(positions) || positions.length === 0) {
			return res.status(400).json({
				message: "positions must be a non-empty array",
			});
		}
		const updatedRole = positions.find((p) => p && p.title === role);

		if (!updatedRole) {
			return res.status(404).json({
				message: `Role '${role}' not found in positions`,
			});
		}
		const payRate = safeNum(updatedRole.payRate);

		if (isNaN(payRate)) {
			return res.status(400).json({
				message: "Invalid payRate for selected role",
			});
		}
		const updatedData = {
			role,
			department: updatedRole.employmentDepartment,
			regPay: payRate,
			overTimePay: payRate * 1.5,
			dblOverTimePay: payRate * 2,
			statWorkPay: payRate * 1.5,
			statPay: payRate,
			sickPay: payRate,
			vacationPay: payRate,
			personalDayPay: payRate,
			bereavementPay: payRate,
		};

		const timesheet = await updateTimesheetData(id, updatedData);
		return res.status(200).json(timesheet);
	} catch (error) {
		console.error("❌ updateTimesheetRole error:", {
			message: error.message,
			stack: error.stack,
			id,
			role,
		});

		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

const updateTimesheetPayType = async (req, res) => {
	try {
		const { id } = req.params;
		const { _id, ...updateData } = req.body;
		const timesheet = await updateTimesheetData(id, updateData);

		if (!timesheet) {
			return res.status(404).json({
				message: "Timesheet not found or not updated",
			});
		}
		return res.status(200).json(timesheet);
	} catch (error) {
		console.error("❌ updateTimesheetPayType error:", {
			id,
			body: req.body,
			message: error.message,
			stack: error.stack,
		});

		return res.status(500).json({
			message: "Internal server error",
		});
	}
};

const updateTimesheet = async (req, res) => {
	try {
		const { id } = req.params;
		let { clockIn, clockOut, empId, approve, param_hours, company, startTime, endTime, source } =
			req.body;
		const existing = await Timesheet.findById(id);
		if (!existing) {
			return res.status(404).json({
				message: "Timesheet not found",
			});
		}

		const empPayInfoResult = await EmployeePayInfo.findOne({
			empId,
			companyName: existing?.companyName,
		});

		const roleTitle = empPayInfoResult?.roles?.[1]?.title;
		if (existing.role && roleTitle && existing.role === roleTitle) {
			param_hours = PARAM_HOURS.REGULAR2;
		}

		if (startTime) clockIn = setTime(clockIn, startTime);
		if (endTime) clockOut = setTime(clockIn, endTime);
		// const totalWorkedHours = existingTimesheetInfo[param_hours]
		// 	? existingTimesheetInfo[param_hours]
		// 	: calcTotalWorkedHours(clockIn, clockOut);
		const totalWorkedHours = calcTotalWorkedHours(clockIn, clockOut);

		const approveStatus =
			approve === true
				? TIMESHEET_STATUS.APPROVED
				: approve === false
					? TIMESHEET_STATUS.REJECTED
					: TIMESHEET_STATUS.PENDING;

		if (param_hours === PARAM_HOURS.REGULAR && totalWorkedHours > 8) {
			const adjustedClockOut = await addOvertimeRecord(clockIn, clockOut, empId, company, source);

			const updated = await updateTimesheetData(id, {
				clockIn,
				clockOut: adjustedClockOut,
				[param_hours]: 8,
				approveStatus,
				source,
			});

			return res.status(200).json(updated);
		}

		let updatedWorkedHrs = totalWorkedHours;

		if (param_hours === PARAM_HOURS.BREAK) {
			updatedWorkedHrs = approve ? totalWorkedHours : 0;

			const nearest = await Timesheet.find({
				deleted: false,
				employeeId: empId,
				companyName: company,
				payType: PAY_TYPES_TITLE.REG_PAY,
				clockIn: { $lte: moment(clockIn).toDate() },
				clockOut: { $gte: moment(clockOut).toDate() },
			}).sort({ clockIn: -1 });

			if (!nearest?.length) {
				return res.status(201).json({
					message: "Break must be within valid timeframe.",
				});
			}
			const regRecord = nearest[0];
			const adjustedRegHours =
				calcTotalWorkedHours(regRecord.clockIn, regRecord.clockOut) - updatedWorkedHrs;
			regRecord.regHoursWorked = adjustedRegHours;
			regRecord.source = source;

			await regRecord.save();
		}
		const updated = await updateTimesheetData(id, {
			clockIn,
			clockOut,
			[param_hours]: updatedWorkedHrs,
			approveStatus,
			source,
		});

		return res.status(200).json(updated);
	} catch (error) {
		console.error("❌ updateTimesheet error:", {
			id,
			body: req.body,
			message: error.message,
			stack: error.stack,
		});

		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

const updateTimesheetData = async (id, data) =>
	await Timesheet.findByIdAndUpdate(
		id,
		{ $set: data },
		{
			new: true,
		},
	);

const deleteTimesheet = async (req, res) => {
	const { id } = req.params;
	try {
		const { _id, ...updateData } = req.body;
		const timesheet = await updateTimesheetData(id, updateData);
		if (!timesheet) {
			return res.status(404).json({
				message: "Timesheet not found.",
			});
		}
		// const resource = await Timesheet.findByIdAndDelete({
		// 	_id: id,
		// });
		return res.status(200).json(`Timesheet with id ${id} deleted successfully.`);
	} catch (error) {
		console.error("❌ deleteTimesheet failed:", {
			id,
			body: req.body,
			message: error.message,
			stack: error.stack,
		});

		return res.status(500).json({
			message: "Internal server error while updating timesheet.",
		});
	}
};

module.exports = {
	getTimesheets,
	getEmployeeTimesheet,
	getFilteredTimesheets,
	getFilteredTimesheetsByStatus,
	createTimesheet,
	updateTimesheet,
	deleteTimesheet,
	createManualTimesheet,
	actionAllTimesheets,
	updateTimesheetPayType,
	updateTimesheetRole,
	setTime,
};
