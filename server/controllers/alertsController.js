const { ALERTS_TYPE } = require("../constants/pay.constants");
const EmployeeAlertsViolationInfo = require("../models/EmployeeAlertsViolationInfo");
const EmployeeBankingInfo = require("../models/EmployeeBankingInfo");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const EmployeePayInfo = require("../models/EmployeePayInfo");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");

const { minimumWageOn } = require("../constants/minimumWage.constants");

const findAlertInfo = async (record) => await EmployeeAlertsViolationInfo.findOne(record);

const addAlertInfo = async (record) => await EmployeeAlertsViolationInfo.create(record);

/**
 * ALERTS-01: an alert is the CURRENT state of one problem (company, employee,
 * type), not a log entry per pay period. It used to be stored once per pay
 * period (the existence check included payPeriodNum) while the list ignored
 * the period, so an unfixed problem showed once for every pay run it had been
 * seen in. Now each review upserts the one row for (company, employee, type),
 * removes older copies of it, and removes the alert once the problem is fixed.
 */
const setAlert = async (key, fields) => {
	const upsert = () =>
		EmployeeAlertsViolationInfo.findOneAndUpdate(
			key,
			{ $set: { ...key, ...fields } },
			{ upsert: true, new: true, sort: { createdOn: -1 } },
		);
	let row;
	try {
		row = await upsert();
	} catch (error) {
		// two reviews inserted the same alert at once (unique index): update it
		if (error?.code !== 11000) throw error;
		row = await upsert();
	}
	// legacy copies of the same alert (one per pay period)
	if (row?._id) await EmployeeAlertsViolationInfo.deleteMany({ ...key, _id: { $ne: row._id } });
	return row;
};

const clearAlert = (key) => EmployeeAlertsViolationInfo.deleteMany(key);

/** The problems of one employee: { [ALERTS_TYPE]: fields | null } (null = no problem). */
const findEmployeeProblems = ({ bank, profile, payInfo }, minimumWage) => {
	const missingBankInfo = !bank?.bankNum || !bank?.transitNum || !bank?.accountNum;
	const roles = payInfo?.roles || [];
	const lowWage = roles.some((r) => Number(r?.payRate) < minimumWage);
	const missingSIN = !profile?.SIN || String(profile.SIN).trim() === "";
	return {
		[ALERTS_TYPE.BANK]: missingBankInfo
			? { description: "Banking information missing", actionRequired: true }
			: null,
		[ALERTS_TYPE.WAGE]: !roles.length
			? { description: "Pay rate missing.", actionRequired: true }
			: lowWage
				? { description: `Minimum wage is below $${minimumWage.toFixed(2)}.`, actionRequired: true }
				: null,
		[ALERTS_TYPE.SIN]: missingSIN ? { description: "SIN missing", actionRequired: false } : null,
	};
};

const addAlertsAndViolations = async (req, res) => {
	const { companyName, inputsReviewData } = req.body;
	try {
		if (!Array.isArray(inputsReviewData)) {
			console.error("[Alerts] Invalid inputsReviewData:", inputsReviewData);
			return res.status(400).json({
				message: "inputsReviewData must be an array",
			});
		}
		const minimumWage = minimumWageOn();
		const seen = new Set();

		for (const data of inputsReviewData) {
			try {
				const empId = String(data?.empId?._id || data?.empId || "");

				if (!empId) {
					console.warn("[Alerts] Missing empId:", data);
					continue;
				}
				if (seen.has(empId)) continue; // same employee listed twice in one review
				seen.add(empId);

				const [bank, profile, payInfo] = await Promise.all([
					EmployeeBankingInfo.findOne({ companyName, empId })
						.select("empId bankNum transitNum accountNum")
						.lean(),
					EmployeeProfileInfo.findOne({ companyName, empId }).select("empId SIN").lean(),
					EmployeePayInfo.findOne({ companyName, empId }).select("empId roles").lean(),
				]);

				const problems = findEmployeeProblems({ bank, profile, payInfo }, minimumWage);
				for (const [type, problem] of Object.entries(problems)) {
					const key = { companyName, empId, type };
					if (problem) await setAlert(key, { ...problem, payPeriodNum: data?.payPeriodNum });
					else await clearAlert(key);
				}
			} catch (empError) {
				console.error("[Alerts] Error processing employee:", {
					error: empError.message,
					stack: empError.stack,
					data,
					companyName,
				});
			}
		}
		return res.status(200).json({
			message: "Alerts processed successfully",
		});
	} catch (error) {
		console.error("[Alerts] Fatal error in addAlertsAndViolations:", {
			message: error.message,
			stack: error.stack,
			body: req.body,
		});

		return res.status(500).json({
			message: "Failed to process alerts",
		});
	}
};

/**
 * Removes an employee's alerts of one type once the problem is fixed (bank,
 * pay rate, SIN saved). companyName limits it to that company (it used to
 * clear the employee's alerts in every company).
 */
const deleteAlerts = async (empId, type, companyName) => {
	const filter = { empId: String(empId), type };
	if (companyName) filter.companyName = companyName;
	return EmployeeAlertsViolationInfo.deleteMany(filter);
};

/** Newest row per (employee, type): hides legacy per-period copies not yet cleaned up. */
const latestPerProblem = (alerts) => {
	const seen = new Set();
	return (alerts || []).filter((a) => {
		const key = `${a?.empId?._id || a?.empId}|${a?.type}`;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
};

const getAlertsAndViolationsInfo = async (req, res) => {
	const EMP_INFO = {
		path: "empId",
		model: "Employee",
		select: ["companyId", "employeeId", "fullName", "primaryAddress", "employeeNo"],
	};
	const { companyName, payPeriodNum, selectedPayGroup } = req.params;

	try {
		const payrollActiveEmps = await EmployeeEmploymentInfo.find({
			payrollStatus: "Payroll Active",
			companyName,
		}).select("empId positions");

		const payrollActiveIds = payrollActiveEmps
			?.filter((emp) => {
				if (!emp?.empId) return false;

				if (!selectedPayGroup) return true;

				return emp?.positions?.find((p) => p?.employmentPayGroup === selectedPayGroup);
			})
			?.map((emp) => emp.empId);

		const alerts = await EmployeeAlertsViolationInfo.find({
			companyName,
			// payPeriodNum,
			empId: { $in: payrollActiveIds },
		})
			.populate(EMP_INFO)
			.sort({
				createdOn: -1,
			});
		return res.status(200).json(latestPerProblem(alerts));
	} catch (error) {
		console.error("❌ getAlertsAndViolationsInfo error:", {
			message: error.message,
			stack: error.stack,
		});

		return res.status(500).json({
			message: "Internal server error",
		});
	}
};

const getTotalAlertsAndViolationsInfo = async (req, res) => {
	const { companyName, payPeriodNum } = req.params;

	try {
		// one per (employee, type), the same rows the list shows
		const [{ count = 0 } = {}] = await EmployeeAlertsViolationInfo.aggregate([
			{ $match: { companyName } },
			{ $group: { _id: { empId: "$empId", type: "$type" } } },
			{ $count: "count" },
		]);
		return res.status(200).json(count);
	} catch (error) {
		console.error("❌ getTotalAlertsAndViolationsInfo error:", {
			message: error.message,
			stack: error.stack,
		});

		return res.status(500).json({
			message: "Internal server error",
		});
	}
};

module.exports = {
	addAlertInfo,
	addAlertsAndViolations,
	deleteAlerts,
	findAlertInfo,
	getAlertsAndViolationsInfo,
	getTotalAlertsAndViolationsInfo,
};
