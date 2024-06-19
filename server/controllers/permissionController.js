const UserPermissions = require("../models/permissions");

const ADMIN_PERMISSION = [
	{ name: "Sales" },
	{ name: "Sales Dashboard" },
	{ name: "Sales Activities" },
	{ name: "Sales Calendar" },
	{ name: "Sales Payouts" },
	{ name: "Sales Customers" },
	{ name: "Sales Opportunities" },
	{ name: "Sales Lead Docket" },
	{ name: "Sales Lead Disbursement" },
	{ name: "Sales Fresh Leads" },
	{ name: "Sales Target Leads Pipeline" },
	{ name: "Sales Products" },
	{ name: "Sales Orders" },
	{ name: "Sales Resources" },
	{ name: "Sales Sales Reports" },
	{ name: "Sales Setup" },
	{ name: "Project Management" },
	{ name: "Project Management Dashboard" },
	{ name: "Project Management Work view" },
	{ name: "Project Management Communication" },
	{ name: "Project Management Taskboard" },
	{ name: "Project Management Agenda" },
	{ name: "Project Management Gantt" },
	{ name: "Project Management PM Reports" },
	{ name: "Project Management Setup" },
	{ name: "Payroll" },
	{ name: "Payroll Dashboard" },
	{ name: "Payroll Workview" },
	{ name: "Payroll Process Payroll" },
	{ name: "Payroll Approvals" },
	{ name: "Payroll Timesheets" },
	{ name: "Payroll Employees" },
	{ name: "Payroll Reports" },
	{ name: "Payroll Employee Dashboard" },
	{ name: "Payroll Employee Records" },
	{ name: "Scheduling" },
	{ name: "Scheduling Dashboard" },
	{ name: "Scheduling Workview" },
	{ name: "Scheduling Scheduling Reports" },
	{ name: "Scheduling Setup" },
	{ name: "Scheduling Shift Assignment" },
];

const SALES_ASSOCIATE_PERMISSION = [
	{ name: "Sales" },
	{ name: "Sales Dashboard" },
	{ name: "Sales Activities" },
	{ name: "Sales Calendar" },
	{ name: "Sales Payouts" },
	{ name: "Sales Customers" },
	{ name: "Sales Opportunities" },
	{ name: "Sales Fresh Leads" },
	{ name: "Sales Target Leads Pipeline" },
	{ name: "Sales Resources" },
	{ name: "Project Management" },
	{ name: "Project Management Dashboard" },
	{ name: "Project Management Work view" },
	{ name: "Project Management Communication" },
];

const getUserPermissions = () => async (req, res) => {
	try {
		const allPermissions = await UserPermissions.find();
		res.status(200).json(allPermissions);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getPermissionByUserId = () => async (req, res) => {
	const { id, name } = req.params;

	try {
		const user = await UserPermissions.findOne({
			empId: id,
			companyName: name,
		});
		res.status(200).json(user);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const addPermission = () => async (req, res) => {
	let { empId, accessName, name, companyName } = req.body;

	const user = new UserPermissions({
		empId,
		companyName,
	});
	try {
		const item = {
			name,
			canAccessModule: false,
			canAccessUserData: false,
			canAccessGroupData: false,
			canAccessRegionData: false,
			canAccessAllData: false,
			canViewModule: false,
			canEditModule: false,
			canDeleteModule: false,
		};
		item[accessName] = !item[accessName];

		user.permissionType.push(item);
		const newPermissions = await user.save();
		res.status(201).json(newPermissions);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updatePermission = () => async (req, res) => {
	const { id } = req.params;
	let { name, accessName } = req.body;

	try {
		const user = await UserPermissions.findOne({ empId: id });

		const permissionIndex = user.permissionType.findIndex(
			(item) => item.name === name,
		);
		const permission = user.permissionType.find((item) => item.name === name);

		if (permissionIndex > -1) {
			permission[accessName] = !permission[accessName];
			user.permissionType[permissionIndex] = permission;
		} else {
			const item = {
				name,
				canAccessModule: false,
				canAccessUserData: false,
				canAccessGroupData: false,
				canAccessRegionData: false,
				canAccessAllData: false,
				canViewModule: false,
				canEditModule: false,
				canDeleteModule: false,
			};
			item[accessName] = !item[accessName];
			user.permissionType.push(item);
		}
		const newPermissions = await user.save();
		res.status(201).json(newPermissions);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
module.exports = {
	addPermission,
	getUserPermissions,
	updatePermission,
	getPermissionByUserId,
	ADMIN_PERMISSION,
	SALES_ASSOCIATE_PERMISSION,
};
