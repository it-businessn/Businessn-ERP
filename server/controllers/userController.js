const User = require("../models/User");
const Lead = require("../models/Lead");

const getUsers = () => async (req, res) => {
	try {
		// const users = (await User.find()).sort((a, b) => b.createdOn - a.createdOn);
		const users = await User.find();
		res.status(200).json(users);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const login = () => async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			res.status(404).json({ error: "User does not exist" });
			return;
		}
		res.status(200).json(user);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const createUser = () => async (req, res) => {
	const {
		address,
		companyId,
		department,
		email,
		firstName,
		fullName,
		lastName,
		manager,
		middleName,
		password,
		phoneNumber,
		role,
	} = req.body;

	const user = new User({
		address,
		companyId,
		date: Date.now(),
		department,
		email,
		firstName,
		fullName,
		lastName,
		manager,
		middleName,
		password,
		phoneNumber,
		role,
	});
	try {
		const newUser = await user.save();
		res.status(201).json(newUser);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const changePassword = () => async (req, res) => {
	const { newPassword } = req.body;
	const user = req.user;
	try {
		if (!newPassword) {
			throw new Error("New password is required");
		}
		const hashedPassword = bcrypt.hashSync(newPassword, 10);
		user.password = hashedPassword;
		const updatedUser = await User.findByIdAndUpdate(
			user[0]._id,
			{ password: hashedPassword },
			{
				new: true,
			},
		);
		res
			.status(201)
			.json({ message: "Password changed successfully", updatedUser });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateUser = () => async (req, res) => {
	const userId = req.params.id;
	try {
		const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
			new: true,
		});

		res.status(201).json(updatedUser);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateUserAssignedLeads = async (req, res) => {
	try {
		const leads = await Lead.find({ isDisbursed: true });
		const totalRecords = leads.length;

		const activeUsers = await User.find({ isActive: true });
		const totalWeight = activeUsers.reduce(
			(sum, item) => sum + item.assignedWeight,
			0,
		);
		for (const user of activeUsers) {
			const assignedLeads = Math.round(
				(user.assignedWeight / totalWeight) * totalRecords,
			);
			await User.findByIdAndUpdate(
				user._id,
				{ $set: { assignedLeads } },
				{ new: true },
			);
		}

		res.status(200).json({ message: "Updated successfully" });
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

module.exports = {
	changePassword,
	createUser,
	getUsers,
	login,
	updateUser,
	updateUserAssignedLeads,
};
