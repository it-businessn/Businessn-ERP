const { findEmployeePayInfoDetails } = require("./payInfoController");
const {
	findAdditionalSuperficialHoursAllocatedInfo,
	findAdditionalManualHoursAllocatedInfo,
	findAdditionalPayoutHoursAllocatedInfo,
	findAdditionalHoursAllocatedInfo,
} = require("./additionalAllocationInfoController");

const getHourlyAggregatedResult = async (
	activeEmployees,
	currentPeriodEmployees,
	companyName,
	payDate,
	isSuperficial,
	isManual,
	isPayout,
) => {
	const aggregatedResult = [];
	for (const employee of activeEmployees) {
		const empTimesheetData = currentPeriodEmployees?.find(
			(el) => el.empId._id.toString() === employee._id.toString(),
		);
		const result = await buildEmpHourlyDetails(empTimesheetData ?? null, employee, companyName);
		// if (isSuperficial) {
		// 	const additionalHoursAllocatedInfo = await findAdditionalSuperficialHoursAllocatedInfo({
		// 		empId: employee._id,
		// 		companyName,
		// 		payPeriodPayDate: payDate,
		// 	});

		// 	result.additionalSuperficialRegHoursWorked =
		// 		additionalHoursAllocatedInfo?.additionalSuperficialRegHoursWorked ?? 0;
		// 	result.additionalSuperficialOvertimeHoursWorked =
		// 		additionalHoursAllocatedInfo?.additionalSuperficialOvertimeHoursWorked || 0;
		// 	result.additionalSuperficialDblOvertimeHoursWorked =
		// 		additionalHoursAllocatedInfo?.additionalSuperficialDblOvertimeHoursWorked || 0;
		// 	result.additionalSuperficialStatHoursWorked =
		// 		additionalHoursAllocatedInfo?.additionalSuperficialStatHoursWorked || 0;
		// 	result.additionalSuperficialStatDayHoursWorked =
		// 		additionalHoursAllocatedInfo?.additionalSuperficialStatDayHoursWorked || 0;
		// 	result.additionalSuperficialSickHoursWorked =
		// 		additionalHoursAllocatedInfo?.additionalSuperficialSickHoursWorked || 0;
		// 	result.additionalSuperficialVacationHoursWorked =
		// 		additionalHoursAllocatedInfo?.additionalSuperficialVacationHoursWorked || 0;

		// 	const {
		// 		totalDblOvertimeHoursWorked,
		// 		totalOvertimeHoursWorked,
		// 		totalRegHoursWorked,
		// 		totalSickHoursWorked,
		// 		totalStatDayHoursWorked,
		// 		totalStatHours,
		// 		totalVacationHoursWorked,
		// 		additionalSuperficialRegHoursWorked,
		// 		additionalSuperficialOvertimeHoursWorked,
		// 		additionalSuperficialDblOvertimeHoursWorked,
		// 		additionalSuperficialStatHoursWorked,
		// 		additionalSuperficialStatDayHoursWorked,
		// 		additionalSuperficialSickHoursWorked,
		// 		additionalSuperficialVacationHoursWorked,
		// 	} = result;

		// 	result.totalSuperficialHoursWorked =
		// 		totalDblOvertimeHoursWorked +
		// 		totalOvertimeHoursWorked +
		// 		totalRegHoursWorked +
		// 		totalSickHoursWorked +
		// 		totalStatDayHoursWorked +
		// 		totalStatHours +
		// 		totalVacationHoursWorked +
		// 		additionalSuperficialRegHoursWorked +
		// 		additionalSuperficialOvertimeHoursWorked +
		// 		additionalSuperficialDblOvertimeHoursWorked +
		// 		additionalSuperficialStatHoursWorked +
		// 		additionalSuperficialStatDayHoursWorked +
		// 		additionalSuperficialSickHoursWorked +
		// 		additionalSuperficialVacationHoursWorked;
		// 	aggregatedResult.push(result);
		// } else if (isManual) {
		// 	const additionalHoursAllocatedInfo = await findAdditionalManualHoursAllocatedInfo({
		// 		empId: employee._id,
		// 		companyName,
		// 		payPeriodPayDate: payDate,
		// 	});

		// 	result.additionalManualRegHoursWorked =
		// 		additionalHoursAllocatedInfo?.additionalManualRegHoursWorked ?? 0;
		// 	result.additionalManualOvertimeHoursWorked =
		// 		additionalHoursAllocatedInfo?.additionalManualOvertimeHoursWorked || 0;
		// 	result.additionalManualDblOvertimeHoursWorked =
		// 		additionalHoursAllocatedInfo?.additionalManualDblOvertimeHoursWorked || 0;
		// 	result.additionalManualStatHoursWorked =
		// 		additionalHoursAllocatedInfo?.additionalManualStatHoursWorked || 0;
		// 	result.additionalManualStatDayHoursWorked =
		// 		additionalHoursAllocatedInfo?.additionalManualStatDayHoursWorked || 0;
		// 	result.additionalManualSickHoursWorked =
		// 		additionalHoursAllocatedInfo?.additionalManualSickHoursWorked || 0;
		// 	result.additionalManualVacationHoursWorked =
		// 		additionalHoursAllocatedInfo?.additionalManualVacationHoursWorked || 0;

		// 	const {
		// 		totalDblOvertimeHoursWorked,
		// 		totalOvertimeHoursWorked,
		// 		totalRegHoursWorked,
		// 		totalSickHoursWorked,
		// 		totalStatDayHoursWorked,
		// 		totalStatHours,
		// 		totalVacationHoursWorked,
		// 		additionalManualRegHoursWorked,
		// 		additionalManualOvertimeHoursWorked,
		// 		additionalManualDblOvertimeHoursWorked,
		// 		additionalManualStatHoursWorked,
		// 		additionalManualStatDayHoursWorked,
		// 		additionalManualSickHoursWorked,
		// 		additionalManualVacationHoursWorked,
		// 	} = result;

		// 	result.totalManualHoursWorked =
		// 		totalDblOvertimeHoursWorked +
		// 		totalOvertimeHoursWorked +
		// 		totalRegHoursWorked +
		// 		totalSickHoursWorked +
		// 		totalStatDayHoursWorked +
		// 		totalStatHours +
		// 		totalVacationHoursWorked +
		// 		additionalManualRegHoursWorked +
		// 		additionalManualOvertimeHoursWorked +
		// 		additionalManualDblOvertimeHoursWorked +
		// 		additionalManualStatHoursWorked +
		// 		additionalManualStatDayHoursWorked +
		// 		additionalManualSickHoursWorked +
		// 		additionalManualVacationHoursWorked;
		// 	aggregatedResult.push(result);
		// } else if (isPayout) {
		// 	const additionalHoursAllocatedInfo = await findAdditionalPayoutHoursAllocatedInfo({
		// 		empId: employee._id,
		// 		companyName,
		// 		payPeriodPayDate: payDate,
		// 	});

		// 	result.additionalPayoutRegHoursWorked =
		// 		additionalHoursAllocatedInfo?.additionalPayoutRegHoursWorked ?? 0;
		// 	result.additionalPayoutOvertimeHoursWorked =
		// 		additionalHoursAllocatedInfo?.additionalPayoutOvertimeHoursWorked || 0;
		// 	result.additionalPayoutDblOvertimeHoursWorked =
		// 		additionalHoursAllocatedInfo?.additionalPayoutDblOvertimeHoursWorked || 0;
		// 	result.additionalPayoutStatHoursWorked =
		// 		additionalHoursAllocatedInfo?.additionalPayoutStatHoursWorked || 0;
		// 	result.additionalPayoutStatDayHoursWorked =
		// 		additionalHoursAllocatedInfo?.additionalPayoutStatDayHoursWorked || 0;
		// 	result.additionalPayoutSickHoursWorked =
		// 		additionalHoursAllocatedInfo?.additionalPayoutSickHoursWorked || 0;
		// 	result.additionalPayoutVacationHoursWorked =
		// 		additionalHoursAllocatedInfo?.additionalPayoutVacationHoursWorked || 0;

		// 	const {
		// 		totalDblOvertimeHoursWorked,
		// 		totalOvertimeHoursWorked,
		// 		totalRegHoursWorked,
		// 		totalSickHoursWorked,
		// 		totalStatDayHoursWorked,
		// 		totalStatHours,
		// 		totalVacationHoursWorked,
		// 		additionalPayoutRegHoursWorked,
		// 		additionalPayoutOvertimeHoursWorked,
		// 		additionalPayoutDblOvertimeHoursWorked,
		// 		additionalPayoutStatHoursWorked,
		// 		additionalPayoutStatDayHoursWorked,
		// 		additionalPayoutSickHoursWorked,
		// 		additionalPayoutVacationHoursWorked,
		// 	} = result;

		// 	result.totalPayoutHoursWorked =
		// 		totalDblOvertimeHoursWorked +
		// 		totalOvertimeHoursWorked +
		// 		totalRegHoursWorked +
		// 		totalSickHoursWorked +
		// 		totalStatDayHoursWorked +
		// 		totalStatHours +
		// 		totalVacationHoursWorked +
		// 		additionalPayoutRegHoursWorked +
		// 		additionalPayoutOvertimeHoursWorked +
		// 		additionalPayoutDblOvertimeHoursWorked +
		// 		additionalPayoutStatHoursWorked +
		// 		additionalPayoutStatDayHoursWorked +
		// 		additionalPayoutSickHoursWorked +
		// 		additionalPayoutVacationHoursWorked;
		// 	aggregatedResult.push(result);
		// } else {
		const additionalHoursAllocatedInfo = await findAdditionalHoursAllocatedInfo({
			empId: employee._id,
			companyName,
			payPeriodPayDate: payDate,
		});

		result.additionalRegHoursWorked = additionalHoursAllocatedInfo?.additionalRegHoursWorked ?? 0;
		result.additionalOvertimeHoursWorked =
			additionalHoursAllocatedInfo?.additionalOvertimeHoursWorked || 0;
		result.additionalDblOvertimeHoursWorked =
			additionalHoursAllocatedInfo?.additionalDblOvertimeHoursWorked || 0;
		result.additionalStatHoursWorked = additionalHoursAllocatedInfo?.additionalStatHoursWorked || 0;
		result.additionalStatDayHoursWorked =
			additionalHoursAllocatedInfo?.additionalStatDayHoursWorked || 0;
		result.additionalSickHoursWorked = additionalHoursAllocatedInfo?.additionalSickHoursWorked || 0;
		result.additionalVacationHoursWorked =
			additionalHoursAllocatedInfo?.additionalVacationHoursWorked || 0;

		result.totalHoursWorked = additionalHoursAllocatedInfo?.totalHoursWorked
			? additionalHoursAllocatedInfo?.totalHoursWorked
			: totalDblOvertimeHoursWorked +
			  totalOvertimeHoursWorked +
			  totalRegHoursWorked +
			  totalSickHoursWorked +
			  totalStatDayHoursWorked +
			  totalStatHours +
			  totalVacationHoursWorked;
		aggregatedResult.push(result);
		// }
	}
	return aggregatedResult;
};

const buildEmpHourlyDetails = async (empTimesheetData, employee, companyName) => {
	const {
		employeeId,
		recordId,
		fullName,
		totalRegHoursWorked,
		totalOvertimeHoursWorked,
		totalDblOvertimeHoursWorked,
		totalStatDayHoursWorked,
		totalStatHours,
		totalSickHoursWorked,
		totalVacationHoursWorked,
	} = await getGroupedData(empTimesheetData, employee, companyName);
	return {
		_id: employeeId,
		empId: { fullName, _id: recordId },
		totalRegHoursWorked,
		totalOvertimeHoursWorked,
		totalDblOvertimeHoursWorked,
		totalStatDayHoursWorked,
		totalStatHours,
		totalSickHoursWorked,
		totalVacationHoursWorked,
	};
};

const getGroupedData = async (empTimesheetData, employee, companyName) => {
	const empPayInfoResult = await findEmployeePayInfoDetails(employee._id, companyName);
	const isFT = empPayInfoResult?.typeOfEarning === "Full Time Salaried";
	const isPT = empPayInfoResult?.typeOfEarning === "Part Time Salaried";

	const employeeId = empTimesheetData ? empTimesheetData.empId.employeeId : employee.employeeId;

	const recordId = empTimesheetData ? empTimesheetData.empId._id : employee._id;
	const fullName = empTimesheetData ? empTimesheetData.empId.fullName : employee.fullName;

	const totalRegHoursWorked = isFT
		? empPayInfoResult?.fullTimeStandardHours
		: isPT
		? empPayInfoResult?.partTimeStandardHours
		: empTimesheetData
		? empTimesheetData.totalRegHoursWorked
		: 0;
	const totalOvertimeHoursWorked = empTimesheetData ? empTimesheetData.totalOvertimeHoursWorked : 0;
	const totalDblOvertimeHoursWorked = empTimesheetData
		? empTimesheetData.totalDblOvertimeHoursWorked
		: 0;
	const totalStatDayHoursWorked = empTimesheetData ? empTimesheetData.totalStatDayHoursWorked : 0;
	const totalStatHours = empTimesheetData ? empTimesheetData.totalStatHours : 0;
	const totalSickHoursWorked = empTimesheetData ? empTimesheetData.totalSickHoursWorked : 0;
	const totalVacationHoursWorked = empTimesheetData ? empTimesheetData.totalVacationHoursWorked : 0;
	return {
		employeeId,
		recordId,
		fullName,
		totalRegHoursWorked: parseFloat(totalRegHoursWorked || 0),
		totalOvertimeHoursWorked: parseFloat(totalOvertimeHoursWorked || 0),
		totalDblOvertimeHoursWorked: parseFloat(totalDblOvertimeHoursWorked || 0),
		totalStatDayHoursWorked: parseFloat(totalStatDayHoursWorked || 0),
		totalStatHours: parseFloat(totalStatHours || 0),
		totalSickHoursWorked: parseFloat(totalSickHoursWorked || 0),
		totalVacationHoursWorked: parseFloat(totalVacationHoursWorked || 0),
	};
};
module.exports = {
	getHourlyAggregatedResult,
};
