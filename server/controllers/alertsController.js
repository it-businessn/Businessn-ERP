const EmployeeAlertsViolationInfo = require("../models/EmployeeAlertsViolationInfo");
const EmployeeBankingInfo = require("../models/EmployeeBankingInfo");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const EmployeePayInfo = require("../models/EmployeePayInfo");
const EmployeeProfileInfo = require("../models/EmployeeProfileInfo");

const { ALERTS_TYPE } = require("../services/data");

const findAlertInfo = async (record) => await EmployeeAlertsViolationInfo.findOne(record);

const addAlertInfo = async (record) => await EmployeeAlertsViolationInfo.create(record);

const addAlertsAndViolations = async (req, res) => {
	const { companyName, inputsReviewData } = req.body;

	try {
		for (const data of inputsReviewData) {
			const empBankResult = await EmployeeBankingInfo.findOne({
				companyName,
				empId: data?.empId?._id,
			}).select("empId bankNum transitNum accountNum");

			const empSINResult = await EmployeeProfileInfo.findOne({
				companyName,
				empId: data?.empId?._id,
			}).select("empId SIN");

			const empPayInfo = await EmployeePayInfo.findOne({
				companyName,
				empId: data?.empId?._id,
			}).select("empId roles");

			const missingBankInfo =
				!empBankResult?.bankNum || !empBankResult?.transitNum || !empBankResult?.accountNum;
			if (missingBankInfo) {
				const alertInfo = {
					empId: data?.empId?._id,
					companyName,
					description: "Banking information missing",
					actionRequired: true,
					type: ALERTS_TYPE.BANK,
				};
				const bankingInfoAlertExists = await findAlertInfo(alertInfo);
				if (!bankingInfoAlertExists) {
					alertInfo.payPeriodNum = data?.payPeriodNum;
					await addAlertInfo(alertInfo);
				}
			}

			const belowMinimumWage =
				!empPayInfo?.roles?.length ||
				empPayInfo?.roles?.find((_) => parseFloat(_?.payRate) < 17.85);
			if (belowMinimumWage) {
				const alertInfo = {
					empId: data?.empId?._id,
					companyName,
					description: "Minimum wage is below $17.85.",
					actionRequired: true,
					type: ALERTS_TYPE.WAGE,
				};
				const wageAlertExists = await findAlertInfo(alertInfo);
				if (!wageAlertExists) {
					alertInfo.payPeriodNum = data?.payPeriodNum;
					await addAlertInfo(alertInfo);
				}
			}

			const missingSINInfo = !empSINResult || !empSINResult.SIN || empSINResult.SIN === "";
			if (missingSINInfo) {
				const alertInfo = {
					empId: data?.empId?._id,
					companyName,
					actionRequired: false,
					description: "SIN missing",
					type: ALERTS_TYPE.SIN,
				};
				const SINViolationExists = await findAlertInfo(alertInfo);
				if (!SINViolationExists) {
					alertInfo.payPeriodNum = data?.payPeriodNum;
					await addAlertInfo(alertInfo);
				}
			}
		}
		return res.status(200).json({ message: "Alerts processed successfully" });
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const deleteAlerts = async (empId, type) => {
	const existingAlert = await EmployeeAlertsViolationInfo.deleteMany({
		empId,
		type,
	});
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
		}).select("empId");

		const payrollActiveIds = payrollActiveEmps
			?.filter(
				(emp) =>
					emp?.empId && emp?.positions?.find((_) => _.employmentPayGroup === selectedPayGroup),
			)
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
		return res.status(500).json({ message: "Internal Server Error", error });
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
		return res.status(500).json({ message: "Internal Server Error", error });
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
