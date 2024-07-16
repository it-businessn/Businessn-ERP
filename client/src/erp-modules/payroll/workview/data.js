import OutlineButton from "components/ui/button/OutlineButton";
import WorkviewTab from "./WorkviewTab";

export const ROW_DATA = [
	{
		id: 0,
		name: "Juli Khosla",
		num: 654101,
		rate: 49.6,
		dept: "Admin",
		cc: "Corp1",
		regHr: 63,
		overHr: 0,
		statPay: 8,
		vacHr: 0,
		sickPayHours: 6,
		commission: 1000,
		retro: 0,
		reimburse: 455,
		vacPay: 0,
		bonus: 80,
		terminationPayout: 78,
	},
];

export const TABS = [
	{
		id: 0,
		type: "Employee Details",
		name: ROW_DATA && (
			<WorkviewTab
				cols={[
					{ key: "Employee Name", pair: "name" },
					{ key: "Employee Number", pair: "num" },
					{ key: "Payrate", pair: "rate" },
					{ key: "Employee Department", pair: "dept" },
					{ key: "Employee Cost Center", pair: "cc" },
					{ key: "", pair: <OutlineButton label="View Setup" /> },
				]}
				data={ROW_DATA}
				label="Setup"
			/>
		),
	},
	{
		id: 1,
		type: "Hourly Allocation",
		name: (
			<WorkviewTab
				cols={[
					{ key: "Employee Name", pair: "name" },
					{ key: "Regular Hours", pair: "regHr" },
					{ key: "Overtime Hours", pair: "overHr" },
					{ key: "Stat. Pay Hours", pair: "statPay" },
					{ key: "Vacation Hours", pair: "vacHr" },
					{ key: "Sick Pay Hours", pair: "sickPayHours" },
					{ key: "", pair: <OutlineButton label="View Timesheets" /> },
				]}
				data={ROW_DATA}
				label="Setup"
			/>
		),
	},
	{
		id: 2,
		type: "Auxillary Pay",
		name: (
			<WorkviewTab
				cols={[
					{ key: "Employee Name", pair: "name" },
					{ key: "Commission $", pair: "commission" },
					{ key: "Retroactive $", pair: "retro" },
					{ key: "Reimbursement $", pair: "reimburse" },
					{ key: "Vacation Payout $", pair: "vacPay" },
					{ key: "Bonus $", pair: "bonus" },
					{ key: "Termination Payout $", pair: "terminationPayout" },
					{ key: "", pair: <OutlineButton label="View Balances" /> },
				]}
				data={ROW_DATA}
				label="Setup"
			/>
		),
	},
];

export const PAYGROUP_COLS = [
	"Pay number",
	"Submit by",
	"Pay date",
	"Pay period",
	"Status",
	"Action",
];

export const PAYGROUP_ACTIONS = [
	"Issue Roes",
	"Issue Forms",
	"Extra Pay Run",
	"Terminate",
	"Update Employees",
];
