const Employee = require("../models/Employee");
const Project = require("../models/Project");
const Timesheet = require("../models/Timesheet");

const currentDate = new Date();

const getTimesheets = async (req, res) => {
	try {
		const projectsByEmployee = await Project.aggregate([
			{
				$group: {
					_id: "$selectedAssignees",
					tasks: {
						$push: {
							name: "$name",
						},
					},
				},
			},
		]);
		const users = await Employee.aggregate([
			{
				$group: {
					_id: "$_id",
					employees: {
						$push: {
							fullName: "$fullName",
							id: "$_id",
							projects: {
								$reduce: {
									input: projectsByEmployee,
									initialValue: [],
									in: {
										$cond: {
											if: { $in: ["$fullName", "$$this._id"] }, // if employee name is in the selectedAssignees of the task
											then: { $concatArrays: ["$$value", "$$this.tasks"] }, // Merge projects arrays
											else: "$$value", // default value
										},
									},
								},
							},
						},
					},
				},
			},
		]);
		const timesheets = await Timesheet.find({}).populate({
			path: "employeeId",
			model: "Employee",
			select: ["role", "fullName"],
		});

		// for (const timesheet of timesheets) {
		// 	// Find the corresponding employee in the users array
		// 	const user = users.find((user) =>
		// 		user._id.equals(timesheet.employeeId._id),
		// 	);

		// 	// If user is found, append the user object to the timesheet
		// 	if (user) {
		// 		timesheet.projectEntries.push(user.employees[0].projects);
		// 	}
		// 	await timesheet.save();
		// }
		res.status(200).json(timesheets);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getTimesheet = async (req, res) => {
	const { employeeId } = req.params;

	try {
		const timesheet = await Timesheet.find({
			employeeId,
		}).populate({
			path: "employeeId",
			model: "Employee",
			select: ["role", "fullName"],
		});
		res.status(200).json(timesheet);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const createTimesheet = async (req, res) => {
	const { employeeId, companyName } = req.body;
	try {
		const today = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			currentDate.getDate(),
		);
		const tomorrow = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			currentDate.getDate() + 1,
		);
		const existingTimesheet = await Timesheet.findOne({
			employeeId,
			companyName,
			createdOn: {
				$gte: today,
				$lt: tomorrow,
			},
		});
		if (existingTimesheet) {
			existingTimesheet.clockIns.push(Date.now());

			try {
				await existingTimesheet.save();
				res.status(201).json(existingTimesheet);
			} catch (error) {
				res.status(400).json({ message: error.message });
			}
		} else {
			try {
				const newTimesheet = await Timesheet.create({
					clockIns: Date.now(),
					employeeId,
				});
				res.status(201).json(newTimesheet);
			} catch (error) {
				res.status(400).json({ message: error.message });
			}
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateTimesheet = async (req, res) => {
	const { employeeId } = req.params;
	const { key } = req.body;
	try {
		const timesheet = await Timesheet.findOne({ employeeId });

		timesheet[key].push(Date.now());
		await timesheet.save();
		res.status(201).json(timesheet);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
module.exports = {
	createTimesheet,
	getTimesheets,
	getTimesheet,
	updateTimesheet,
};
