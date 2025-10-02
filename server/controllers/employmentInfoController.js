const moment = require("moment");
const Employee = require("../models/Employee");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const EmployeePayInfo = require("../models/EmployeePayInfo");
const { fetchActiveEmployees } = require("./userController");
const { updatePayInfo } = require("./payInfoController");
const { addUserEmploymentInfo } = require("./empDataController");
const { updateTADEmployee } = require("./timecardController");
const { setInitialPermissions } = require("./permissionController");
const { checkExtraRun } = require("../services/util");

const getAllEmploymentInfo = async (req, res) => {
	const { companyName, payDate, isExtraRun, groupId, deptName, selectedPayGroupOption } = req.body;

	try {
		const isExtraPayRun = checkExtraRun(isExtraRun);

		const activeEmployees = await fetchActiveEmployees(
			isExtraPayRun,
			groupId,
			payDate,
			companyName,
			deptName,
			selectedPayGroupOption,
		);

		const aggregatedResult = [];
		for (const employee of activeEmployees) {
			const result = await buildPayPeriodEmpDetails(companyName, employee?.empId?._id);
			if (result) aggregatedResult.push(result);
		}
		aggregatedResult.map((empInfo) => {
			const position = empInfo?.empPayStubResult?.positions?.find((_) => _.title);
			empInfo._id = empInfo?.empPayStubResult?._id;
			empInfo.empId = empInfo?.empPayStubResult?.empId;
			empInfo.employmentCostCenter = position?.employmentDepartment;
		});

		return res.status(200).json(aggregatedResult);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const findEmpEmploymentInfo = async (empId) =>
	await EmployeeEmploymentInfo.findOne({
		empId,
	}).populate({
		path: "empId",
		model: "Employee",
		select: ["employeeId", "fullName"],
	});

const findEmpPayInfo = async (companyName) =>
	await EmployeePayInfo.find({
		companyName,
	}).select("empId roles");

const buildPayPeriodEmpDetails = async (companyName, employeeId) => {
	const empPayStubResult = await EmployeeEmploymentInfo.findOne({
		companyName,
		empId: employeeId,
		positions: { $exists: true, $not: { $size: 0 } },
	})
		.populate({
			path: "empId",
			model: "Employee",
			select: ["fullName"],
		})
		.select("empId positions employeeNo");

	const payInfoMapResult = await EmployeePayInfo.findOne({
		companyName,
		empId: employeeId,
		roles: { $exists: true, $not: { $size: 0 } },
	}).select("empId roles");
	if (empPayStubResult) return { empPayStubResult, payInfoMapResult };
};

const getCompanyLastBadgeID = async (req, res) => {
	const { companyName } = req.params;
	try {
		const allBadgeIds = await EmployeeEmploymentInfo.find({
			positions: { $exists: true, $not: { $size: 0 } },
			companyName,
		}).select("positions");
		const mappedBadgeIds = allBadgeIds
			?.map((rec) => rec.positions?.filter((pos) => pos.timeManagementBadgeID))
			?.filter((record) => record.length);
		const allTimeManagementBadgeID = mappedBadgeIds.flat()?.map((r) => r.timeManagementBadgeID);
		const lastTimeManagementBadgeID = Math.max(...allTimeManagementBadgeID);

		return res.status(200).json(lastTimeManagementBadgeID);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getEmployeeEmploymentInfo = async (req, res) => {
	const { companyName, empId } = req.params;
	try {
		const result = await findEmployeeEmploymentInfo(empId, companyName);

		if (!result) {
			const user = await Employee.findById(empId).select("email position dateOfJoining").sort({
				createdOn: -1,
			});
			return res.status(200).json(user);
		}
		const currentDate = moment().format("YYYYMMDD");

		if (!result?.employeeNo) {
			result.employeeNo = `${companyName.slice(0, 2).toUpperCase()}${currentDate}${
				Math.floor(Math.random() * 10) + 10
			}`;
		}
		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const findEmployeeEmploymentInfo = async (empId, companyName) =>
	await EmployeeEmploymentInfo.findOne({
		empId,
		companyName,
	});

const updateEmploymentInfo = async (id, data) =>
	await EmployeeEmploymentInfo.findByIdAndUpdate(
		id,
		{ $set: data },
		{
			new: true,
		},
	);

const updateEmployee = async (empId, data) => {
	const { payrollStatus, employeeNo, employmentRole } = data;
	const employee = await Employee.findById(empId);

	if (employee?.payrollStatus !== payrollStatus) {
		employee.payrollStatus = payrollStatus;
	}
	if (employeeNo && employeeNo !== "" && employee?.employeeNo !== employeeNo) {
		employee.employeeNo = employeeNo;
	}
	if (employmentRole && employee?.role !== employmentRole) {
		employee.role = employmentRole;
	}

	await employee.save();
};

const addEmployeeEmploymentInfo = async (req, res) => {
	const {
		empId,
		companyName,
		payrollStatus,
		employeeNo,
		employmentStartDate,
		employmentLeaveDate,
		employmentRole,
		positions,
		employmentCountry,
		employmentRegion,
	} = req.body;
	try {
		const data = {
			payrollStatus,
			employeeNo,
			employmentRole,
		};
		const positionExists = positions?.find((_) => _.title);
		if (positionExists) {
			const roles = [...positions];
			const existingPayInfo = await EmployeePayInfo.findOne({ empId, companyName });
			if (existingPayInfo) {
				await updatePayInfo(existingPayInfo._id, { roles });
			} else {
				await EmployeePayInfo.create({
					empId,
					companyName,
					roles,
				});
			}
		}
		const existingEmploymentInfo = await findEmployeeEmploymentInfo(empId, companyName);
		if (existingEmploymentInfo) {
			const updatedEmploymentInfo = await updateEmploymentInfo(existingEmploymentInfo._id, {
				payrollStatus,
				employeeNo,
				employmentStartDate,
				employmentLeaveDate,
				employmentRole,
				positions,
				employmentCountry,
				employmentRegion,
			});
			await updateEmployee(existingEmploymentInfo.empId, data);
			if (positions?.length && positions[0]) {
				await updateTADEmployee(existingEmploymentInfo.empId, companyName, positions[0]);
			}
			if (
				employmentRole !== existingEmploymentInfo?.employmentRole &&
				companyName !== existingEmploymentInfo?.companyName
			) {
				await setInitialPermissions(existingEmploymentInfo.empId, employmentRole, companyName);
			}
			return res.status(201).json(updatedEmploymentInfo);
		}
		const newEmploymentInfo = await EmployeeEmploymentInfo.create({
			empId,
			payrollStatus,
			employeeNo,
			companyName,
			employmentStartDate,
			employmentLeaveDate,
			employmentRole,
			positions,
			employmentCountry,
			employmentRegion,
		});
		await updateEmployee(empId, data);
		if (positionExists && positions[0]) {
			await updateTADEmployee(empId, companyName, positions[0]);
		}
		await setInitialPermissions(empId, employmentRole, companyName);
		return res.status(201).json(newEmploymentInfo);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const updateEmployeeEmploymentInfo = async (req, res) => {
	const { id } = req.params;
	const {
		empId,
		companyName,
		payrollStatus,
		employeeNo,
		employmentRole,
		employmentStartDate,
		employmentCountry,
		employmentRegion,
		employmentLeaveDate,
		positions,
	} = req.body;
	try {
		const existingEmploymentInfo = await EmployeeEmploymentInfo.findOne({ empId, companyName });
		if (existingEmploymentInfo) {
			const positionExists = positions?.find((_) => _.title);
			if (positionExists) {
				const roles = [...positions];
				const existingPayInfo = await EmployeePayInfo.findOne({ empId, companyName });
				if (existingPayInfo) {
					await updatePayInfo(existingPayInfo._id, { roles });
				} else {
					await EmployeePayInfo.create({
						empId,
						companyName,
						roles,
					});
				}
			}
			if (employmentRole !== existingEmploymentInfo?.employmentRole) {
				await setInitialPermissions(existingEmploymentInfo.empId, employmentRole, companyName);
			}

			const updatedInfo = await updateEmploymentInfo(existingEmploymentInfo._id, {
				payrollStatus,
				employeeNo,
				companyName,
				employmentStartDate,
				employmentLeaveDate,
				employmentRole,
				positions,
				employmentCountry,
				employmentRegion,
			});
			if (positions?.length && positions[0]) {
				await updateTADEmployee(existingEmploymentInfo.empId, companyName, positions[0]);
			}
			return res.status(200).json(updatedInfo);
		}
		await setInitialPermissions(empId, employmentRole, companyName);
		addUserEmploymentInfo(empId, companyName, req.body);
		return res.status(201).json("Employment info added");
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

module.exports = {
	getAllEmploymentInfo,
	getEmployeeEmploymentInfo,
	getCompanyLastBadgeID,
	addEmployeeEmploymentInfo,
	updateEmployeeEmploymentInfo,
	findEmployeeEmploymentInfo,
	updateEmploymentInfo,
	findEmpPayInfo,
};
