const EmployeePayInfo = require("../models/EmployeePayInfo");
const { EARNING_TYPE } = require("../services/data");
const {
	findAdditionalSuperficialHoursAllocatedInfo,
	findAdditionalManualHoursAllocatedInfo,
	findAdditionalPayoutHoursAllocatedInfo,
	findAdditionalHoursAllocatedInfo,
} = require("./payrunExtraAllocationInfoController");

const getHourlyAggregatedResult = async (
	activeEmployees,
	currentPeriodEmployees,
	companyName,
	payDate,
	isSuperficial,
	isManual,
	isPayout,
	isExtraPayRun,
) => {
	const aggregatedResult = [];
	for (const employee of activeEmployees) {
		const empTimesheetData = currentPeriodEmployees?.find(
			(el) => el.empId._id.toString() === employee?.empId?._id.toString(),
		);
		const result = await buildEmpHourlyDetails(
			empTimesheetData || null,
			employee,
			companyName,
			isExtraPayRun,
		);

		if (isSuperficial) {
			await calcSuperficialAggregatedHours(
				employee.empId?._id,
				companyName,
				payDate,
				result,
				aggregatedResult,
			);
		} else if (isManual) {
			await calcManualAggregatedHours(
				employee.empId?._id,
				companyName,
				payDate,
				result,
				aggregatedResult,
			);
		} else if (isPayout) {
			await calcPayoutAggregatedHours(
				employee.empId?._id,
				companyName,
				payDate,
				result,
				aggregatedResult,
			);
		} else {
			await calcRegularAggregatedHours(
				employee.empId?._id,
				companyName,
				payDate,
				result,
				aggregatedResult,
			);
		}
	}
	return aggregatedResult;
};

const calcRegularAggregatedHours = async (
	empId,
	companyName,
	payPeriodPayDate,
	result,
	aggregatedResult,
) => {
	const additionalHoursAllocatedInfo = await findAdditionalHoursAllocatedInfo({
		empId,
		companyName,
		payPeriodPayDate,
	});

	result.additionalRegHoursWorked = additionalHoursAllocatedInfo?.additionalRegHoursWorked || 0;
	result.additionalRegHoursWorked2 = additionalHoursAllocatedInfo?.additionalRegHoursWorked2 || 0;
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

	const {
		totalDblOvertimeHoursWorked,
		totalOvertimeHoursWorked,
		totalRegHoursWorked,
		totalSickHoursWorked,
		totalStatDayHoursWorked,
		totalStatHours,
		totalVacationHoursWorked,
		totalBereavementHoursWorked,
		totalPersonalDayHoursWorked,
		additionalRegHoursWorked,
		additionalOvertimeHoursWorked,
		additionalDblOvertimeHoursWorked,
		additionalStatDayHoursWorked,
		additionalVacationHoursWorked,
		additionalStatHoursWorked,
		additionalSickHoursWorked,
		additionalRegHoursWorked2,
	} = result;

	const regSumHrs =
		totalDblOvertimeHoursWorked +
		totalOvertimeHoursWorked +
		totalRegHoursWorked +
		totalSickHoursWorked +
		totalStatDayHoursWorked +
		totalStatHours +
		totalVacationHoursWorked +
		totalBereavementHoursWorked +
		totalPersonalDayHoursWorked;

	const additionalSumHrs =
		additionalRegHoursWorked +
		additionalRegHoursWorked2 +
		additionalOvertimeHoursWorked +
		additionalDblOvertimeHoursWorked +
		additionalStatDayHoursWorked +
		additionalVacationHoursWorked +
		additionalStatHoursWorked +
		additionalSickHoursWorked;

	result.totalHoursWorked =
		regSumHrs === additionalHoursAllocatedInfo?.totalHoursWorked
			? regSumHrs
			: regSumHrs + additionalSumHrs;
	aggregatedResult.push(result);
	return aggregatedResult;
};

const calcManualAggregatedHours = async (
	empId,
	companyName,
	payPeriodPayDate,
	result,
	aggregatedResult,
) => {
	const additionalHoursAllocatedInfo = await findAdditionalManualHoursAllocatedInfo({
		empId,
		companyName,
		payPeriodPayDate,
	});

	result.additionalManualRegHoursWorked =
		additionalHoursAllocatedInfo?.additionalManualRegHoursWorked || 0;
	result.additionalManualOvertimeHoursWorked =
		additionalHoursAllocatedInfo?.additionalManualOvertimeHoursWorked || 0;
	result.additionalManualDblOvertimeHoursWorked =
		additionalHoursAllocatedInfo?.additionalManualDblOvertimeHoursWorked || 0;
	result.additionalManualStatHoursWorked =
		additionalHoursAllocatedInfo?.additionalManualStatHoursWorked || 0;
	result.additionalManualStatDayHoursWorked =
		additionalHoursAllocatedInfo?.additionalManualStatDayHoursWorked || 0;
	result.additionalManualSickHoursWorked =
		additionalHoursAllocatedInfo?.additionalManualSickHoursWorked || 0;
	result.additionalManualVacationHoursWorked =
		additionalHoursAllocatedInfo?.additionalManualVacationHoursWorked || 0;

	const {
		totalDblOvertimeHoursWorked,
		totalOvertimeHoursWorked,
		totalRegHoursWorked,
		totalSickHoursWorked,
		totalStatDayHoursWorked,
		totalStatHours,
		totalVacationHoursWorked,
		additionalManualRegHoursWorked,
		additionalManualOvertimeHoursWorked,
		additionalManualDblOvertimeHoursWorked,
		additionalManualStatDayHoursWorked,
		additionalManualVacationHoursWorked,
		additionalManualStatHoursWorked,
		additionalManualSickHoursWorked,
	} = result;

	const regSumHrs =
		totalDblOvertimeHoursWorked +
		totalOvertimeHoursWorked +
		totalRegHoursWorked +
		totalSickHoursWorked +
		totalStatDayHoursWorked +
		totalStatHours +
		totalVacationHoursWorked;

	const additionalSumHrs =
		additionalManualRegHoursWorked +
		additionalManualOvertimeHoursWorked +
		additionalManualDblOvertimeHoursWorked +
		additionalManualStatDayHoursWorked +
		additionalManualVacationHoursWorked +
		additionalManualStatHoursWorked +
		additionalManualSickHoursWorked;

	result.totalManualHoursWorked =
		regSumHrs === additionalHoursAllocatedInfo?.totalManualHoursWorked
			? regSumHrs
			: regSumHrs + additionalSumHrs;
	aggregatedResult.push(result);
	return aggregatedResult;
};

const calcPayoutAggregatedHours = async (
	empId,
	companyName,
	payPeriodPayDate,
	result,
	aggregatedResult,
) => {
	const additionalHoursAllocatedInfo = await findAdditionalPayoutHoursAllocatedInfo({
		empId,
		companyName,
		payPeriodPayDate,
	});

	result.additionalPayoutRegHoursWorked =
		additionalHoursAllocatedInfo?.additionalPayoutRegHoursWorked || 0;
	result.additionalPayoutOvertimeHoursWorked =
		additionalHoursAllocatedInfo?.additionalPayoutOvertimeHoursWorked || 0;
	result.additionalPayoutDblOvertimeHoursWorked =
		additionalHoursAllocatedInfo?.additionalPayoutDblOvertimeHoursWorked || 0;
	result.additionalPayoutStatHoursWorked =
		additionalHoursAllocatedInfo?.additionalPayoutStatHoursWorked || 0;
	result.additionalPayoutStatDayHoursWorked =
		additionalHoursAllocatedInfo?.additionalPayoutStatDayHoursWorked || 0;
	result.additionalPayoutSickHoursWorked =
		additionalHoursAllocatedInfo?.additionalPayoutSickHoursWorked || 0;
	result.additionalPayoutVacationHoursWorked =
		additionalHoursAllocatedInfo?.additionalPayoutVacationHoursWorked || 0;

	const {
		totalDblOvertimeHoursWorked,
		totalOvertimeHoursWorked,
		totalRegHoursWorked,
		totalSickHoursWorked,
		totalStatDayHoursWorked,
		totalStatHours,
		totalVacationHoursWorked,
		additionalPayoutRegHoursWorked,
		additionalPayoutOvertimeHoursWorked,
		additionalPayoutDblOvertimeHoursWorked,
		additionalPayoutStatDayHoursWorked,
		additionalPayoutVacationHoursWorked,
		additionalPayoutStatHoursWorked,
		additionalPayoutSickHoursWorked,
	} = result;

	const regSumHrs =
		totalDblOvertimeHoursWorked +
		totalOvertimeHoursWorked +
		totalRegHoursWorked +
		totalSickHoursWorked +
		totalStatDayHoursWorked +
		totalStatHours +
		totalVacationHoursWorked;

	const additionalSumHrs =
		additionalPayoutRegHoursWorked +
		additionalPayoutOvertimeHoursWorked +
		additionalPayoutDblOvertimeHoursWorked +
		additionalPayoutStatDayHoursWorked +
		additionalPayoutVacationHoursWorked +
		additionalPayoutStatHoursWorked +
		additionalPayoutSickHoursWorked;

	result.totalPayoutHoursWorked =
		regSumHrs === additionalHoursAllocatedInfo?.totalPayoutHoursWorked
			? regSumHrs
			: regSumHrs + additionalSumHrs;
	aggregatedResult.push(result);
	return aggregatedResult;
};

const calcSuperficialAggregatedHours = async (
	empId,
	companyName,
	payPeriodPayDate,
	result,
	aggregatedResult,
) => {
	const additionalHoursAllocatedInfo = await findAdditionalSuperficialHoursAllocatedInfo({
		empId,
		companyName,
		payPeriodPayDate,
	});

	result.additionalSuperficialRegHoursWorked =
		additionalHoursAllocatedInfo?.additionalSuperficialRegHoursWorked || 0;
	result.additionalSuperficialOvertimeHoursWorked =
		additionalHoursAllocatedInfo?.additionalSuperficialOvertimeHoursWorked || 0;
	result.additionalSuperficialDblOvertimeHoursWorked =
		additionalHoursAllocatedInfo?.additionalSuperficialDblOvertimeHoursWorked || 0;
	result.additionalSuperficialStatHoursWorked =
		additionalHoursAllocatedInfo?.additionalSuperficialStatHoursWorked || 0;
	result.additionalSuperficialStatDayHoursWorked =
		additionalHoursAllocatedInfo?.additionalSuperficialStatDayHoursWorked || 0;
	result.additionalSuperficialSickHoursWorked =
		additionalHoursAllocatedInfo?.additionalSuperficialSickHoursWorked || 0;
	result.additionalSuperficialVacationHoursWorked =
		additionalHoursAllocatedInfo?.additionalSuperficialVacationHoursWorked || 0;

	const {
		additionalSuperficialRegHoursWorked,
		additionalSuperficialOvertimeHoursWorked,
		additionalSuperficialDblOvertimeHoursWorked,
		additionalSuperficialStatHoursWorked,
		additionalSuperficialStatDayHoursWorked,
		additionalSuperficialSickHoursWorked,
		additionalSuperficialVacationHoursWorked,
	} = result;

	const additionalSumHrs =
		additionalSuperficialRegHoursWorked +
		additionalSuperficialOvertimeHoursWorked +
		additionalSuperficialDblOvertimeHoursWorked +
		additionalSuperficialStatHoursWorked +
		additionalSuperficialStatDayHoursWorked +
		additionalSuperficialSickHoursWorked +
		additionalSuperficialVacationHoursWorked;

	result.totalSuperficialHoursWorked = additionalSumHrs;
	aggregatedResult.push(result);
	return aggregatedResult;
};

const buildEmpHourlyDetails = async (empTimesheetData, employee, companyName, isExtraPayRun) => {
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
		totalBereavementHoursWorked,
		totalPersonalDayHoursWorked,
	} = await getGroupedData(empTimesheetData, employee, companyName, isExtraPayRun);
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
		totalBereavementHoursWorked,
		totalPersonalDayHoursWorked,
	};
};

const getGroupedData = async (empTimesheetData, employee, companyName, isExtraPayRun) => {
	const empPayInfoResult = await EmployeePayInfo.findOne({
		empId: employee.empId?._id,
		companyName,
	});
	const isFT = empPayInfoResult?.roles?.[0]?.typeOfEarning === EARNING_TYPE.FT;
	const isPT = empPayInfoResult?.roles?.[0]?.typeOfEarning === EARNING_TYPE.PT;

	const employeeId = empTimesheetData?.empId?.employeeId || employee?.employeeNo;

	const recordId = empTimesheetData?.empId?._id || employee.empId?._id;
	const fullName = empTimesheetData?.empId?.fullName || employee.empId?.fullName;

	const totalRegHoursWorked =
		!isExtraPayRun && isFT
			? empPayInfoResult?.roles?.[0]?.fullTimeStandardHours
			: !isExtraPayRun && isPT
			? empPayInfoResult?.roles?.[0]?.partTimeStandardHours
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
	const totalBereavementHoursWorked = empTimesheetData
		? empTimesheetData.totalBereavementHoursWorked
		: 0;
	const totalPersonalDayHoursWorked = empTimesheetData
		? empTimesheetData.totalPersonalDayHoursWorked
		: 0;
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
		totalBereavementHoursWorked: parseFloat(totalBereavementHoursWorked || 0),
		totalPersonalDayHoursWorked: parseFloat(totalPersonalDayHoursWorked || 0),
	};
};

module.exports = {
	getHourlyAggregatedResult,
};
