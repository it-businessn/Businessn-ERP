const EmployeePayInfo = require("../models/EmployeePayInfo");
const Group = require("../models/Group");
const { findGroupEmployees } = require("./setUpController");
const { getEmployeeId } = require("./userController");
const { deleteAlerts } = require("./alertsController");
const { getRecordId } = require("./payStubController");
const { checkExtraRun } = require("../helpers/payrollHelper");
const { ALERTS_TYPE } = require("../constants/pay.constants");
const { getPayrollActiveEmployees } = require("../services/userService");
const { findEmpPayStubDetail } = require("../services/payrollService");

const getAllPayInfo = async (req, res) => {
	const start = Date.now();
	const { companyName, payDate, isExtraRun, groupId } = req.params;
	try {
		const isExtraPayRun = checkExtraRun(isExtraRun);
		const employees = isExtraPayRun ? await findGroupEmployees(groupId, payDate) : null;

		const group = await Group.findById(groupId).select("scheduleFrequency");
		if (!group) {
			console.error("❌ Group not found", { groupId });
			return res.status(404).json({ message: "Group not found" });
		}
		const activeEmployees = isExtraPayRun
			? await getEmployeeId(employees)
			: await getPayrollActiveEmployees(companyName);
		// console.log("📊 Payroll fetch start", {
		// 	companyName,
		// 	groupId,
		// 	totalEmployees: activeEmployees?.length,
		// 	isExtraPayRun,
		// });
		const aggregatedResult = [];
		const errors = [];

		for (const employee of activeEmployees) {
			try {
				const result = await buildAmountAllocationEmpDetails(
					payDate,
					employee,
					companyName,
					group?.scheduleFrequency,
				);
				aggregatedResult.push(result);
			} catch (err) {
				console.error("❌ Employee processing failed", {
					employeeId: employee?._id || employee,
					message: err.message,
					stack: err.stack,
				});

				errors.push({
					employeeId: employee?._id || employee,
					error: err.message,
				});
			}
		}
		console.log("✅ Payroll processed", {
			successCount: aggregatedResult.length,
			errorCount: errors.length,
			timeMs: Date.now() - start,
		});
		return res.status(200).json(aggregatedResult);
	} catch (error) {
		console.error("❌ getAllPayInfo FAILED", {
			message: error.message,
			stack: error.stack,
			params: req.params,
		});

		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

const buildAmountAllocationEmpDetails = async (
	payDate,
	employee,
	companyName,
	scheduleFrequency,
) => {
	try {
		const employeeId = typeof employee?.empId === "object" ? employee?.empId?._id : employee?.empId;
		const fullName =
			typeof employee?.empId === "object" ? employee?.empId?.fullName : employee?.fullName;

		if (!employeeId) {
			throw new Error("Missing employeeId");
		}

		const empPayStubResult = await findEmpPayStubDetail(employeeId, payDate, companyName);

		let recordId;
		try {
			recordId = await getRecordId(
				empPayStubResult,
				employeeId,
				companyName,
				payDate,
				scheduleFrequency,
			);
		} catch (err) {
			console.error("❌ getRecordId failed", {
				employeeId,
				message: err.message,
			});
			recordId = null;
		}

		return {
			_id: recordId,
			empId: { _id: employeeId, fullName },
			commission: empPayStubResult?.commission ?? 0,
			bonus: empPayStubResult?.bonus ?? 0,
			reimbursement: empPayStubResult?.reimbursement ?? 0,
			retroactive: empPayStubResult?.retroactive ?? 0,
			terminationPayout: empPayStubResult?.terminationPayout ?? 0,
			vacationPayout: empPayStubResult?.vacationPayout ?? 0,
		};
	} catch (error) {
		console.error("❌ buildAmountAllocationEmpDetails ERROR", {
			employee,
			message: error.message,
			stack: error.stack,
		});

		return {
			_id: null,
			empId: {
				_id: employee?.empId?._id || employee?.empId || null,
				fullName: employee?.empId?.fullName || employee?.fullName || "Unknown",
			},
			error: error.message,
			commission: 0,
			bonus: 0,
			reimbursement: 0,
			retroactive: 0,
			terminationPayout: 0,
			vacationPayout: 0,
		};
	}
};

const getEmployeePayInfo = async (req, res) => {
	const { companyName, empId } = req.params;
	try {
		// if (!companyName || !empId) {
		// 	console.warn("⚠️ Missing params", { companyName, empId });
		// 	return res.status(400).json({ message: "companyName and empId are required" });
		// }
		const result = await findEmployeePayInfoDetails(empId, companyName);

		if (!result) {
			console.warn("⚠️ Pay info not found", { companyName, empId });
			return res.status(404).json({ message: "Record not found" });
		}

		// console.log("✅ Pay info fetched", {
		// 	empId,
		// 	companyName,
		// 	timeMs: Date.now() - start,
		// });

		return res.status(200).json(result);
	} catch (error) {
		console.error("❌ getEmployeePayInfo ERROR", {
			message: error.message,
			stack: error.stack,
			params: req.params,
		});

		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

const findEmployeePayInfoDetails = async (empId, companyName) =>
	await EmployeePayInfo.findOne({
		empId,
		companyName,
	});

const updatePayInfo = async (id, data) =>
	await EmployeePayInfo.findByIdAndUpdate(
		id,
		{ $set: data },
		{
			new: true,
		},
	);

const addEmployeePayInfo = async (req, res) => {
	const { empId, companyName, roles } = req.body;
	try {
		let processedRoles = [];
		if (Array.isArray(roles)) {
			processedRoles = roles.map((role, index) => {
				const payRate = parseFloat(role?.payRate);

				if (isNaN(payRate)) {
					console.warn("⚠️ Invalid payRate", {
						index,
						value: role?.payRate,
					});
				}

				if (!isNaN(payRate)) {
					return {
						...role,
						payRate,
						overTimePay: 1.5 * payRate,
						dblOverTimePay: 2 * payRate,
						statWorkPay: 1.5 * payRate,
						statPay: payRate,
						sickPay: payRate,
						vacationPay: payRate,
						bereavementPay: payRate,
						personalDayPay: payRate,
					};
				}
				return role;
			});

			const allAboveMin = processedRoles.every(
				(r) => typeof r.payRate === "number" && r.payRate > 17.85,
			);
			if (allAboveMin) {
				await deleteAlerts(empId, ALERTS_TYPE.WAGE);
			}
		}
		const existingPayInfo = await findEmployeePayInfoDetails(empId, companyName);
		let result;
		if (existingPayInfo) {
			result = await updatePayInfo(existingPayInfo._id, {
				roles: processedRoles,
			});
		} else {
			result = await EmployeePayInfo.create({
				empId,
				companyName,
				roles: processedRoles,
			});
		}

		console.log("✅ Pay info saved", {
			empId,
			companyName,
			rolesCount: processedRoles.length,
			timeMs: Date.now() - start,
		});
		return res.status(201).json(result);
	} catch (error) {
		console.error("❌ addEmployeePayInfo ERROR", {
			message: error.message,
			stack: error.stack,
			body: req.body,
		});

		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

const updateEmployeePayInfo = async (req, res) => {
	const start = Date.now();
	const { id } = req.params;
	try {
		const { empId, roles } = req.body;

		if (!id) {
			return res.status(400).json({ message: "id is required" });
		}

		if (!Array.isArray(roles)) {
			return res.status(400).json({ message: "roles must be an array" });
		}

		const existingRecord = await EmployeePayInfo.findById(id);
		if (!existingRecord) {
			return res.status(404).json({ message: "Record does not exist" });
		}
		const processedRoles = roles.map((role, index) => {
			const payRate = parseFloat(role?.payRate);
			if (isNaN(payRate)) {
				console.warn("⚠️ Invalid payRate", {
					index,
					value: role?.payRate,
				});
				return role;
			}

			return {
				...role,
				payRate,
				overTimePay: 1.5 * payRate,
				dblOverTimePay: 2 * payRate,
				statWorkPay: 1.5 * payRate,
				statPay: payRate,
				sickPay: payRate,
				vacationPay: payRate,
				bereavementPay: payRate,
				personalDayPay: payRate,
			};
		});

		const allAboveMin = processedRoles.every(
			(r) => typeof r.payRate === "number" && r.payRate > 17.85,
		);
		if (allAboveMin) {
			await deleteAlerts(empId, ALERTS_TYPE.WAGE);
		}

		const updatedPayInfo = await updatePayInfo(id, {
			roles: processedRoles,
		});

		console.log("✅ Pay info updated", {
			id,
			empId,
			rolesCount: processedRoles.length,
			timeMs: Date.now() - start,
		});

		return res.status(200).json(updatedPayInfo);
	} catch (error) {
		console.error("❌ updateEmployeePayInfo ERROR", {
			message: error.message,
			stack: error.stack,
			params: req.params,
			body: req.body,
		});

		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

module.exports = {
	getAllPayInfo,
	getEmployeePayInfo,
	addEmployeePayInfo,
	updateEmployeePayInfo,
	updatePayInfo,
};
