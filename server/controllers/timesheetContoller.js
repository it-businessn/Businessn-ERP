const Employee = require("../models/Employee");
const Project = require("../models/Project");
const Timesheet = require("../models/Timesheet");

const currentDate = new Date();

const getTimesheet = () => async (req, res) => {
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

const getTimesheetById = () => async (req, res) => {
	const id = req.params.id;

	try {
		const timesheet = await Timesheet.findById(id);
		res.status(200).json(timesheet);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const createTimesheet = () => async (req, res) => {
	const { employeeId } = req.body;
	try {
		const existingTimesheet = await Timesheet.findOne({
			employeeId,
			createdOn: {
				$gte: new Date(
					currentDate.getFullYear(),
					currentDate.getMonth(),
					currentDate.getDate(),
				),
				$lt: new Date(
					currentDate.getFullYear(),
					currentDate.getMonth(),
					currentDate.getDate() + 1,
				),
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
			const timesheet = new Timesheet({
				clockIns: Date.now(),
				employeeId,
			});

			try {
				const newTimesheet = await timesheet.save();
				res.status(201).json(newTimesheet);
			} catch (error) {
				res.status(400).json({ message: error.message });
			}
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateTimesheet = () => async (req, res) => {
	const { id } = req.params;
	const { key } = req.body;
	try {
		const timesheet = await Timesheet.findOne({ employeeId: id });

		timesheet[key].push(Date.now());
		await timesheet.save();
		res.status(201).json(timesheet);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
module.exports = {
	createTimesheet,
	getTimesheet,
	getTimesheetById,
	updateTimesheet,
};
