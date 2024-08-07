const EmployeePayInfo = require("../models/EmployeePayInfo");
const Timesheet = require("../models/Timesheet");
const moment = require("moment");

const currentDate = new Date();
const getTimesheets = async (req, res) => {
	const { companyName } = req.params;
	try {
		// const projectsByEmployee = await Project.aggregate([
		// 	{
		// 		$group: {
		// 			_id: "$selectedAssignees",
		// 			tasks: {
		// 				$push: {
		// 					name: "$name",
		// 				},
		// 			},
		// 		},
		// 	},
		// ]);
		// const users = await Employee.aggregate([
		// 	{
		// 		$group: {
		// 			_id: "$_id",
		// 			employees: {
		// 				$push: {
		// 					fullName: "$fullName",
		// 					id: "$_id",
		// 					projects: {
		// 						$reduce: {
		// 							input: projectsByEmployee,
		// 							initialValue: [],
		// 							in: {
		// 								$cond: {
		// 									if: { $in: ["$fullName", "$$this._id"] }, // if employee name is in the selectedAssignees of the task
		// 									then: { $concatArrays: ["$$value", "$$this.tasks"] }, // Merge projects arrays
		// 									else: "$$value", // default value
		// 								},
		// 							},
		// 						},
		// 					},
		// 				},
		// 			},
		// 		},
		// 	},
		// ]);
		const timesheets = await Timesheet.find({ companyName }).populate({
			path: "employeeId",
			model: "Employee",
			select: ["department", "fullName"],
		});

		const payInfoResult = await EmployeePayInfo.find({
			companyName,
		}).select(
			"empId regPay overTimePay dblOverTimePay statWorkPay statPay sickPay vacationPay",
		);

		const payInfoMap = new Map(
			payInfoResult.map((payInfo) => [
				payInfo.empId.toString(),
				{
					regPay: payInfo.regPay,
					overTimePay: payInfo.overTimePay,
					dblOverTimePay: payInfo.dblOverTimePay,
					statWorkPay: payInfo.statWorkPay,
					statPay: payInfo.statPay,
					sickPay: payInfo.sickPay,
					vacationPay: payInfo.vacationPay,
				},
			]),
		);

		timesheets
			.sort((a, b) => b.createdOn - a.createdOn)
			.forEach((timesheet) => {
				const empIdStr = timesheet.employeeId._id.toString();
				if (!payInfoMap.has(empIdStr)) {
					return;
				}
				const payInfo = payInfoMap.get(empIdStr);
				timesheet.regPay = payInfo.regPay;
				timesheet.overTimePay = payInfo.overTimePay;
				timesheet.dblOverTimePay = payInfo.dblOverTimePay;
				timesheet.statWorkPay = payInfo.statWorkPay;
				timesheet.statPay = payInfo.statPay;
				timesheet.sickPay = payInfo.sickPay;
				timesheet.vacationPay = payInfo.vacationPay;
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
	const { companyName, empId } = req.params;

	try {
		const timesheet = await Timesheet.find({ companyName, empId }).populate({
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
	const { company, type, createdOn, employeeId } = req.body;
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
		const newTimesheet = await Timesheet.create({
			employeeId,
			companyName: company,
			payType: type,
			createdOn,
		});
		res.status(201).json(newTimesheet);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const getDateDiffHours = (date1, date2, totalBreaks) => {
	const startTime = moment(date1 === "" ? "09:00" : date1, "HH:mm");
	const endTime = moment(date2 === "" ? "17:00" : date2, "HH:mm");
	const breakTime = totalBreaks === "" ? 0 : parseInt(totalBreaks) / 60;
	const totalMinutes = moment.duration(endTime.diff(startTime)).asMinutes();
	const netMinutes = totalMinutes - breakTime;
	// const hoursDiff = Math.floor(netMinutes / 60);
	// const minutesDiff = Math.floor(netMinutes % 60);

	// const formattedHours = String(hoursDiff);
	// const formattedMinutes = String(minutesDiff);
	// return `${formattedHours}:${formattedMinutes}`;
	return netMinutes;
};

const updateTimesheet = async (req, res) => {
	const { id } = req.params;
	let { startTime, endTime, totalBreaks, approve, param_hours, company } =
		req.body;
	try {
		const timesheet = await Timesheet.findById(id);
		if (param_hours === "statDayHours") {
			startTime = "09:00";
			endTime = "17:00";
		}
		timesheet.clockIns[0] = startTime;
		timesheet.clockOuts.push(endTime);
		timesheet.totalBreaks = totalBreaks;
		timesheet[param_hours] = getDateDiffHours(startTime, endTime, totalBreaks);

		//create auto or manually create
		// if (parseInt(timesheet[param_hours]) > 8) {
		// 	timesheet.overtimeHoursWorked = parseInt(timesheet[param_hours]) - 8;
		// 	timesheet.regHoursWorked = 8;
		// 	await Timesheet.create({
		// 		employeeId: timesheet.employeeId,
		// 		companyName: company,
		// 		payType: "Overtime Pay",
		// 		overtimeHoursWorked: timesheet.overtimeHoursWorked,
		// 	});
		// }

		timesheet.approveStatus = approve
			? "Approved"
			: approve === false
			? "Rejected"
			: "Pending";
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
