const { EARNING_TYPE } = require("../constants/earning.constants");
const { ROLES } = require("../constants/roles.constants");
const Company = require("../models/Company");
const Employee = require("../models/Employee");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");
const EmployeePayInfo = require("../models/EmployeePayInfo");

const addEmployee = async (name, data) => {
	try {
		const existingCompany = await findCompany("name", name);
		data.companyId = existingCompany._id;

		const newEmployee = await Employee.create(data);
		if (newEmployee && existingCompany) {
			existingCompany.employees.push(newEmployee._id);
			await existingCompany.save();
		}
		return newEmployee;
	} catch (error) {
		console.error("addEmployee Error:", {
			message: error.message,
			stack: error.stack,
			data,
			name,
		});
		throw error;
	}
};

const findCompany = async (key, value) => await Company.findOne({ [key]: value });

const findEmployee = async (data) => {
	let result = await EmployeeEmploymentInfo.find(data)
		.populate({
			path: "empId",
			model: "Employee",
			select: ["fullName", "email", "baseModule", "group"],
		})
		.select("payrollStatus employeeNo positions employmentRole createdOn");

	result = (result || []).filter((emp) => emp?.empId);
	result = sortByEmpFullName(result);

	return result;
};

const filterResultByDepartment = (result = [], deptName) => {
	if (!deptName || deptName === "null") return result;
	return result.filter((emp) => emp?.positions?.[0]?.employmentDepartment === deptName);
};

const filterResultByPaygroupOption = (result = [], payGroupOption) => {
	if (!payGroupOption) return result;

	return result.filter((emp) =>
		emp?.positions?.find((pos) => pos?.employmentPayGroup === payGroupOption),
	);
};

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

	result = result.filter(
		(emp) =>
			emp?.empId &&
			emp?.roles.some(
				(role) => role?.typeOfEarning == EARNING_TYPE.FT || role?.typeOfEarning == EARNING_TYPE.PT,
			),
	);

	return result?.map((emp) => emp?.empId);
};

const applyPayrollFilters = (result, deptName, payGroup) => {
	let filtered = result || [];

	filtered = filterResultByPaygroupOption(filtered, payGroup);
	filtered = filterResultByDepartment(filtered, deptName);

	return filtered;
};

const getPayrollActiveEmployees = async (companyName, deptName, selectedPayGroupOption) => {
	let result = await findEmployee({
		payrollStatus: "Payroll Active",
		companyName,
		employmentRole: { $ne: ROLES.SHADOW_ADMIN },
		empId: { $exists: true },
	});

	// result = applyPayrollFilters(result, deptName, selectedPayGroupOption);
	if (selectedPayGroupOption) {
		result = filterResultByPaygroupOption(result, selectedPayGroupOption);
	}

	if (deptName && deptName !== "null") {
		result = filterResultByDepartment(result, deptName);
	}
	return sortByEmpFullName(result);
};

const getPayrollInActiveEmployees = async (companyName, deptName, selectedPayGroupOption) => {
	let result = await findEmployee({
		payrollStatus: { $ne: "Payroll Active" },
		companyName,
		employmentRole: { $ne: ROLES.SHADOW_ADMIN },
		empId: { $exists: true },
	});
	// result = applyPayrollFilters(result, deptName, selectedPayGroupOption);
	if (selectedPayGroupOption) {
		result = filterResultByPaygroupOption(result, selectedPayGroupOption);
	}

	if (deptName && deptName !== "null") {
		result = filterResultByDepartment(result, deptName);
	}
	return sortByEmpFullName(result);
};

const getPayrollTerminatedEmployees = async (companyName, deptName, selectedPayGroupOption) => {
	let result = await findEmployee({
		payrollStatus: "Payroll Terminated",
		companyName,
		employmentRole: { $ne: ROLES.SHADOW_ADMIN },
		empId: { $exists: true },
	});
	// result = applyPayrollFilters(result, deptName, selectedPayGroupOption);
	if (selectedPayGroupOption) {
		result = filterResultByPaygroupOption(result, selectedPayGroupOption);
	}

	if (deptName && deptName !== "null") {
		result = filterResultByDepartment(result, deptName);
	}

	return sortByEmpFullName(result);
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

const sortByEmpFullName = (result = []) =>
	result.sort((a, b) => {
		const nameA = a.empId?.fullName || "";
		const nameB = b.empId?.fullName || "";

		if (nameA < nameB) return -1;
		if (nameA > nameB) return 1;

		return (a.createdOn || 0) - (b.createdOn || 0);
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
	getPayrollInActiveEmployees,
	getPayrollTerminatedEmployees,
	getUserEmploymentRoleInfo,
	sortByEmpFullName,
};
