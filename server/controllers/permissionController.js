const UserPermissions = require("../models/permissions");
const {
	ADMIN_PERMISSION,
	CLIENT_ORG_ADMIN_PERMISSION,
	CLIENT_ORG_EMP_PERMISSION,
	ROLES,
} = require("../services/data");

const getUserPermissions = async (req, res) => {
	try {
		const allPermissions = await UserPermissions.find();
		res.status(200).json(allPermissions);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const findPermission = async (record) =>
	await UserPermissions.findOne(record).sort({ updatedOn: -1 });

const getPermission = async (req, res) => {
	const { empId, companyName } = req.params;

	try {
		const userPermission = await findPermission({
			empId,
			companyName,
		});
		// const deletePermissions = userPermission
		// 	.filter((_) => _.permissionType?.length !== 44)
		// 	?.map((_id) => _id);
		// // const updatedIDs = await UserPermissions.deleteMany({ _id: { $in: deletePermissions } });
		// console.log(deletePermissions);

		if (userPermission) return res.status(200).json(userPermission);

		// const userPermissions = await UserPermissions.find({
		// 	empId,
		// 	companyName,
		// }).sort({ updatedOn: -1 });
		// if (userPermissions.length > 1) {
		// 	const idsToDelete = userPermissions.slice(1).map((record) => record._id); // Skip the first one, delete the rest

		// 	const deleteDuplicates = await UserPermissions.deleteMany({
		// 		_id: { $in: idsToDelete },
		// 	});
		// 	console.log("deleted", deleteDuplicates);
		// }
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const addPermission = async (req, res) => {
	let { empId, accessName, name, companyName } = req.body;

	try {
		const permissionExists = await findPermission({
			empId,
			companyName,
		});
		if (!permissionExists) {
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
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const getPermissionsList = (role) => {
	const isEmployee = role === ROLES.EMPLOYEE;
	const isEnroller = role === ROLES.ENROLLER;
	const isShadowAdmin = role === ROLES.SHADOW_ADMIN;

	const permissionName = isEmployee
		? CLIENT_ORG_EMP_PERMISSION
		: isShadowAdmin
		? ADMIN_PERMISSION
		: CLIENT_ORG_ADMIN_PERMISSION;

	const permissionType = [];

	if (isEmployee) {
		permissionName.forEach((_) => {
			permissionType.push({
				name: _.name,
				canAccessModule: true,
				canAccessUserData: true,
				canAccessGroupData: false,
				canAccessRegionData: false,
				canAccessAllData: false,
				canViewModule: true,
				canEditModule: true,
				canDeleteModule: false,
			});
		});
	} else if (isEnroller) {
	} else {
		permissionName.forEach((_) => {
			permissionType.push({
				name: _.name,
				canAccessModule: true,
				canAccessUserData: true,
				canAccessGroupData: true,
				canAccessRegionData: true,
				canAccessAllData: true,
				canViewModule: true,
				canEditModule: true,
				canDeleteModule: true,
			});
		});
	}
	return permissionType;
};

const setInitialPermissions = async (empId, role, companyName) => {
	try {
		const permissionExists = await findPermission({
			empId,
			companyName,
		});
		const newPermissions = getPermissionsList(role);
		if (permissionExists) {
			await UserPermissions.findByIdAndUpdate(permissionExists._id, {
				permissionType: newPermissions,
			});
		} else {
			await UserPermissions.create({
				empId,
				companyName,
				permissionType: newPermissions,
			});
		}
	} catch (error) {
		console.log(error);
	}
};

const updatePermission = async (req, res) => {
	const { empId } = req.params;
	let { name, accessName, companyName } = req.body;

	try {
		const user = await findPermission({ empId, companyName });

		const permissionIndex = user.permissionType.findIndex((item) => item.name === name);
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
	setInitialPermissions,
	updatePermission,
	getPermission,
	findPermission,
};
