const moment = require("moment");
const Employee = require("../models/Employee");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const EmployeePayInfo = require("../models/EmployeePayInfo");
const { setInitialPermissions } = require("./appController");
const { fetchActiveEmployees } = require("./userController");
const { updatePayInfo, findEmployeePayInfoDetails } = require("./payInfoController");

const getAllEmploymentInfo = async (req, res) => {
	const { companyName, startDate, endDate, payDate, isExtraRun, groupId, deptName } = req.params;
	try {
		const isExtraPayRun = isExtraRun === "true";

		const activeEmployees = await fetchActiveEmployees(
			isExtraPayRun,
			groupId,
			payDate,
			companyName,
			deptName,
		);

		const aggregatedResult = [];
		for (const employee of activeEmployees) {
			const result = await buildPayPeriodEmpDetails(companyName, employee?.empId?._id, true);
			if (result) aggregatedResult.push(result);
		}
		aggregatedResult.map((empInfo) => {
			const empIdStr = empInfo.empPayStubResult?.empId?._id.toString();
			if (empInfo?.payInfoMapResult.has(empIdStr)) {
				empInfo.regPay = empInfo.payInfoMapResult.get(empIdStr);
			}
			empInfo._id = empInfo?.empPayStubResult?._id;
			empInfo.empId = empInfo?.empPayStubResult?.empId;
			empInfo.employmentCostCenter =
				empInfo?.empPayStubResult?.positions?.[0]?.employmentDepartment;
		});

		res.status(200).json(aggregatedResult);
	} catch (error) {
		res.status(500).json({ message: error.message });
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

const buildPayPeriodEmpDetails = async (companyName, employeeId, hideDetails) => {
	const empPayStubResult = hideDetails
		? await EmployeeEmploymentInfo.findOne({
				empId: employeeId,
		  })
				.populate({
					path: "empId",
					model: "Employee",
					select: ["fullName"],
				})
				.select("empId positions employeeNo")
		: await findEmpEmploymentInfo(employeeId);

	const payInfoResult = await findEmpPayInfo(companyName);
	const payInfoMapResult = new Map(
		payInfoResult.map((payInfo) => [payInfo.empId, payInfo?.roles?.[0]?.payRate]),
	);
	if (empPayStubResult) return { empPayStubResult, payInfoMapResult };
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
		res.status(404).json({ error: error.message });
	}
};

const findEmployeeEmploymentInfo = async (empId, companyName) =>
	await EmployeeEmploymentInfo.findOne({
		empId,
		companyName,
	});

const updateEmploymentInfo = async (id, data) =>
	await EmployeeEmploymentInfo.findByIdAndUpdate(id, data, {
		new: true,
	});

const updateEmployee = async (empId, data) => {
	const { payrollStatus, employeeNo } = data;
	const employee = await Employee.findById(empId);

	if (employee?.payrollStatus !== payrollStatus) {
		employee.payrollStatus = payrollStatus;
	}
	if (employeeNo && employeeNo !== "") {
		employee.employeeNo = employeeNo;
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
		let roles = [...positions];
		roles.map((_) => {
			_.typeOfEarning = "Hourly";
			_.fullTimeStandardHours = 0;
			_.partTimeStandardHours = 0;
			return _;
		});
		const existingPayInfo = await findEmployeePayInfoDetails(empId, companyName);
		if (existingPayInfo) {
			const updatedPayInfo = await updatePayInfo(existingPayInfo._id, { roles });
		} else {
			const newPayInfo = await EmployeePayInfo.create({
				empId,
				companyName,
				roles,
			});
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
			await setInitialPermissions(existingEmploymentInfo.empId, employmentRole, companyName);
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
		await setInitialPermissions(empId, employmentRole, companyName);
		return res.status(201).json(newEmploymentInfo);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateEmployeeEmploymentInfo = async (req, res) => {
	const { id } = req.params;
	const {
		payrollStatus,
		employeeNo,
		companyName,
		employmentStartDate,
		employmentLeaveDate,
		employmentRole,
		positions,
		employmentCountry,
		employmentRegion,
	} = req.body;
	try {
		const updatedInfo = await updateEmploymentInfo(id, {
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
		res.status(201).json(updatedInfo);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	getAllEmploymentInfo,
	getEmployeeEmploymentInfo,
	addEmployeeEmploymentInfo,
	updateEmployeeEmploymentInfo,
	findEmployeeEmploymentInfo,
	updateEmploymentInfo,
};
