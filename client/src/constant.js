import { EmailIcon } from "@chakra-ui/icons";
import { BsChatTextFill, BsListTask } from "react-icons/bs";
import { FaSalesforce } from "react-icons/fa";
import { FiTarget } from "react-icons/fi";
import { IoMdCall } from "react-icons/io";
import { MdCall, MdOutlineEventNote } from "react-icons/md";

export const ROLES = {
	EMPLOYEE: "Employee",
	ADMINISTRATOR: "Administrator",
	MANAGER: "Manager",
	ENROLLER: "Enroller",
};

export const BUSINESSN_ORG = "BusinessN Corporate";
export const BUSINESSN_ORG_ADMIN_EMAILS = [
	"julik@businessn.com",
	"stefan.esterhuysen@businessn.com",
	"davidd@businessn.com",
	"erwan.dantier@businessn.com",
	"azra.demirovic@fractionaldepartments.com",
	"jesse.christiaens@fractionaldepartments.com",
	"it@businessn.com",
	"andrew.dehkurdi@fractionaldepartments.com",
	"daniel.heyns@businessn.com",
	"testuserstaging@test.com",
	"jonas.schumacher@businessn.com",
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

export const RECALL_OPTIONS = [
	{
		name: "Unknown",
	},
	{
		name: "Not Returning",
	},
	{
		name: "Return Date",
	},
];

export const REASON_CODE = [
	{
		name: "AOO - Shortage of Work / End of Contract or Season",
	},
	{
		name: "A01 - Employer bankruptcy or receivership",
	},
	{
		name: "B00 - Strike or Lockout",
	},
	{ name: "D00 - Illness or Injury" },
	{ name: "E00 - Quit" },
	{ name: "E02 - Quit / Follow spouse" },
	{ name: "E03 - Quit / Return to school" },
	{ name: "E04 - Quit / Health reasons" },
	{ name: "E05 - Quit / Voluntary retirement" },
	{ name: "E06 - Quit / Take another job" },
	{ name: "E09 - Quit / Employer relocation" },
	{ name: "E10 - Quit / Care for a dependant" },
	{ name: "E11 - Quit / To become self-employed" },
	{ name: "F00 - Maternity" },
	{ name: "G00 - Mandatory retirement" },
	{ name: "G07 - Retirement / Approved workforce reduction" },
	{ name: "H00 - Work Sharing" },
	{ name: "J00 - Apprentice Training" },
	{ name: "K00 - Other" },
	{ name: "K12 - Other / Change of payroll frequency" },
	{ name: "K13 - Other / Change of ownership" },
	{ name: "K14 - Other / Requested by Employment Insurance" },
	{ name: "K15 - Other / Canadian Forces - Queen's Regulations / Orders" },
	{ name: "K16 - Other / At the employee's request" },
	{ name: "K17 - Other /  Change of Service Provider" },
	{ name: "M00 - Dismissal or suspension" },
	{ name: "M08 - Dismissal / Terminated within probationary period" },
	{ name: "N00 - Leave" },
	{ name: "P00 - Parental Leave" },
	{ name: "Z00 - Compassionate care / Family caregiver" },
];

export const TITLE_COLS = [COLS.EMP_NAME, "Total Hours", "Total Amount"];

export const ALIGN_COLS = [
	COLS.UNION_DUE,
	COLS.PAYRATE,
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

export const isBusinessNAdmin = (email) =>
	BUSINESSN_ORG_ADMIN_EMAILS.find((name) => name === email);

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

export const PAYRUN_TYPE = [
	{ name: "Regular", code: "1" },
	{ name: "Paid out", code: "2" },
	{ name: "Manual Cheque", code: "3" },
	{ name: "Superficial Balance", code: "4" },
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
