const UserPermissions = require("../models/permissions");

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
};
