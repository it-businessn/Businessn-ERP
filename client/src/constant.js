import { EmailIcon } from "@chakra-ui/icons";
import { BsChatTextFill, BsListTask } from "react-icons/bs";
import { FaSalesforce } from "react-icons/fa";
import { FiTarget } from "react-icons/fi";
import { IoMdCall } from "react-icons/io";
import { MdCall, MdOutlineEventNote } from "react-icons/md";

export const ROLES = {
	SHADOW_ADMIN: "Shadow Admin",
	AUTH_ADMINISTRATOR: "Authorizing Admin",
	ADMINISTRATOR: "Administrator",
	MANAGER: "Manager",
	EMPLOYEE: "Employee",
	ENROLLER: "Enroller",
};

export const ALERTS_TYPE = { BANK: "bank", SIN: "SIN", WAGE: "wage" };
export const EMAIL_TYPE = { LOGIN_CREDENTIAL: "CREDS", PAYSTUB: "Paystub" };

export const COMPANIES = {
	FD: "Fractional Departments Inc.",
	NW: "The Owners Of Strata Plan NW1378",
	BUSINESSN_ORG: "BusinessN Corporate",
	CORNERSTONE: "Cornerstone Maintenance Group Ltd.",
};

export const PAY_FREQUENCIES = [
	{ name: "Daily" },
	{ name: "Weekly" },
	{ name: "Biweekly" },
	{ name: "Semimonthly" },
	{ name: "Monthly" },
	{ name: "Quarterly" },
	{ name: "Annually" },
];

export const CONTRIBUTION = {
	EI: "Employment Insurance",
	CPP: "Canada Pension Plan",
	HEALTH_PLAN: "Health Plan",
	PENSION_PLAN: "Pension Plan",
	PENSION: "Pension Contribution",
};

export const COLS = {
	EMP_NAME: "Employee Name",
	UNION_DUE: "Union Dues",
	PAYRATE: "Payrate",
};

export const CATEGORY_LIST = [
	{ category: "Onboarding" },
	{ category: "Development" },
	{ category: "Sales" },
	{ category: "Marketing" },
	{ category: "Service Delivery" },
	{ category: "IT Support" },
	{ category: "Finance" },
	{ category: "Testing" },
	{ category: "Support" },
	{ category: "AI" },
	{ category: "Payroll" },
	{ category: "HR" },
	{ category: "Accounting" },
];

export const TITLE_COLS = [COLS.EMP_NAME, "Total Hours", "Total Amount"];

export const ALIGN_COLS = [
	COLS.UNION_DUE,
	COLS.PAYRATE,
	`${COLS.PAYRATE} 2`,
	`Employer ${CONTRIBUTION.PENSION_PLAN} (EE)`,
	`Employer ${CONTRIBUTION.HEALTH_PLAN} (EE)`,
	`${CONTRIBUTION.EI} (EE)`,
	`${CONTRIBUTION.CPP} (EE)`,
	`ER ${CONTRIBUTION.PENSION_PLAN}`,
	`ER ${CONTRIBUTION.HEALTH_PLAN}`,
	`${CONTRIBUTION.EI} (ER)`,
	`${CONTRIBUTION.CPP} (ER)`,
];

export const TOTAL_AMT_HRS_COLS = [
	"totalAmountAllocated",
	"totalPayoutAmountAllocated",
	"totalManualAmountAllocated",
	"totalSuperficialAmountAllocated",
];

export const HRS_DECIMAL_COLS = [
	"totalHoursWorked",
	"totalSuperficialHoursWorked",
	"totalManualHoursWorked",
	"totalPayoutHoursWorked",
];

export const TOAST = {
	SUCCESS: {
		title: "Data Updated Successfully",
		status: "success",
		isClosable: true,
	},
	ERROR: {
		title: "Sorry! Please try again.",
		status: "error",
		isClosable: true,
	},
};

export const callsMadeBarData = [
	{ day: "Mon", call: 0 },
	{ day: "Tue", call: 0 },
	{ day: "Wed", call: 0 },
	{ day: "Thu", call: 0 },
	{ day: "Fri", call: 0 },
	{ day: "Sat", call: 0 },
	{ day: "Sun", call: 0 },
];
export const emailsMadeBarData = [
	{ day: "Mon", email: 0 },
	{ day: "Tue", email: 0 },
	{ day: "Wed", email: 0 },
	{ day: "Thu", email: 0 },
	{ day: "Fri", email: 0 },
	{ day: "Sat", email: 0 },
	{ day: "Sun", email: 0 },
];
export const BAR_DATA = [
	{
		title: "Calls Made",
		link: "new call",
	},
	{
		title: "Emails Sent",
		link: "new email",
	},
];

export const doughnutOptions = (cutout) => ({
	cutout,
	plugins: {
		datalabels: {
			display: true,
		},
		legend: {
			align: "center",
			position: "bottom",
		},
	},
});

export const barOptions = {
	plugins: {
		legend: {
			align: "center",
			position: "bottom",
		},
	},
};

export const FORM_FIELD = {
	TEXT: "textField",
	SELECT: "select",
	DATE: "date",
	COUNTRY: "country",
	STATE: "state",
	CITY: "city",
	LINK: "link",
};

export const PIPELINE_STAGES = [
	{
		type: "New",
		color: "#64a7dc",
		name: "New",
	},
	{
		type: "Presentation",
		color: "#fdb206",
		name: "Presentation",
	},
	{
		type: "Meeting",
		color: "#fa005a",
		name: "Meeting",
	},
	{
		type: "Negotiating",
		color: "#f88c00",
		name: "Negotiating",
	},
	{
		type: "Won",
		color: "#69cb36",
		name: "Won",
	},
];

export const leaderBoardData = [
	{
		position: 1,
		id: 2223,
		salesperson: "John Doe",
		category: "Electronics",
		calls: 150,
		value: 120,
		profilePic: "url-to-profile-pic-1",
		icon: IoMdCall,
	},
	{
		position: 2,
		id: 4544,
		salesperson: "Jane Smith",
		category: "Clothing",
		calls: 120,
		value: 100,
		profilePic: "url-to-profile-pic-1",
		icon: EmailIcon,
	},
	{
		position: 3,
		id: 4534,
		salesperson: "Bob Johnson",
		category: "Appliances",
		calls: 100,
		value: 90,
		profilePic: "url-to-profile-pic-1",
		icon: FiTarget,
	},
	{
		position: 4,
		id: 6767,
		salesperson: "Bob Johnson",
		category: "Appliances",
		calls: 100,
		value: 90,
		profilePic: "url-to-profile-pic-1",
		icon: FaSalesforce,
	},
	{
		position: 1,
		id: 2223,
		salesperson: "John Doe",
		category: "Electronics",
		calls: 150,
		value: 120,
		profilePic: "url-to-profile-pic-1",
		icon: IoMdCall,
	},
	{
		position: 2,
		id: 4544,
		salesperson: "Jane Smith",
		category: "Clothing",
		calls: 120,
		value: 100,
		profilePic: "url-to-profile-pic-1",
		icon: EmailIcon,
	},
	{
		position: 3,
		id: 4534,
		salesperson: "Bob Johnson",
		category: "Appliances",
		calls: 100,
		value: 90,
		profilePic: "url-to-profile-pic-1",
		icon: FiTarget,
	},
	{
		position: 4,
		id: 6767,
		salesperson: "Bob Johnson",
		category: "Appliances",
		calls: 100,
		value: 90,
		profilePic: "url-to-profile-pic-1",
		icon: FaSalesforce,
	},
	{
		position: 1,
		id: 2223,
		salesperson: "John Doe",
		category: "Electronics",
		calls: 150,
		value: 120,
		profilePic: "url-to-profile-pic-1",
		icon: IoMdCall,
	},
	{
		position: 2,
		id: 4544,
		salesperson: "Jane Smith",
		category: "Clothing",
		calls: 120,
		value: 100,
		profilePic: "url-to-profile-pic-1",
		icon: EmailIcon,
	},
	{
		position: 3,
		id: 4534,
		salesperson: "Bob Johnson",
		category: "Appliances",
		calls: 100,
		value: 90,
		profilePic: "url-to-profile-pic-1",
		icon: FiTarget,
	},
	{
		position: 4,
		id: 6767,
		salesperson: "Bob Johnson",
		category: "Appliances",
		calls: 100,
		value: 90,
		profilePic: "url-to-profile-pic-1",
		icon: FaSalesforce,
	},
];

export const upcomingTask = [
	{ icon: <MdOutlineEventNote />, title: "4 Tasks", color: "#3498db" },
	{ icon: <BsListTask />, title: "6 Events", color: "#2ecc71" },
	{ icon: <BsChatTextFill />, title: "2 Meetings", color: "#008080" },
	{ icon: <MdCall />, title: "2 Appointments", color: "#008080" },
];

export const activityChartData = {
	labels: ["Calls-75%", "Emails-25%", "Meetings-10%"],
	datasets: [
		{
			data: [65, 25, 10],
			backgroundColor: ["#517ae8", "#67afc8", "#8aa8ee"],
			hoverBackgroundColor: ["#517ae8", "#67afc8", "#8aa8ee"],
		},
	],
};

export const activityData = [
	{ angle: 65, label: "Calls", color: "#3498db" },
	{ angle: 25, label: "Emails", color: "#2ecc71" },
	{ angle: 10, label: "Meetings Done", color: "#008080" },
];

export const meetingsData = [
	{
		profilePic: "url-to-profile-pic-1",
		customerName: "John Doe",
		meetingDate: "01/01/2024",
		duration: { hours: 1, minutes: 30 },
		status: "completed",
	},
	{
		profilePic: "url-to-profile-pic-1",
		customerName: "John Doe",
		meetingDate: "01/01/2024",
		duration: { hours: 1, minutes: 30 },
		status: "completed",
	},
	{
		profilePic: "url-to-profile-pic-1",
		customerName: "John Doe",
		meetingDate: "01/01/2024",
		duration: { hours: 1, minutes: 30 },
		status: "completed",
	},
	{
		profilePic: "url-to-profile-pic-1",
		customerName: "John Doe",
		meetingDate: "01/01/2024",
		duration: { hours: 1, minutes: 30 },
		status: "completed",
	},
];

export const PAYRUN_TYPE_CODE = { REGULAR: "1", PAYOUT: "2", MANUAL: "3", SUPERFICIAL: "4" };

export const PAYRUN_TYPE = [
	{ name: "Regular", code: PAYRUN_TYPE_CODE.REGULAR },
	{ name: "Paid out", code: PAYRUN_TYPE_CODE.PAYOUT },
	{ name: "Manual Cheque", code: PAYRUN_TYPE_CODE.MANUAL },
	{ name: "Superficial Balance", code: PAYRUN_TYPE_CODE.SUPERFICIAL },
];

export const getReportName = (type) =>
	PAYRUN_TYPE.find((_) => _.code === type)?.name || PAYRUN_TYPE[0].name;

export const PAYRUN_OPTIONS = [
	{
		name: "Payrun Details",
		code: 1,
		highlightColor: "#537eee",
		info: "Adjustments made here will be included in this pay run.",
	},
	{
		name: "Payrun Details - Separate Cheque",
		code: 2,
		highlightColor: "#7713c9",
		info: "Adjustments made here will be included in this pay run but will appear on a separate cheque.",
	},
	{
		name: "Payrun Details - Separate Cheque No Payout",
		code: 3,
		highlightColor: "#326274",
		info: "Adjustments made here will not be paid out.",
	},
	{
		name: "Payrun Details - Balances",
		code: 4,
		highlightColor: "#b47318",
		info: "Adjustments made here will update the pay stub internally without reporting to the CRA.",
	},
];
