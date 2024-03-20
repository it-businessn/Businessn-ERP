const Department = require("../models/Department");
const EmployeeRole = require("../models/EmployeeRole");
const EmploymentType = require("../models/EmploymentType");
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
	try {
		const roles = await EmployeeRole.find().sort({ createdOn: -1 });
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
	try {
		const department = await Department.find().sort({ createdOn: -1 });
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

const getAllEmpTypes = () => async (req, res) => {
	try {
		const empTypes = await EmploymentType.find().sort({ createdOn: -1 });
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
};
