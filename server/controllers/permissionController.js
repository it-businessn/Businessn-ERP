const UserPermissions = require("../models/permissions");

const getUserPermissions = async (req, res) => {
	try {
		const allPermissions = await UserPermissions.find();
		res.status(200).json(allPermissions);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getPermission = async (req, res) => {
	const { empId, companyName } = req.params;

	try {
		const user = await UserPermissions.findOne({
			empId,
			companyName,
		});
		res.status(200).json(user);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const addPermission = async (req, res) => {
	let { empId, accessName, name, companyName } = req.body;

	try {
		const user = new UserPermissions({
			empId,
			companyName,
		});
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

const updatePermission = async (req, res) => {
	const { empId } = req.params;
	let { name, accessName, companyName } = req.body;

	try {
		const user = await UserPermissions.findOne({ empId, companyName });

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
	getPermission,
};
