const Company = require("../models/Company");
const Department = require("../models/Department");
const EmployeeRole = require("../models/EmployeeRole");
const EmploymentType = require("../models/EmploymentType");
const Group = require("../models/Group");
const Module = require("../models/Module");
const Setup = require("../models/Setup");

const getIdleLeadReAssignment = () => async (req, res) => {
	try {
		const idleAssignmentRule = await Setup.find();
		res.status(200).json(idleAssignmentRule);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getAllRoles = () => async (req, res) => {
	const { id } = req.params;
	try {
		const roles = await EmployeeRole.find({ companyName: id }).sort({
			createdOn: -1,
		});
		res.status(200).json(roles);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const addRole = () => async (req, res) => {
	const { name, description } = req.body;

	const newRole = new EmployeeRole({
		name,
		description,
	});

	try {
		await newRole.save();
		res.status(201).json(newRole);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const getAllDepartments = () => async (req, res) => {
	const { id } = req.params;
	try {
		const department = await Department.find({ companyName: id }).sort({
			createdOn: -1,
		});
		res.status(200).json(department);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const addDepartment = () => async (req, res) => {
	const { name, description } = req.body;

	const newDepartment = new Department({
		name,
		description,
	});

	try {
		await newDepartment.save();
		res.status(201).json(newDepartment);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const getAllModules = () => async (req, res) => {
	const { id } = req.params;
	try {
		const module = await Module.find({ companyName: id }).sort({
			createdOn: -1,
		});
		res.status(200).json(module);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const addModule = () => async (req, res) => {
	const { name, description } = req.body;

	const newModule = new Module({
		name,
		description,
	});

	try {
		await newModule.save();
		res.status(201).json(newModule);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
const updateModuleActiveStatus = () => async (req, res) => {
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

const getAllGroups = () => async (req, res) => {
	const { id } = req.params;
	try {
		const group = await Group.find({ companyName: id });
		res.status(200).json(group);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const addGroup = () => async (req, res) => {
	const { name, baseModule, admin } = req.body;

	const newModule = new Group({
		name,
		modules: baseModule,
		admin,
	});

	try {
		await newModule.save();
		res.status(201).json(newModule);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
const updateGroup = () => async (req, res) => {
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

const getAllCompanies = () => async (req, res) => {
	try {
		const companies = await Company.find();
		res.status(200).json(companies);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getCompanyByName = () => async (req, res) => {
	const { id } = req.params;
	try {
		const company = await Company.find({ name: id });
		res.status(200).json(company);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getCompanyByUserId = () => async (req, res) => {
	const { id } = req.params;
	try {
		// const company = "6646b03e96dcdc0583fb5dca";
		// const existingCompany = await Company.findById(company);
		// existingCompany.employees.push(id);
		// await existingCompany.save();

		const company = await Company.find({ employees: id });

		// const updatedLeads = await Company.findByIdAndUpdate(
		// 	"6646b03e96dcdc0583fb5dca",
		// 	{
		// 		employees,
		// 	},
		// 	{ new: true },
		// );
		res.status(200).json(company);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const addCompany = () => async (req, res) => {
	const { name, founding_year, registration_number, address, industry_type } =
		req.body;
	const { streetNumber, city, state, postalCode, country } = address;
	const company = new Company({
		name,
		founding_year,
		registration_number,
		industry_type,
		address: { streetNumber, city, state, postalCode, country },
	});

	try {
		await company.save();
		res.status(201).json(company);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const getAllEmpTypes = () => async (req, res) => {
	const { id } = req.params;
	try {
		const empTypes = await EmploymentType.find({ companyName: id }).sort({
			createdOn: -1,
		});
		res.status(200).json(empTypes);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const addEmpType = () => async (req, res) => {
	const { name, description } = req.body;

	const newEmpType = new EmploymentType({
		name,
		description,
	});

	try {
		await newEmpType.save();
		res.status(201).json(newEmpType);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const getAllApprovers = () => async (req, res) => {
	try {
		const approvers = await Department.find().sort({ createdOn: -1 });
		res.status(200).json(approvers);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const addApprovers = () => async (req, res) => {
	const { name, description } = req.body;

	const approver = new Department({
		name,
		description,
	});

	try {
		await approver.save();
		res.status(201).json(approver);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
const updateSetUp = () => async (req, res) => {
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

const setUpIdleLeadReAssignment = () => async (req, res) => {
	const {
		isIdleLeadReassignment,
		idleTimeHours,
		idleTimeMinutes,
		AssignLeadTo,
	} = req.body;

	const setUpIdleLeadReAssignment = new Setup({
		isIdleLeadReassignment,
		idleTimeHours,
		idleTimeMinutes,
		AssignLeadTo,
	});

	try {
		const newSetUpIdleLeadReAssignment = await setUpIdleLeadReAssignment.save();
		res.status(201).json(newSetUpIdleLeadReAssignment);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	setUpIdleLeadReAssignment,
	getIdleLeadReAssignment,
	updateSetUp,
	addRole,
	getAllRoles,
	getAllDepartments,
	addDepartment,
	getAllApprovers,
	addApprovers,
	getAllEmpTypes,
	addEmpType,
	getAllCompanies,
	addCompany,
	getCompanyByName,
	getCompanyByUserId,
	addModule,
	getAllModules,
	updateModuleActiveStatus,
	updateGroup,
	getAllGroups,
	addGroup,
};
