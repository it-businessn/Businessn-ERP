const Company = require("../models/Company");
const Department = require("../models/Department");
const EmployeeRole = require("../models/EmployeeRole");
const EmploymentType = require("../models/EmploymentType");
const Group = require("../models/Group");
const Module = require("../models/Module");
const Setup = require("../models/Setup");

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
		const roles = await EmployeeRole.find({ companyName }).sort({
			createdOn: -1,
		});
		res.status(200).json(roles);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const addRole = async (req, res) => {
	const { name, description } = req.body;

	try {
		const newRole = await EmployeeRole.create({
			name,
			description,
		});
		res.status(201).json(newRole);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const getDepartments = async (req, res) => {
	const { companyName } = req.params;
	try {
		const department = await Department.find({ companyName }).sort({
			createdOn: -1,
		});
		res.status(200).json(department);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const addDepartment = async (req, res) => {
	const { name, description } = req.body;

	try {
		const newDepartment = await Department.create({
			name,
			description,
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
	const { name, description } = req.body;

	try {
		const newModule = await Module.create({
			name,
			description,
		});
		res.status(201).json(newModule);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateModule = async (req, res) => {
	const { id } = req.params;
	try {
		const setup = await Module.findByIdAndUpdate(
			id,
			{ $set: req.body },
			{ new: true },
		);
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
	const { name, baseModule, admin, company } = req.body;

	try {
		const newModule = await Group.create({
			name,
			modules: baseModule,
			admin,
			companyName: company,
		});
		res.status(201).json(newModule);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
const updateGroup = async (req, res) => {
	const { id } = req.params;
	try {
		const setup = await Group.findByIdAndUpdate(
			id,
			{ $set: req.body },
			{ new: true },
		);
		res.status(200).json(setup);
	} catch (error) {
		console.log(error, "Error in updating");
	}
};

const getCompanies = async (req, res) => {
	try {
		const companies = await Company.find({});
		res.status(200).json(companies);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getCompany = async (req, res) => {
	const { name } = req.params;
	try {
		const company = await Company.find({ name });
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

const addCompany = async (req, res) => {
	const { name, founding_year, registration_number, address, industry_type } =
		req.body;
	const { streetNumber, city, state, postalCode, country } = address;

	try {
		const newCompany = await Company.create({
			name,
			founding_year,
			registration_number,
			industry_type,
			address: { streetNumber, city, state, postalCode, country },
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
	const { name, description } = req.body;

	try {
		const newEmpType = await EmploymentType.create({
			name,
			description,
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
		const setup = await Setup.findByIdAndUpdate(
			id,
			{ $set: updatedData },
			{ new: true },
		);
		res.status(200).json(setup);
	} catch (error) {
		console.log(error, "Error in updating");
	}
};

const addSetUpRule = async (req, res) => {
	const {
		isIdleLeadReassignment,
		idleTimeHours,
		idleTimeMinutes,
		AssignLeadTo,
	} = req.body;

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
	getCompany,
	getCompanyEmployees,
	addModule,
	getModules,
	updateModule,
	updateGroup,
	getGroups,
	addGroup,
};
