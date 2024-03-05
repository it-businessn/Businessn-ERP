import { EditIcon, EmailIcon } from "@chakra-ui/icons";
import { BsCalendar3, BsChatTextFill, BsListTask } from "react-icons/bs";
import { CiPercent } from "react-icons/ci";
import {
	FaAddressBook,
	FaDashcube,
	FaRProject,
	FaSalesforce,
} from "react-icons/fa";
import { FiTarget } from "react-icons/fi";
import { GiVideoCamera } from "react-icons/gi";
import { HiOutlineCalendar } from "react-icons/hi";
import { IoMdCall } from "react-icons/io";
import {
	IoBagRemoveOutline,
	IoCall,
	IoDocumentTextOutline,
} from "react-icons/io5";
import { LuLayoutDashboard } from "react-icons/lu";
import {
	MdCall,
	MdCleanHands,
	MdContactPage,
	MdOutlineEventNote,
	MdOutlineSettingsApplications,
	MdPayments,
} from "react-icons/md";
import { PiBooks, PiListMagnifyingGlassFill } from "react-icons/pi";
import {
	RiAspectRatioLine,
	RiUserSearchLine,
	RiUserStarLine,
} from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import {
	TbChartDots,
	TbFileInvoice,
	TbShoppingBag,
	TbUsersPlus,
} from "react-icons/tb";

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

export const ACTIVITY_CARDS = [
	{
		color: "#ed6175",
		icon: CiPercent,
		title: "Pending Sales",
		count: 2000,
		action: "Add New Emails",
	},
	{
		color: "#62ad84",
		icon: MdContactPage,
		title: "New Contracts Added",
		count: 2000,
		action: "Add New Contracts",
	},
	{
		color: "purple",
		icon: IoCall,
		title: "Phone Calls Made",
		count: 2000,
		action: "Add New Calls",
	},
	{
		color: "grey",
		icon: GiVideoCamera,
		title: "Meetings",
		count: 2000,
		action: "Add New Meetings",
	},
	{
		color: "grey",
		icon: RiAspectRatioLine,
		title: "Sales Target",
		count: 2000,
		action: "Add New Target",
	},
];

export const callsMadeBarData = [
	{ day: "Mon", call: 10 },
	{ day: "Tue", call: 15 },
	{ day: "Wed", call: 20 },
	{ day: "Thu", call: 25 },
	{ day: "Fri", call: 18 },
	{ day: "Sat", call: 12 },
	{ day: "Sun", call: 8 },
];

const callsBarData = {
	labels: callsMadeBarData.map((item) => item.day),
	datasets: [
		{
			label: "Calls Made",
			data: callsMadeBarData.map((item) => item.call),
			backgroundColor: "#5580f1",
			borderRadius: 12,
			fill: false,
		},
	],
};
const emailsBarData = {
	labels: callsMadeBarData.map((item) => item.day),
	datasets: [
		{
			label: "Emails Sent",
			data: callsMadeBarData.map((item) => item.call),
			backgroundColor: "#61a9c1",
			borderRadius: 12,
		},
	],
};

export const BAR_DATA = [
	{
		title: "Calls Made",
		data: callsBarData,
	},
	{
		title: "Emails Sent",
		data: emailsBarData,
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
export const BUSINESSN_SIDEBAR_MENU = [
	{
		path: "/sales-dashboard",
		name: "Sales",
		id: "sales",
		children: [
			{
				path: "/sales-dashboard",
				name: "Dashboard",
				children: [],
				icon: <RxDashboard />,
			},
			{
				path: "/activities",
				name: "Activities",
				children: [],
				icon: <PiListMagnifyingGlassFill />,
			},
			{
				path: "/calendar",
				name: "Calendar",
				icon: <HiOutlineCalendar />,
				children: [
					// {
					//   path: "/add-event",
					//   name: "Add an Event",
					//   icon: LuLayoutDashboard,
					// },
					// {
					//   path: "/add-task",
					//   name: "Add a Task",
					//   icon: LuLayoutDashboard,
					// },
					// {
					//   path: "/set-alert",
					//   name: "Set a Notification",
					//   icon: LuLayoutDashboard,
					// },
					// {
					//   path: "/view-agenda",
					//   name: "Upcoming",
					//   icon: LuLayoutDashboard,
					// },
					{
						path: "/view-tasks",
						name: "Tasks By Date",
						icon: LuLayoutDashboard,
					},
				],
			},
			{
				path: "/payouts",
				name: "Payouts",
				children: [],
				icon: <MdPayments />,
			},
			{
				path: "/customers",
				name: "Customers",
				icon: <FaAddressBook />,
				children: [
					{
						path: "/view-contacts",
						name: "View Contact",
						icon: EditIcon,
					},
					{
						path: "/add-contact",
						name: "Add a Contact",
						icon: EditIcon,
					},
					{
						path: "/edit-contact",
						name: "Edit a Contact",
						icon: EditIcon,
					},
				],
			},
			{
				path: "/leads",
				name: "Opportunities",
				icon: <TbUsersPlus />,
				children: [],
			},
			{
				path: "/leads-docket",
				name: "Lead Docket",
				children: [],
				icon: <IoDocumentTextOutline />,
			},
			{
				path: "/leads-disburse",
				name: "Lead Disbursement",
				children: [],
				icon: <MdCleanHands />,
			},
			{
				path: "/fresh-leads",
				name: "Fresh Leads",
				children: [],
				icon: <RiUserStarLine />,
			},
			{
				path: "/pipeline",
				name: "Target Leads Pipeline",
				children: [],
				icon: <RiUserSearchLine />,
			},
			{
				path: "/products",
				name: "Products",
				children: [],
				icon: <IoBagRemoveOutline />,
			},
			{
				path: "/orders",
				name: "Orders",
				children: [],
				icon: <TbShoppingBag />,
			},
			{
				path: "/invoice",
				name: "Invoices",
				children: [],
				icon: <TbFileInvoice />,
			},

			// {
			//   path: "/",
			//   name: "Products",
			//   children: [],
			//   icon: <FiShoppingBag />,
			// },
			// {
			//   path: "/",
			//   name: "Orders",
			//   children: [],
			//   icon: <TbShoppingBag />,
			// },

			// {
			//   path: "/",
			//   name: "Payment",
			//   children: [],
			//   icon: <MdOutlinePayment />,
			// },

			// {
			//   path: "/pipeline",
			//   name: "Pipeline",
			//   icon: <MdOutlineWorkspaces />,
			//   children: [
			//     {
			//       path: "/add-opportunity",
			//       name: "Setup New Opportunity",
			//       icon: LuLayoutDashboard,
			//     },
			//     {
			//       path: "/edit-opportunity",
			//       name: "Edit An Opportunity",
			//       icon: LuLayoutDashboard,
			//     },
			//     {
			//       path: "/opportunities",
			//       name: "Stage Lists",
			//       icon: LuLayoutDashboard,
			//     },
			//   ],
			// },
			// {
			//   path: "/tasks",
			//   name: "Activities",
			//   children: [],
			// },
			// {
			//   path: "/quotes",
			//   name: "Orders",
			//   children: [
			//     {
			//       path: "/products",
			//       name: "View Product List",
			//       icon: LuLayoutDashboard,
			//     },
			//     {
			//       path: "/add-quote",
			//       name: "Create Order",
			//       icon: LuLayoutDashboard,
			//     },
			//     {
			//       path: "/proposal",
			//       name: "Request Proposal",
			//       icon: LuLayoutDashboard,
			//     },
			//     {
			//       path: "/setup-org",
			//       name: "Organization Setup",
			//       icon: LuLayoutDashboard,
			//     },
			//   ],
			// },
			{
				path: "/resources",
				name: "Resources",
				icon: <PiBooks />,
				children: [
					{
						path: "/access-learning",
						name: "Access Learning Materials",
						icon: LuLayoutDashboard,
					},
					{
						path: "/access-forms",
						name: "Access Company Forms",
						icon: LuLayoutDashboard,
					},
					{
						path: "/access-scripts",
						name: "Access Scripts",
						icon: LuLayoutDashboard,
					},
					{
						path: "/assess",
						name: "Take Assessment",
						icon: LuLayoutDashboard,
					},
					{
						path: "/internal-contact",
						name: "Internal Contacts",
						icon: BsCalendar3,
					},
				],
			},
			{
				path: "/reports",
				name: "Sales Reports",
				children: [],
				icon: <TbChartDots />,
			},
			{
				path: "/set-up",
				name: "Setup",
				icon: <MdOutlineSettingsApplications />,
				children: [],
			},
			// {
			//   path: "/",
			//   name: "Help",
			//   icon: <IoIosHelpCircleOutline />,
			//   children: [],
			// },
		],
	},
	{
		path: "/payroll-insight",
		name: "Payroll",
		id: "payroll",
		icon: <FaDashcube />,
		children: [
			{
				path: "/payroll-insight",
				name: "Insights",
				children: [],
			},
			{
				path: "/run-payroll",
				name: "Run Payroll",
				children: [
					{
						path: "/generate",
						name: "Generate Payroll",
						icon: LuLayoutDashboard,
					},
					{
						path: "/extra-run",
						name: "Add Extra Payroll Run",
						icon: LuLayoutDashboard,
					},
					{
						path: "/issue",
						name: "Issue Form",
						icon: LuLayoutDashboard,
					},
					{
						path: "/notify",
						name: "Send Notification",
						icon: LuLayoutDashboard,
					},
					{
						path: "/individual-setup",
						name: "Setup Individual",
						icon: LuLayoutDashboard,
					},
					{
						path: "/org-setup",
						name: "Setup Organization",
						icon: LuLayoutDashboard,
					},
					{
						path: "/terminate",
						name: "Terminate Employee",
						icon: LuLayoutDashboard,
					},
				],
			},
			{
				path: "/timekeeping",
				name: "Timekeeping",
				children: [
					{
						path: "/log",
						name: "Log a Timesheet",
						icon: LuLayoutDashboard,
					},
					{
						path: "/review",
						name: "Review Timesheets",
						icon: LuLayoutDashboard,
					},
					{
						path: "/approve",
						name: "Approve Timesheets",
						icon: LuLayoutDashboard,
					},
					{
						path: "/notify",
						name: "Send Notification ",
						icon: LuLayoutDashboard,
					},
					{
						path: "/variance",
						name: "Analyze Variances",
						icon: LuLayoutDashboard,
					},
				],
			},
			{
				path: "/scheduling",
				name: "Scheduling",
				children: [
					{
						path: "/generate",
						name: "Generate Ongoing Schedule",
						icon: LuLayoutDashboard,
					},
					{
						path: "/setup",
						name: "Setup New Schedule",
						icon: LuLayoutDashboard,
					},
					{
						path: "/notify",
						name: "Send Notification",
						icon: LuLayoutDashboard,
					},
					{
						path: "/org-setup",
						name: "Setup Organization",
						icon: LuLayoutDashboard,
					},
					{
						path: "/individual-setup",
						name: "Setup Individual",
						icon: LuLayoutDashboard,
					},
				],
			},
			{
				path: "/attendance",
				name: "Attendance",
				children: [
					{
						path: "/leave-request",
						name: "Request Leave",
						icon: LuLayoutDashboard,
					},
					{
						path: "/approve",
						name: "Approve Leave",
						icon: LuLayoutDashboard,
					},
					{
						path: "/log",
						name: "Log Form",
						icon: LuLayoutDashboard,
					},
					{
						path: "/view-record",
						name: "View Employee Records",
						icon: LuLayoutDashboard,
					},
					{
						path: "/view-balance",
						name: "View Employee Balances",
						icon: LuLayoutDashboard,
					},
				],
			},
			{
				path: "/reimburse",
				name: "Reimbursements",
				children: [
					{
						path: "/initiate-expense",
						name: "Initiate Expense Reimbursement",
						icon: LuLayoutDashboard,
					},
					{
						path: "/approve-expense",
						name: "Approve Expense Reimbursement",
						icon: LuLayoutDashboard,
					},
					{
						path: "/reimburse-cash",
						name: "Initiate Petty Cash Reimbursement",
						icon: LuLayoutDashboard,
					},
					{
						path: "/approve-cash",
						name: "Approve Petty Cash Reimbursement",
						icon: LuLayoutDashboard,
					},
				],
			},
			{
				path: "/maintain",
				name: "Maintenance",
				children: [
					{
						path: "/add-individual",
						name: "Add Individual",
						icon: LuLayoutDashboard,
					},
					{
						path: "/edit",
						name: "Edit Individual",
						icon: LuLayoutDashboard,
					},
					{
						path: "/setup-org",
						name: "Setup Organization",
						icon: LuLayoutDashboard,
					},
					{
						path: "/setup-admin",
						name: "Setup Administrator",
						icon: LuLayoutDashboard,
					},
				],
			},
			// {
			//   path: "/report",
			//   name: "Reports",
			//   children: [
			//     {
			//       path: "/payroll",
			//       name: "Payroll Reports",
			//       icon: LuLayoutDashboard,
			//     },
			//     {
			//       path: "/employee",
			//       name: "Employee Reports",
			//       icon: LuLayoutDashboard,
			//     },
			//     {
			//       path: "/org",
			//       name: "Organizational Reports",
			//       icon: LuLayoutDashboard,
			//     },
			//     {
			//       path: "/journal",
			//       name: "Journal Entry",
			//       icon: LuLayoutDashboard,
			//     },
			//     {
			//       path: "/analytics",
			//       name: "Analytics Reports",
			//       icon: LuLayoutDashboard,
			//     },
			//   ],
			// },
		],
	},
	{
		path: "/project-dashboard",
		name: "Project",
		id: "project",
		icon: <FaRProject />,
		children: [
			{
				path: "/project-dashboard",
				name: "Dashboard",
				children: [],
			},
			{
				path: "/workbench-insight",
				name: "Workbench",
				children: [],
			},
		],
	},
];
export const FD_SIDEBAR_MENU = [
	{
		path: "/sales-dashboard",
		name: "Sales",
		id: "sales",
		children: [
			{
				path: "/sales-dashboard",
				name: "Dashboard",
				children: [],
				icon: <RxDashboard />,
			},
			{
				path: "/activities",
				name: "Activities",
				children: [],
				icon: <PiListMagnifyingGlassFill />,
			},
			{
				path: "/calendar",
				name: "Calendar",
				icon: <HiOutlineCalendar />,
				children: [
					// {
					//   path: "/add-event",
					//   name: "Add an Event",
					//   icon: LuLayoutDashboard,
					// },
					// {
					//   path: "/add-task",
					//   name: "Add a Task",
					//   icon: LuLayoutDashboard,
					// },
					// {
					//   path: "/set-alert",
					//   name: "Set a Notification",
					//   icon: LuLayoutDashboard,
					// },
					// {
					//   path: "/view-agenda",
					//   name: "Upcoming",
					//   icon: LuLayoutDashboard,
					// },
					{
						path: "/view-tasks",
						name: "Tasks By Date",
						icon: LuLayoutDashboard,
					},
				],
			},
			{
				path: "/payouts",
				name: "Payouts",
				children: [],
				icon: <MdPayments />,
			},
			{
				path: "/customers",
				name: "Customers",
				icon: <FaAddressBook />,
				children: [
					{
						path: "/view-contacts",
						name: "View Contact",
						icon: EditIcon,
					},
					{
						path: "/add-contact",
						name: "Add a Contact",
						icon: EditIcon,
					},
					{
						path: "/edit-contact",
						name: "Edit a Contact",
						icon: EditIcon,
					},
				],
			},
			{
				path: "/leads",
				name: "Opportunities",
				icon: <TbUsersPlus />,
				children: [],
			},
			{
				path: "/leads-docket",
				name: "Lead Docket",
				children: [],
				icon: <IoDocumentTextOutline />,
			},
			{
				path: "/leads-disburse",
				name: "Lead Disbursement",
				children: [],
				icon: <MdCleanHands />,
			},
			{
				path: "/fresh-leads",
				name: "Fresh Leads",
				children: [],
				icon: <RiUserStarLine />,
			},
			{
				path: "/pipeline",
				name: "Target Leads Pipeline",
				children: [],
				icon: <RiUserSearchLine />,
			},
			{
				path: "/products",
				name: "Products",
				children: [],
				icon: <IoBagRemoveOutline />,
			},
			{
				path: "/orders",
				name: "Orders",
				children: [],
				icon: <TbShoppingBag />,
			},
			{
				path: "/invoice",
				name: "Invoices",
				children: [],
				icon: <TbFileInvoice />,
			},

			// {
			//   path: "/",
			//   name: "Products",
			//   children: [],
			//   icon: <FiShoppingBag />,
			// },
			// {
			//   path: "/",
			//   name: "Orders",
			//   children: [],
			//   icon: <TbShoppingBag />,
			// },

			// {
			//   path: "/",
			//   name: "Payment",
			//   children: [],
			//   icon: <MdOutlinePayment />,
			// },

			// {
			//   path: "/pipeline",
			//   name: "Pipeline",
			//   icon: <MdOutlineWorkspaces />,
			//   children: [
			//     {
			//       path: "/add-opportunity",
			//       name: "Setup New Opportunity",
			//       icon: LuLayoutDashboard,
			//     },
			//     {
			//       path: "/edit-opportunity",
			//       name: "Edit An Opportunity",
			//       icon: LuLayoutDashboard,
			//     },
			//     {
			//       path: "/opportunities",
			//       name: "Stage Lists",
			//       icon: LuLayoutDashboard,
			//     },
			//   ],
			// },
			// {
			//   path: "/tasks",
			//   name: "Activities",
			//   children: [],
			// },
			// {
			//   path: "/quotes",
			//   name: "Orders",
			//   children: [
			//     {
			//       path: "/products",
			//       name: "View Product List",
			//       icon: LuLayoutDashboard,
			//     },
			//     {
			//       path: "/add-quote",
			//       name: "Create Order",
			//       icon: LuLayoutDashboard,
			//     },
			//     {
			//       path: "/proposal",
			//       name: "Request Proposal",
			//       icon: LuLayoutDashboard,
			//     },
			//     {
			//       path: "/setup-org",
			//       name: "Organization Setup",
			//       icon: LuLayoutDashboard,
			//     },
			//   ],
			// },
			{
				path: "/resources",
				name: "Resources",
				icon: <PiBooks />,
				children: [
					{
						path: "/access-learning",
						name: "Access Learning Materials",
						icon: LuLayoutDashboard,
					},
					{
						path: "/access-forms",
						name: "Access Company Forms",
						icon: LuLayoutDashboard,
					},
					{
						path: "/access-scripts",
						name: "Access Scripts",
						icon: LuLayoutDashboard,
					},
					{
						path: "/assess",
						name: "Take Assessment",
						icon: LuLayoutDashboard,
					},
					{
						path: "/internal-contact",
						name: "Internal Contacts",
						icon: BsCalendar3,
					},
				],
			},
			{
				path: "/reports",
				name: "Sales Reports",
				children: [],
				icon: <TbChartDots />,
			},
			{
				path: "/set-up",
				name: "Setup",
				icon: <MdOutlineSettingsApplications />,
				children: [],
			},
			// {
			//   path: "/",
			//   name: "Help",
			//   icon: <IoIosHelpCircleOutline />,
			//   children: [],
			// },
		],
	},
	{
		path: "/payroll",
		name: "Payroll",
		id: "payroll",
		icon: <FaDashcube />,
		children: [
			{
				path: "/payroll-insight",
				name: "Insights",
				children: [],
			},
			{
				path: "/run-payroll",
				name: "Run Payroll",
				children: [
					{
						path: "/generate",
						name: "Generate Payroll",
						icon: LuLayoutDashboard,
					},
					{
						path: "/extra-run",
						name: "Add Extra Payroll Run",
						icon: LuLayoutDashboard,
					},
					{
						path: "/issue",
						name: "Issue Form",
						icon: LuLayoutDashboard,
					},
					{
						path: "/notify",
						name: "Send Notification",
						icon: LuLayoutDashboard,
					},
					{
						path: "/individual-setup",
						name: "Setup Individual",
						icon: LuLayoutDashboard,
					},
					{
						path: "/org-setup",
						name: "Setup Organization",
						icon: LuLayoutDashboard,
					},
					{
						path: "/terminate",
						name: "Terminate Employee",
						icon: LuLayoutDashboard,
					},
				],
			},
			{
				path: "/timekeeping",
				name: "Timekeeping",
				children: [
					{
						path: "/log",
						name: "Log a Timesheet",
						icon: LuLayoutDashboard,
					},
					{
						path: "/review",
						name: "Review Timesheets",
						icon: LuLayoutDashboard,
					},
					{
						path: "/approve",
						name: "Approve Timesheets",
						icon: LuLayoutDashboard,
					},
					{
						path: "/notify",
						name: "Send Notification ",
						icon: LuLayoutDashboard,
					},
					{
						path: "/variance",
						name: "Analyze Variances",
						icon: LuLayoutDashboard,
					},
				],
			},
			{
				path: "/scheduling",
				name: "Scheduling",
				children: [
					{
						path: "/generate",
						name: "Generate Ongoing Schedule",
						icon: LuLayoutDashboard,
					},
					{
						path: "/setup",
						name: "Setup New Schedule",
						icon: LuLayoutDashboard,
					},
					{
						path: "/notify",
						name: "Send Notification",
						icon: LuLayoutDashboard,
					},
					{
						path: "/org-setup",
						name: "Setup Organization",
						icon: LuLayoutDashboard,
					},
					{
						path: "/individual-setup",
						name: "Setup Individual",
						icon: LuLayoutDashboard,
					},
				],
			},
			{
				path: "/attendance",
				name: "Attendance",
				children: [
					{
						path: "/leave-request",
						name: "Request Leave",
						icon: LuLayoutDashboard,
					},
					{
						path: "/approve",
						name: "Approve Leave",
						icon: LuLayoutDashboard,
					},
					{
						path: "/log",
						name: "Log Form",
						icon: LuLayoutDashboard,
					},
					{
						path: "/view-record",
						name: "View Employee Records",
						icon: LuLayoutDashboard,
					},
					{
						path: "/view-balance",
						name: "View Employee Balances",
						icon: LuLayoutDashboard,
					},
				],
			},
			{
				path: "/reimburse",
				name: "Reimbursements",
				children: [
					{
						path: "/initiate-expense",
						name: "Initiate Expense Reimbursement",
						icon: LuLayoutDashboard,
					},
					{
						path: "/approve-expense",
						name: "Approve Expense Reimbursement",
						icon: LuLayoutDashboard,
					},
					{
						path: "/reimburse-cash",
						name: "Initiate Petty Cash Reimbursement",
						icon: LuLayoutDashboard,
					},
					{
						path: "/approve-cash",
						name: "Approve Petty Cash Reimbursement",
						icon: LuLayoutDashboard,
					},
				],
			},
			{
				path: "/maintain",
				name: "Maintenance",
				children: [
					{
						path: "/add-individual",
						name: "Add Individual",
						icon: LuLayoutDashboard,
					},
					{
						path: "/edit",
						name: "Edit Individual",
						icon: LuLayoutDashboard,
					},
					{
						path: "/setup-org",
						name: "Setup Organization",
						icon: LuLayoutDashboard,
					},
					{
						path: "/setup-admin",
						name: "Setup Administrator",
						icon: LuLayoutDashboard,
					},
				],
			},
			// {
			//   path: "/report",
			//   name: "Reports",
			//   children: [
			//     {
			//       path: "/payroll",
			//       name: "Payroll Reports",
			//       icon: LuLayoutDashboard,
			//     },
			//     {
			//       path: "/employee",
			//       name: "Employee Reports",
			//       icon: LuLayoutDashboard,
			//     },
			//     {
			//       path: "/org",
			//       name: "Organizational Reports",
			//       icon: LuLayoutDashboard,
			//     },
			//     {
			//       path: "/journal",
			//       name: "Journal Entry",
			//       icon: LuLayoutDashboard,
			//     },
			//     {
			//       path: "/analytics",
			//       name: "Analytics Reports",
			//       icon: LuLayoutDashboard,
			//     },
			//   ],
			// },
		],
	},
];

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

export const trainingChartData = {
	labels: ["Completed", "Ongoing"],
	datasets: [
		{
			data: [65, 10],
			backgroundColor: ["#517ae8", "#8aa8ee"],
			hoverBackgroundColor: ["#517ae8", "#8aa8ee"],
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
		meetingDate: "01/01/2023",
		duration: { hours: 1, minutes: 30 },
		status: "completed",
	},
	{
		profilePic: "url-to-profile-pic-1",
		customerName: "John Doe",
		meetingDate: "01/01/2023",
		duration: { hours: 1, minutes: 30 },
		status: "completed",
	},
	{
		profilePic: "url-to-profile-pic-1",
		customerName: "John Doe",
		meetingDate: "01/01/2023",
		duration: { hours: 1, minutes: 30 },
		status: "completed",
	},
	{
		profilePic: "url-to-profile-pic-1",
		customerName: "John Doe",
		meetingDate: "01/01/2023",
		duration: { hours: 1, minutes: 30 },
		status: "completed",
	},
];
