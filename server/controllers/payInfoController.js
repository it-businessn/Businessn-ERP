const EmployeePayInfo = require("../models/EmployeePayInfo");
const Group = require("../models/Group");
const { ALERTS_TYPE } = require("../services/data");
const { findEmpPayStubDetail } = require("../helpers/payStubHelper");
const { getPayrollActiveEmployees } = require("../helpers/userHelper");
const { findGroupEmployees } = require("./setUpController");
const { getEmployeeId } = require("./userController");
const { deleteAlerts } = require("./alertsController");
const { getRecordId } = require("./payStubController");
const { checkExtraRun } = require("../services/util");

const getAllPayInfo = async (req, res) => {
	const { companyName, payDate, isExtraRun, groupId } = req.params;
	try {
		const isExtraPayRun = checkExtraRun(isExtraRun);
		const employees = isExtraPayRun && (await findGroupEmployees(groupId, payDate));
		const group = await Group.findById(groupId).select("scheduleFrequency");
		const activeEmployees = isExtraPayRun
			? await getEmployeeId(employees)
			: await getPayrollActiveEmployees(companyName);

		const aggregatedResult = [];
		for (const employee of activeEmployees) {
			const result = await buildAmountAllocationEmpDetails(
				payDate,
				employee,
				companyName,
				group?.scheduleFrequency,
			);
			aggregatedResult.push(result);
		}

		res.status(200).json(aggregatedResult);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const buildAmountAllocationEmpDetails = async (
	payDate,
	employee,
	companyName,
	scheduleFrequency,
) => {
	const employeeId = employee?.empId?._id;
	const fullName = employee?.empId?.fullName;

	const empPayStubResult = await findEmpPayStubDetail(employeeId, payDate, companyName);

	const recordId = await getRecordId(
		empPayStubResult,
		employeeId,
		companyName,
		payDate,
		scheduleFrequency,
	);

	const result = {
		_id: recordId,
		empId: { _id: employeeId, fullName },
		commission: empPayStubResult?.commission ?? 0,
		bonus: empPayStubResult?.bonus ?? 0,
		reimbursement: empPayStubResult?.reimbursement ?? 0,
		retroactive: empPayStubResult?.retroactive ?? 0,
		terminationPayout: empPayStubResult?.terminationPayout ?? 0,
		vacationPayout: empPayStubResult?.vacationPayout ?? 0,
	};
	return result;
};

const getEmployeePayInfo = async (req, res) => {
	const { companyName, empId } = req.params;
	try {
		const result = await findEmployeePayInfoDetails(empId, companyName);
		return res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const findEmployeePayInfoDetails = async (empId, companyName) =>
	await EmployeePayInfo.findOne({
		empId,
		companyName,
	});

const updatePayInfo = async (id, data) =>
	await EmployeePayInfo.findByIdAndUpdate(id, data, {
		new: true,
	});

const addEmployeePayInfo = async (req, res) => {
	const { empId, companyName, roles } = req.body;
	try {
		if (roles) {
			roles.forEach((role) => {
				const regPay = role?.payRate;
				if (regPay) {
					role.overTimePay = 1.5 * regPay;
					role.dblOverTimePay = 2 * regPay;
					role.statWorkPay = 1.5 * regPay;
					role.statPay = regPay;
					role.sickPay = regPay;
					role.vacationPay = regPay;
					role.bereavementPay = regPay;
					role.personalDayPay = regPay;
				}
			});
			if (roles?.every((_) => parseFloat(_?.payRate) > 17.85)) {
				await deleteAlerts(empId, ALERTS_TYPE.WAGE);
			}
		}
		const existingPayInfo = await findEmployeePayInfoDetails(empId, companyName);
		if (existingPayInfo) {
			// const existingEmploymentInfo = await EmployeeEmploymentInfo.findOne({
			// 	empId,
			// 	companyName,
			// });
			// if (existingEmploymentInfo) {
			// 	await EmployeeEmploymentInfo.findByIdAndUpdate(
			// 		existingEmploymentInfo._id,
			// 		{ positions: roles },
			// 		{
			// 			new: true,
			// 		},
			// 	);
			// }
			const updatedPayInfo = await updatePayInfo(existingPayInfo._id, { roles });
			return res.status(201).json(updatedPayInfo);
		}
		const newPayInfo = await EmployeePayInfo.create({
			empId,
			companyName,
			roles,
		});
		return res.status(201).json(newPayInfo);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateEmployeePayInfo = async (req, res) => {
	const { id } = req.params;
	try {
		const { empId, roles } = req.body;

		const existingRecord = await EmployeePayInfo.findById(id);
		if (existingRecord) {
			roles?.forEach((role) => {
				const regPay = role?.payRate;
				if (regPay) {
					role.overTimePay = 1.5 * regPay;
					role.dblOverTimePay = 2 * regPay;
					role.statWorkPay = 1.5 * regPay;
					role.statPay = regPay;
					role.sickPay = regPay;
					role.vacationPay = regPay;
					role.bereavementPay = regPay;
					role.personalDayPay = regPay;
				}
			});
			if (roles?.every((_) => parseFloat(_?.payRate) > 17.85)) {
				await deleteAlerts(empId, ALERTS_TYPE.WAGE);
			}

			if (req.body?._id) delete req.body._id;
			const updatedPayInfo = await updatePayInfo(id, { roles });
			return res.status(201).json(updatedPayInfo);
		}
		return res.status(201).json("Record does not exist");
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	getAllPayInfo,
	getEmployeePayInfo,
	addEmployeePayInfo,
	updateEmployeePayInfo,
	updatePayInfo,
};
