const Group = require("../models/Group");
const Timesheet = require("../models/Timesheet");

const getAllPayGroups = async (req, res) => {
	const { companyName } = req.params;
	try {
		const searchString = "Paygroup";
		const groups = await Group.find({
			companyName,
			name: { $regex: searchString, $options: "i" },
		});
		res.status(200).json(groups);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getGroupedTimesheet = async (req, res) => {
	const { companyName, startDate, endDate } = req.params;

	try {
		const timesheets = await Timesheet.find({
			companyName,
			createdOn: { $gte: startDate, $lte: endDate },
		}).populate({
			path: "employeeId",
			model: "Employee",
			select: ["role", "fullName"],
		});
		// const aggregatedHours = timesheets.reduce(
		// 	(acc, timesheet) => {
		// 		acc.totalRegHoursWorked += timesheet.regHoursWorked || 0;
		// 		acc.totalOvertimeHoursWorked += timesheet.overtimeHoursWorked || 0;
		// 		acc.totalDblOvertimeHoursWorked +=
		// 			timesheet.dblOvertimeHoursWorked || 0;
		// 		acc.totalStatDayHoursWorked += timesheet.statDayHoursWorked || 0;
		// 		acc.totalSickHoursWorked += timesheet.sickHoursWorked || 0;
		// 		acc.totalStatHoursWorked += timesheet.statHoursWorked || 0;
		// 		return acc;
		// 	},
		// 	{
		// 		totalRegHoursWorked: 0,
		// 		totalOvertimeHoursWorked: 0,
		// 		totalDblOvertimeHoursWorked: 0,
		// 		totalStatDayHoursWorked: 0,
		// 		totalSickHoursWorked: 0,
		// 		totalStatHoursWorked: 0,
		// 	},
		// );

		// console.log("aggregationResult=", aggregatedHours);

		// res.status(200).json(aggregatedHours);
		// const totalRegHoursWorked = aggregationResult.reduce((acc, product) => {
		// 	return acc + product.regHoursWorked;
		// }, 0);
		// const totalOvertimeHoursWorked = aggregationResult.reduce(
		// 	(acc, product) => {
		// 		return acc + product.overtimeHoursWorked;
		// 	},
		// 	0,
		// );
		// const totalDblOvertimeHoursWorked = aggregationResult.reduce(
		// 	(acc, product) => {
		// 		return acc + product.dblOvertimeHoursWorked;
		// 	},
		// 	0,
		// );
		// const totalStatDayHoursWorked = aggregationResult.reduce((acc, product) => {
		// 	return acc + product.statDayHoursWorked;
		// }, 0);
		// const totalSickHoursWorked = aggregationResult.reduce((acc, product) => {
		// 	return acc + product.sickHoursWorked;
		// }, 0);
		// const totalStatHoursWorked = aggregationResult.reduce((acc, product) => {
		// 	return acc + product.statHoursWorked;
		// }, 0);

		// console.log("aggregationResult=", aggregatedHours);

		const aggregatedHours = timesheets.reduce((acc, timesheet) => {
			if (!acc[timesheet.employeeId]) {
				acc[timesheet.employeeId] = {
					_id: timesheet._id,
					empId: timesheet.employeeId,
					totalRegHoursWorked: 0,
					totalOvertimeHoursWorked: 0,
					totalDblOvertimeHoursWorked: 0,
					totalStatDayHoursWorked: 0,
					totalSickHoursWorked: 0,
					totalStatHoursWorked: 0,
				};
			}
			acc[timesheet.employeeId].totalRegHoursWorked +=
				timesheet.regHoursWorked || 0;
			acc[timesheet.employeeId].totalOvertimeHoursWorked +=
				timesheet.overtimeHoursWorked || 0;
			acc[timesheet.employeeId].totalDblOvertimeHoursWorked +=
				timesheet.dblOvertimeHoursWorked || 0;
			acc[timesheet.employeeId].totalStatDayHoursWorked +=
				timesheet.statDayHoursWorked || 0;
			acc[timesheet.employeeId].totalSickHoursWorked +=
				timesheet.sickHoursWorked || 0;
			acc[timesheet.employeeId].totalStatHoursWorked +=
				timesheet.statHoursWorked || 0;
			return acc;
		}, {});

		const result = Object.values(aggregatedHours);
		console.log(result);
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};
// const findEmployeePayInfo = async (empId, companyName) =>
// 	await EmployeePayInfo.findOne({
// 		empId,
// 		companyName,
// 	});

// const updatePayInfo = async (id, data) =>
// 	await EmployeePayInfo.findByIdAndUpdate(id, data, {
// 		new: true,
// 	});
// const addPayGroup = async (req, res) => {
// 	const {
// 		empId,
// 		companyName,
// 		regPay,
// 		overTimePay,
// 		dblOverTimePay,
// 		statWorkPay,
// 		statPay,
// 		sickPay,
// 		salaryRate,
// 		dailyHours,
// 		longTermDisabilityEE,
// 		longTermDisabilityER,
// 		dentalEE,
// 		dentalER,
// 		extendedHealthEE,
// 		extendedHealthER,
// 		unionDues,
// 		vacationPay,
// 	} = req.body;
// 	try {
// 		const existingPayInfo = await findEmployeePayInfo(empId, companyName);
// 		if (existingPayInfo) {
// 			const updatedPayInfo = await updatePayInfo(existingPayInfo._id, req.body);
// 			return res.status(201).json(updatedPayInfo);
// 		}
// 		const newPayInfo = await EmployeePayInfo.create({
// 			empId,
// 			companyName,
// 			regPay,
// 			overTimePay,
// 			dblOverTimePay,
// 			statWorkPay,
// 			statPay,
// 			sickPay,
// 			salaryRate,
// 			dailyHours,
// 			longTermDisabilityEE,
// 			longTermDisabilityER,
// 			dentalEE,
// 			dentalER,
// 			extendedHealthEE,
// 			extendedHealthER,
// 			unionDues,
// 			vacationPay,
// 		});
// 		return res.status(201).json(newPayInfo);
// 	} catch (error) {
// 		res.status(400).json({ message: error.message });
// 	}
// };
const getPayGroup = () => {};
const addPayGroup = () => {};
const updatePayGroup = () => {};
module.exports = {
	getAllPayGroups,
	getPayGroup,
	addPayGroup,
	updatePayGroup,
	getGroupedTimesheet,
};
