import OutlineButton from "components/ui/button/OutlineButton";
import { COLS } from "constant";
import { CiViewTimeline } from "react-icons/ci";

export const REGULAR_HOURLY_ALLOCATE_COLS = [
	{
		key: COLS.EMP_NAME,
		pair: "obj",
		pair_key: "fullName",
		icon: <CiViewTimeline />,
		iconLabel: "View Timesheets",
	},
	{ key: "Total Hours", pair: "totalHoursWorked", isTotal: true, align: "center", nearest: true },
	{ key: "Regular Hrs", pair: "totalRegHoursWorked", align: "center", nearest: true },
	{
		key: "Add Regular",
		pair: "additionalRegHoursWorked",
		isEditable: true,
		nearest: true,
	},
	{ key: "Overtime Hrs", pair: "totalOvertimeHoursWorked", align: "center", nearest: true },
	{
		key: "Add Overtime",
		pair: "additionalOvertimeHoursWorked",
		isEditable: true,
		nearest: true,
	},
	{
		key: "Double OT Hrs",
		pair: "totalDblOvertimeHoursWorked",
		align: "center",
		nearest: true,
	},
	{
		key: "Add Double OT",
		pair: "additionalDblOvertimeHoursWorked",
		isEditable: true,
		nearest: true,
	},
	{ key: "Stat. Pay Hrs", pair: "totalStatHours", align: "center", nearest: true },
	{
		key: "Add Stat. Pay",
		pair: "additionalStatHoursWorked",
		isEditable: true,
		nearest: true,
	},
	{
		key: "Stat. Worked Hrs",
		pair: "totalStatDayHoursWorked",
		align: "center",
		nearest: true,
	},
	{
		key: "Add Stat. Wrked",
		pair: "additionalStatDayHoursWorked",
		isEditable: true,
		nearest: true,
	},
	{ key: "Vacation Hrs", pair: "totalVacationHoursWorked", align: "center", nearest: true },
	{
		key: "Add Vacation",
		pair: "additionalVacationHoursWorked",
		isEditable: true,
		nearest: true,
	},
	{
		key: "Sick Pay Hrs",
		pair: "totalSickHoursWorked",
		align: "center",
		nearest: true,
	},
	{
		key: "Add Sick",
		pair: "additionalSickHoursWorked",
		isEditable: true,
		nearest: true,
	},
	{
		key: "",
		pair: <OutlineButton size="xs" name="setup" label="View Timesheets" mr={3} />,
	},
];

export const PAYOUT_HOURLY_ALLOCATE_COLS = [
	{
		key: COLS.EMP_NAME,
		pair: "obj",
		pair_key: "fullName",
		icon: <CiViewTimeline />,
		iconLabel: "View Timesheets",
	},
	{
		key: "Total Hours",
		pair: "totalPayoutHoursWorked",
		isTotal: true,
		align: "center",
		nearest: true,
	},
	{
		key: "Regular Hrs",
		pair: "totalRegHoursWorked",
		align: "center",
		nearest: true,
	},
	{
		key: "Add Regular",
		pair: "additionalPayoutRegHoursWorked",
		isEditable: true,
		nearest: true,
	},
	{
		key: "Overtime Hrs",
		pair: "totalOvertimeHoursWorked",
		align: "center",
		nearest: true,
	},
	{
		key: "Add Overtime",
		pair: "additionalPayoutOvertimeHoursWorked",
		isEditable: true,
		nearest: true,
	},
	{
		key: "Double OT Hrs",
		pair: "totalDblOvertimeHoursWorked",
		align: "center",
		nearest: true,
	},
	{
		key: "Add Double OT",
		pair: "additionalPayoutDblOvertimeHoursWorked",
		isEditable: true,
		nearest: true,
	},
	{ key: "Stat. Pay Hrs", pair: "totalStatHours", align: "center", nearest: true },
	{
		key: "Add Stat. Pay",
		pair: "additionalPayoutStatHoursWorked",
		isEditable: true,
		nearest: true,
	},
	{
		key: "Stat. Worked Hrs",
		pair: "totalStatDayHoursWorked",
		align: "center",
		nearest: true,
	},
	{
		key: "Add Stat. Wrked",
		pair: "additionalPayoutStatDayHoursWorked",
		isEditable: true,
		nearest: true,
	},
	{
		key: "Vacation Hrs",
		pair: "totalVacationHoursWorked",
		align: "center",
		nearest: true,
	},
	{
		key: "Add Vacation",
		pair: "additionalPayoutVacationHoursWorked",
		isEditable: true,
		nearest: true,
	},
	{
		key: "Sick Pay Hrs",
		pair: "totalSickHoursWorked",
		align: "center",
		nearest: true,
	},
	{
		key: "Add Sick",
		pair: "additionalPayoutSickHoursWorked",
		isEditable: true,
		nearest: true,
	},
	{
		key: "",
		pair: <OutlineButton size="xs" name="setup" label="View Timesheets" mr={3} />,
	},
];

export const MANUAL_PAYOUT_HOURLY_ALLOCATE_COLS = [
	{
		key: COLS.EMP_NAME,
		pair: "obj",
		pair_key: "fullName",
		icon: <CiViewTimeline />,
		iconLabel: "View Timesheets",
	},
	{
		key: "Total Hours",
		pair: "totalManualHoursWorked",
		isTotal: true,
		align: "center",
		nearest: true,
	},
	{
		key: "Regular Hrs",
		pair: "totalRegHoursWorked",
		align: "center",
		nearest: true,
	},
	{
		key: "Add Regular",
		pair: "additionalManualRegHoursWorked",
		isEditable: true,
		nearest: true,
	},
	{
		key: "Overtime Hrs",
		pair: "totalOvertimeHoursWorked",
		align: "center",
		nearest: true,
	},
	{
		key: "Add Overtime",
		pair: "additionalManualOvertimeHoursWorked",
		isEditable: true,
		nearest: true,
	},
	{
		key: "Double OT Hrs",
		pair: "totalDblOvertimeHoursWorked",
		align: "center",
		nearest: true,
	},
	{
		key: "Add Double OT",
		pair: "additionalManualDblOvertimeHoursWorked",
		isEditable: true,
		nearest: true,
	},
	{ key: "Stat. Pay Hrs", pair: "totalStatHours", align: "center", nearest: true },
	{
		key: "Add Stat. Pay",
		pair: "additionalManualStatHoursWorked",
		isEditable: true,
		nearest: true,
	},
	{
		key: "Stat. Worked Hrs",
		pair: "totalStatDayHoursWorked",
		align: "center",
		nearest: true,
	},
	{
		key: "Add Stat. Wrked",
		pair: "additionalManualStatDayHoursWorked",
		isEditable: true,
		nearest: true,
	},
	{
		key: "Vacation Hrs",
		pair: "totalVacationHoursWorked",
		align: "center",
		nearest: true,
	},
	{
		key: "Add Vacation",
		pair: "additionalManualVacationHoursWorked",
		isEditable: true,
		nearest: true,
	},
	{
		key: "Sick Pay Hrs",
		pair: "totalSickHoursWorked",
		align: "center",
		nearest: true,
	},
	{
		key: "Add Sick",
		pair: "additionalManualSickHoursWorked",
		isEditable: true,
		nearest: true,
	},
	{
		key: "",
		pair: <OutlineButton size="xs" name="setup" label="View Timesheets" mr={3} />,
	},
];

export const SUPERFICIAL_HOURLY_ALLOCATE_COLS = [
	{ key: COLS.EMP_NAME, pair: "obj", pair_key: "fullName" },
	{
		key: "Total Hours",
		pair: "totalSuperficialHoursWorked",
		isTotal: true,
		align: "center",
		nearest: true,
	},
	// {
	// 	key: "Regular Hrs",
	// 	pair: "totalRegHoursWorked",
	// 	align: "center",
	// 	nearest: true,
	// },
	{
		key: "Add Regular",
		pair: "additionalSuperficialRegHoursWorked",
		isEditable: true,
		nearest: true,
	},
	// {
	// 	key: "Overtime Hrs",
	// 	pair: "totalOvertimeHoursWorked",
	// 	align: "center",
	// 	nearest: true,
	// },
	{
		key: "Add Overtime",
		pair: "additionalSuperficialOvertimeHoursWorked",
		isEditable: true,
		nearest: true,
	},
	// {
	// 	key: "Double OT Hrs",
	// 	pair: "totalDblOvertimeHoursWorked",
	// 	align: "center",
	// 	nearest: true,
	// },
	{
		key: "Add Double OT",
		pair: "additionalSuperficialDblOvertimeHoursWorked",
		isEditable: true,
		nearest: true,
	},
	// { key: "Stat. Pay Hrs", pair: "totalStatHours", align: "center", nearest: true },
	{
		key: "Add Stat. Pay",
		pair: "additionalSuperficialStatHoursWorked",
		isEditable: true,
		nearest: true,
	},
	// {
	// 	key: "Stat. Worked Hrs",
	// 	pair: "totalStatDayHoursWorked",
	// 	align: "center",
	// 	nearest: true,
	// },
	{
		key: "Add Stat. Wrked",
		pair: "additionalSuperficialStatDayHoursWorked",
		isEditable: true,
		nearest: true,
	},
	// {
	// 	key: "Vacation Hrs",
	// 	pair: "totalVacationHoursWorked",
	// 	align: "center",
	// 	nearest: true,
	// },
	{
		key: "Add Vacation",
		pair: "additionalSuperficialVacationHoursWorked",
		isEditable: true,
		nearest: true,
	},
	// {
	// 	key: "Sick Pay Hrs",
	// 	pair: "totalSickHoursWorked",
	// 	align: "center",
	// 	nearest: true,
	// },
	{
		key: "Add Sick",
		pair: "additionalSuperficialSickHoursWorked",
		isEditable: true,
		nearest: true,
	},
	// {
	// 	key: "",
	// 	pair: <OutlineButton size="xs" name="setup" label="View Timesheets" mr={3} />,
	// },
	{
		key: "er7ss8",
	},

	{
		key: "er56",
	},
	{
		key: "er66",
	},
	{
		key: "er78",
	},
];
