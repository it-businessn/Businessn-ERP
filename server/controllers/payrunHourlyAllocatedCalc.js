const { EARNING_TYPE } = require("../constants/earning.constants");
const EmployeePayInfo = require("../models/EmployeePayInfo");
const { safeNum } = require("../utils/time.util");
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

	result.additionalRegHoursWorked = safeNum(additionalHoursAllocatedInfo?.additionalRegHoursWorked);
	result.additionalRegHoursWorked2 = safeNum(
		additionalHoursAllocatedInfo?.additionalRegHoursWorked2,
	);
	result.additionalOvertimeHoursWorked = safeNum(
		additionalHoursAllocatedInfo?.additionalOvertimeHoursWorked,
	);
	result.additionalDblOvertimeHoursWorked = safeNum(
		additionalHoursAllocatedInfo?.additionalDblOvertimeHoursWorked,
	);
	result.additionalStatHoursWorked = safeNum(
		additionalHoursAllocatedInfo?.additionalStatHoursWorked,
	);
	result.additionalStatDayHoursWorked = safeNum(
		additionalHoursAllocatedInfo?.additionalStatDayHoursWorked,
	);
	result.additionalSickHoursWorked = safeNum(
		additionalHoursAllocatedInfo?.additionalSickHoursWorked,
	);
	result.additionalVacationHoursWorked = safeNum(
		additionalHoursAllocatedInfo?.additionalVacationHoursWorked,
	);

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

	result.additionalManualRegHoursWorked = safeNum(
		additionalHoursAllocatedInfo?.additionalManualRegHoursWorked,
	);
	result.additionalManualOvertimeHoursWorked = safeNum(
		additionalHoursAllocatedInfo?.additionalManualOvertimeHoursWorked,
	);
	result.additionalManualDblOvertimeHoursWorked = safeNum(
		additionalHoursAllocatedInfo?.additionalManualDblOvertimeHoursWorked,
	);
	result.additionalManualStatHoursWorked = safeNum(
		additionalHoursAllocatedInfo?.additionalManualStatHoursWorked,
	);
	result.additionalManualStatDayHoursWorked = safeNum(
		additionalHoursAllocatedInfo?.additionalManualStatDayHoursWorked,
	);
	result.additionalManualSickHoursWorked = safeNum(
		additionalHoursAllocatedInfo?.additionalManualSickHoursWorked,
	);
	result.additionalManualVacationHoursWorked = safeNum(
		additionalHoursAllocatedInfo?.additionalManualVacationHoursWorked,
	);

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

	result.additionalPayoutRegHoursWorked = safeNum(
		additionalHoursAllocatedInfo?.additionalPayoutRegHoursWorked,
	);
	result.additionalPayoutOvertimeHoursWorked = safeNum(
		additionalHoursAllocatedInfo?.additionalPayoutOvertimeHoursWorked,
	);
	result.additionalPayoutDblOvertimeHoursWorked = safeNum(
		additionalHoursAllocatedInfo?.additionalPayoutDblOvertimeHoursWorked,
	);
	result.additionalPayoutStatHoursWorked = safeNum(
		additionalHoursAllocatedInfo?.additionalPayoutStatHoursWorked,
	);
	result.additionalPayoutStatDayHoursWorked = safeNum(
		additionalHoursAllocatedInfo?.additionalPayoutStatDayHoursWorked,
	);
	result.additionalPayoutSickHoursWorked = safeNum(
		additionalHoursAllocatedInfo?.additionalPayoutSickHoursWorked,
	);
	result.additionalPayoutVacationHoursWorked = safeNum(
		additionalHoursAllocatedInfo?.additionalPayoutVacationHoursWorked,
	);

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

	result.additionalSuperficialRegHoursWorked = safeNum(
		additionalHoursAllocatedInfo?.additionalSuperficialRegHoursWorked,
	);
	result.additionalSuperficialOvertimeHoursWorked = safeNum(
		additionalHoursAllocatedInfo?.additionalSuperficialOvertimeHoursWorked,
	);
	result.additionalSuperficialDblOvertimeHoursWorked = safeNum(
		additionalHoursAllocatedInfo?.additionalSuperficialDblOvertimeHoursWorked,
	);
	result.additionalSuperficialStatHoursWorked = safeNum(
		additionalHoursAllocatedInfo?.additionalSuperficialStatHoursWorked,
	);
	result.additionalSuperficialStatDayHoursWorked = safeNum(
		additionalHoursAllocatedInfo?.additionalSuperficialStatDayHoursWorked,
	);
	result.additionalSuperficialSickHoursWorked = safeNum(
		additionalHoursAllocatedInfo?.additionalSuperficialSickHoursWorked,
	);
	result.additionalSuperficialVacationHoursWorked = safeNum(
		additionalHoursAllocatedInfo?.additionalSuperficialVacationHoursWorked,
	);

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
