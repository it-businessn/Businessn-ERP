const Company = require("../models/Company");
const Department = require("../models/Department");
const Employee = require("../models/Employee");
const EmployeeRole = require("../models/EmployeeRole");
const EmploymentType = require("../models/EmploymentType");
const Group = require("../models/Group");
const Module = require("../models/Module");
const Setup = require("../models/Setup");
const { CURRENT_YEAR, BUSINESSN_ORG, BUSINESSN_ORG_ADMIN_EMAILS } = require("../services/data");
const { setInitialPermissions } = require("./appController");

const getAllSetup = async (req, res) => {
	try {
		const rule = await Setup.find({});
		res.status(200).json(rule);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getRoles = async (req, res) => {
	const { companyName } = req.params;
	try {
		const roles = await EmployeeRole.find({
			inactive: { $ne: true },
			companyName,
		}).sort({
			createdOn: -1,
		});
		res.status(200).json(roles);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const addRole = async (req, res) => {
	const { name, description, companyName } = req.body;

	try {
		const newRole = await EmployeeRole.create({
			name,
			description,
			companyName,
		});
		res.status(201).json(newRole);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const getDepartments = async (req, res) => {
	const { companyName } = req.params;
	try {
		const department = await Department.find({ companyName }).select("name").sort({
			createdOn: -1,
		});
		if (!department.length) {
			const department = await Department.find({ companyName: null }).sort({
				createdOn: -1,
			});
			return res.status(200).json(department);
		}
		return res.status(200).json(department);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const addDepartment = async (req, res) => {
	const { name, description, companyName } = req.body;

	try {
		const newDepartment = await Department.create({
			name,
			description,
			companyName,
		});
		res.status(201).json(newDepartment);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const getModules = async (req, res) => {
	const { companyName } = req.params;
	try {
		const module = await Module.find({ companyName }).sort({
			createdOn: -1,
		});
		res.status(200).json(module);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const addModule = async (req, res) => {
	const { name, description, companyName } = req.body;

	try {
		const newModule = await Module.create({
			name,
			description,
			companyName,
		});
		res.status(201).json(newModule);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateModule = async (req, res) => {
	const { id } = req.params;
	try {
		const setup = await Module.findByIdAndUpdate(id, { $set: req.body }, { new: true });
		res.status(200).json(setup);
	} catch (error) {
		console.log(error, "Error in updating");
	}
};

const getGroups = async (req, res) => {
	const { companyName } = req.params;
	try {
		const group = await Group.find({ companyName });
		res.status(200).json(group);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const addGroup = async (req, res) => {
	const { name, baseModule, admin, company, payrollActivated } = req.body;

	try {
		const newModule = await Group.create({
			name,
			modules: baseModule,
			admin,
			companyName: company,
			payrollActivated,
		});
		if (payrollActivated) {
			await addPaygroupSchedules(newModule._id);
		}

		res.status(201).json(newModule);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const addPaygroupSchedules = async (groupID) => {
	try {
		const groupSchedules = await Group.findById(groupID).select("scheduleSettings yearSchedules");
		const yearSchedules = groupSchedules.yearSchedules;
		const numberOfPayPeriods = 26;
		const payPeriods = [];
		let newStartDate = "2023-12-18";

		if (CURRENT_YEAR === 2024) {
			newStartDate = "2023-12-18";
		} else if (CURRENT_YEAR === 2025) {
			newStartDate = "2024-12-16";
		} else if (CURRENT_YEAR === 2026) {
			newStartDate = "2025-12-08";
		}
		const startDate = new Date(newStartDate);

		for (let i = 0; i < numberOfPayPeriods; i++) {
			const payPeriodStartDate = new Date(startDate);
			payPeriodStartDate.setDate(startDate.getDate() + i * 14);

			const payPeriodEndDate = new Date(payPeriodStartDate);
			payPeriodEndDate.setDate(payPeriodStartDate.getDate() + 13);

			const payPeriodProcessingDate = new Date(payPeriodEndDate);
			payPeriodProcessingDate.setDate(payPeriodEndDate.getDate() + 2);

			const payPeriodPayDate = new Date(payPeriodProcessingDate);
			payPeriodPayDate.setDate(payPeriodProcessingDate.getDate() + 3);

			payPeriods.push({
				payPeriod: i + 1,
				payPeriodStartDate,
				payPeriodEndDate,
				payPeriodProcessingDate,
				payPeriodPayDate,
				year: CURRENT_YEAR,
			});
		}
		yearSchedules.push({ year: CURRENT_YEAR, payPeriods });

		await updatePayGroup(groupID, {
			// scheduleSettings: payPeriods,
			yearSchedules,
		});
	} catch (error) {
		console.log(error);
	}
};

const findGroupEmployees = async (groupId, payDate) => {
	const groupName = await Group.findById(groupId).select("scheduleSettings");
	const schedule = groupName.scheduleSettings.find(
		(schedule) => schedule.payPeriodPayDate === payDate,
	);
	return schedule?.selectedEmp;
};

const updatePayGroup = async (id, data) =>
	await Group.findByIdAndUpdate(id, data, {
		new: true,
	});

const updateGroup = async (req, res) => {
	const { id } = req.params;
	const { scheduleSettings, payrollActivated } = req.body;
	// try {
	// 	if (scheduleSettings && !scheduleSettings.length && payrollActivated) {
	// 		await addPaygroupSchedules(id);
	// 		return res.status(200).json("Added schedules");
	// 	}
	// 	const setup = await updatePayGroup(id, req.body);
	// 	res.status(200).json(setup);
	// } catch (error) {
	// 	console.log(error, "Error in updating");
	// }
};

const getCompanies = async (req, res) => {
	try {
		const companies = await Company.find({}).sort({
			createdOn: -1,
		});
		res.status(200).json(companies);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getCompany = async (req, res) => {
	const { name } = req.params;
	try {
		const company = await Company.findOne({ name }).select(
			"address industry_type founding_year registration_number name cra_business_number",
		);
		res.status(200).json(company);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getCompanyEmployees = async (req, res) => {
	const { employees } = req.params;
	try {
		// const company = "6646b03e96dcdc0583fb5dca";
		// const existingCompany = await Company.findById(company);
		// existingCompany.employees.push(id);
		// await existingCompany.save();

		const result = await Company.find({ employees });

		// const updatedLeads = await Company.findByIdAndUpdate(
		// 	"6646b03e96dcdc0583fb5dca",
		// 	{
		// 		employees,
		// 	},
		// 	{ new: true },
		// );
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const updateCompany = async (req, res) => {
	const { id } = req.params;
	try {
		const { CRABusinessNo } = req.body;
		const updatedCompany = await Company.findByIdAndUpdate(
			id,
			{ $set: { cra_business_number: CRABusinessNo } },
			{ new: true },
		);
		res.status(200).json(updatedCompany);
	} catch (error) {
		console.log(error, "Error in updating");
	}
};

const addCompany = async (req, res) => {
	const { name, founding_year, registration_number, address, industry_type } = req.body;
	const { streetNumber, city, state, postalCode, country } = address;

	try {
		const adminEmployees = await Employee.find({
			email: BUSINESSN_ORG_ADMIN_EMAILS,
			role: { $regex: /manager|administrator/i },
		}).select("_id");
		const newCompany = await Company.create({
			name,
			founding_year,
			registration_number,
			industry_type,
			address: { streetNumber, city, state, postalCode, country },
			employees: adminEmployees,
		});

		res.status(201).json(newCompany);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const getEmpTypes = async (req, res) => {
	const { companyName } = req.params;
	try {
		const empTypes = await EmploymentType.find({ companyName }).sort({
			createdOn: -1,
		});
		res.status(200).json(empTypes);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const addEmpType = async (req, res) => {
	const { name, description, companyName } = req.body;

	try {
		const newEmpType = await EmploymentType.create({
			name,
			description,
			companyName,
		});
		res.status(201).json(newEmpType);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateSetUp = async (req, res) => {
	const { id } = req.params;
	try {
		const updatedData = req.body;
		const setup = await Setup.findByIdAndUpdate(id, { $set: updatedData }, { new: true });
		res.status(200).json(setup);
	} catch (error) {
		console.log(error, "Error in updating");
	}
};

const addSetUpRule = async (req, res) => {
	const { isIdleLeadReassignment, idleTimeHours, idleTimeMinutes, AssignLeadTo } = req.body;

	try {
		const newSetup = await Setup.create({
			isIdleLeadReassignment,
			idleTimeHours,
			idleTimeMinutes,
			AssignLeadTo,
		});
		res.status(201).json(newSetup);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	addSetUpRule,
	getAllSetup,
	updateSetUp,
	addRole,
	getRoles,
	getDepartments,
	addDepartment,
	getEmpTypes,
	addEmpType,
	getCompanies,
	addCompany,
	updateCompany,
	getCompany,
	getCompanyEmployees,
	addModule,
	getModules,
	updateModule,
	updateGroup,
	getGroups,
	addGroup,
	findGroupEmployees,
};
