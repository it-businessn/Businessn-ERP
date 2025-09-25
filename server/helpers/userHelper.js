const Company = require("../models/Company");
const Employee = require("../models/Employee");
const EmployeeEmploymentInfo = require("../models/EmployeeEmploymentInfo");

const { ROLES } = require("../services/data");

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
	getUserEmploymentRoleInfo,
	sortByEmpFullName,
};
