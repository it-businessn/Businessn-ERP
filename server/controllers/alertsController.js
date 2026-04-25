const { ALERTS_TYPE } = require("../constants/pay.constants");
const EmployeeAlertsViolationInfo = require("../models/EmployeeAlertsViolationInfo");
const EmployeeBankingInfo = require("../models/EmployeeBankingInfo");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const EmployeePayInfo = require("../models/EmployeePayInfo");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");

const findAlertInfo = async (record) => await EmployeeAlertsViolationInfo.findOne(record);

const addAlertInfo = async (record) => await EmployeeAlertsViolationInfo.create(record);

const addAlertsAndViolations = async (req, res) => {
	const { companyName, inputsReviewData } = req.body;
	try {
		if (!Array.isArray(inputsReviewData)) {
			console.error("[Alerts] Invalid inputsReviewData:", inputsReviewData);
			return res.status(400).json({
				message: "inputsReviewData must be an array",
			});
		}

		for (const data of inputsReviewData) {
			try {
				const empId = data?.empId?._id || data?.empId;

				if (!empId) {
					console.warn("[Alerts] Missing empId:", data);
					continue;
				}

				const [empBankResult, empSINResult, empPayInfo] = await Promise.all([
					EmployeeBankingInfo.findOne({ companyName, empId })
						.select("empId bankNum transitNum accountNum")
						.lean(),

					EmployeeProfileInfo.findOne({ companyName, empId }).select("empId SIN").lean(),

					EmployeePayInfo.findOne({ companyName, empId }).select("empId roles").lean(),
				]);

				// BANK CHECK
				const missingBankInfo =
					!empBankResult?.bankNum || !empBankResult?.transitNum || !empBankResult?.accountNum;

				if (missingBankInfo) {
					const alertInfo = {
						empId,
						companyName,
						description: "Banking information missing",
						actionRequired: true,
						type: ALERTS_TYPE.BANK,
						payPeriodNum: data?.payPeriodNum,
					};

					const exists = await findAlertInfo(alertInfo);
					if (!exists) await addAlertInfo(alertInfo);
				}

				// WAGE CHECK
				const hasLowWage = empPayInfo?.roles?.some((r) => Number(r?.payRate) < 17.85);

				if (!empPayInfo?.roles?.length || hasLowWage) {
					const alertInfo = {
						empId,
						companyName,
						description: "Minimum wage is below $17.85.",
						actionRequired: true,
						type: ALERTS_TYPE.WAGE,
						payPeriodNum: data?.payPeriodNum,
					};

					const exists = await findAlertInfo(alertInfo);
					if (!exists) await addAlertInfo(alertInfo);
				}

				// SIN CHECK
				const missingSIN = !empSINResult?.SIN || empSINResult.SIN.trim() === "";

				if (missingSIN) {
					const alertInfo = {
						empId,
						companyName,
						description: "SIN missing",
						actionRequired: false,
						type: ALERTS_TYPE.SIN,
						payPeriodNum: data?.payPeriodNum,
					};

					const exists = await findAlertInfo(alertInfo);
					if (!exists) await addAlertInfo(alertInfo);
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

const deleteAlerts = async (empId, type) => {
	const result = await EmployeeAlertsViolationInfo.deleteMany({
		empId,
		type,
	});
	// console.log("[Alerts Delete]", {
	// 	empId,
	// 	type,
	// 	deletedCount: result?.deletedCount,
	// });
	// const existingAlert = await findAlertInfo({
	// 		empId,
	// 	});
	// 	if (existingAlert) {
	// 		const deleted = await EmployeeAlertsViolationInfo.findByIdAndDelete({
	// 			_id: existingAlert._id,
	// 		});
	// 		if (deleted) {
	// 			console.log(`Alert  with id ${existingAlert._id} deleted successfully.`);
	// 		} else {
	// 			console.log("Alert Details not found.");
	// 		}
	// 	}
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
		return res.status(200).json(alerts);
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
		const alerts = await EmployeeAlertsViolationInfo.countDocuments({
			companyName,
			// payPeriodNum,
		});
		return res.status(200).json(alerts);
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
