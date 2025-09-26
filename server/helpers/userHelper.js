const Company = require("../models/Company");
const Employee = require("../models/Employee");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const EmployeePayInfo = require("../models/EmployeePayInfo");

const { ROLES, EARNING_TYPE } = require("../services/data");

const addEmployee = async (name, data) => {
	const existingCompany = await findCompany("name", name);
	data.companyId = existingCompany._id;
	try {
		const employeeRecord = await Employee.findOne({ email: data.email });
		if (employeeRecord) {
			return employeeRecord;
		}
		const newEmployee = await Employee.create(data);

		if (newEmployee && existingCompany) {
			existingCompany.employees.push(newEmployee._id);
			await existingCompany.save();
		}
		return newEmployee;
	} catch (error) {}
};

const findCompany = async (key, value) => await Company.findOne({ [key]: value });

const findEmployee = async (data) => {
	let result = await EmployeeEmploymentInfo.find(data)
		.populate({
			path: "empId",
			model: "Employee",
			select: ["fullName", "email", "baseModule", "group"],
		})
		.select("payrollStatus employeeNo positions employmentRole");

	return sortByEmpFullName(result);
};

const filterResultByDepartment = (result, deptName) => {
	if (deptName && deptName !== "null") {
		return result?.filter((emp) => emp?.positions?.[0]?.employmentDepartment === deptName);
	}
};

const filterResultByPaygroupOption = (result, payGroupOption) =>
	result?.filter((emp) => emp?.positions?.find((_) => _.employmentPayGroup === payGroupOption));

const getShadowUserIds = async (companyName) => {
	const shadowEmpIds = await EmployeeEmploymentInfo.find({
		companyName,
		employmentRole: ROLES.SHADOW_ADMIN,
		empId: { $exists: true },
	}).select("empId");

	return shadowEmpIds.map((emp) => emp.empId);
};

const getSalariedIds = async (companyName) => {
	let result = await EmployeePayInfo.find({
		companyName,
		empId: { $exists: true },
	}).select("roles empId");

	result = result.filter((emp) => {
		const nonSalaried =
			emp.empId &&
			emp?.roles.some(
				(role) => role.typeOfEarning == EARNING_TYPE.FT || role.typeOfEarning == EARNING_TYPE.PT,
			);
		if (nonSalaried) return emp;
	});

	return result?.map((emp) => emp.empId);
};

const getPayrollActiveEmployees = async (companyName, deptName, selectedPayGroupOption) => {
	let result = await findEmployee({
		payrollStatus: "Payroll Active",
		companyName,
		employmentRole: { $ne: ROLES.SHADOW_ADMIN },
		empId: { $exists: true },
	});

	if (selectedPayGroupOption) {
		result = filterResultByPaygroupOption(result, selectedPayGroupOption);
	}

	if (deptName && deptName !== "null") {
		result = filterResultByDepartment(result, deptName);
	}

	return result;
};

const getUserEmploymentRoleInfo = async (companyName) => {
	const result = await EmployeeEmploymentInfo.find({
		companyName,
		empId: { $exists: true },
		employmentRole: { $ne: ROLES.SHADOW_ADMIN },
	})
		.populate({
			path: "empId",
			model: "Employee",
			select: ["fullName", "email"],
		})
		.select("employmentRole");
	return sortByEmpFullName(result);
};

const sortByEmpFullName = (result) =>
	result?.sort((a, b) => {
		if (a.empId?.fullName < b.empId?.fullName) return -1;
		if (a.empId?.fullName > b.empId?.fullName) return 1;
		return a.createdOn - b.createdOn;
	});

module.exports = {
	addEmployee,
	findCompany,
	findEmployee,
	filterResultByPaygroupOption,
	filterResultByDepartment,
	getShadowUserIds,
	getSalariedIds,
	getPayrollActiveEmployees,
	getUserEmploymentRoleInfo,
	sortByEmpFullName,
};
