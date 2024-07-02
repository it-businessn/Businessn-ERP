import { EditIcon } from "@chakra-ui/icons";
import { BiNotepad, BiTask } from "react-icons/bi";
import { BsCalendar3 } from "react-icons/bs";
import { CiViewTimeline } from "react-icons/ci";
import { FaAddressBook, FaDashcube, FaRProject } from "react-icons/fa";
import {
	FaCalendar,
	FaChartGantt,
	FaPeopleArrows,
	FaPeopleGroup,
	FaUsersGear,
	FaUsersRectangle,
} from "react-icons/fa6";
import { FiSettings } from "react-icons/fi";
import { GoTasklist } from "react-icons/go";
import { HiOutlineBadgeCheck, HiOutlineCalendar } from "react-icons/hi";
import { IoBagRemoveOutline, IoDocumentTextOutline } from "react-icons/io5";
import { LuLayoutDashboard } from "react-icons/lu";
import {
	MdCleanHands,
	MdOutlineSettingsApplications,
	MdPayments,
} from "react-icons/md";
import { PiBooks, PiListMagnifyingGlassFill } from "react-icons/pi";
import { RiUserSearchLine, RiUserStarLine } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import { TbChartDots, TbShoppingBag, TbUsersPlus } from "react-icons/tb";

// export const BUSINESSN_SIDEBAR_MENU = [
// 	{
// 		path: "/sales-dashboard",
// 		name: "Sales",
// 		id: "sales",
// 		children: [
// 			{
// 				path: "/sales-dashboard",
// 				name: "Dashboard",
// 				children: [],
// 				icon: <RxDashboard />,
// 			},
// 			{
// 				path: "/activities",
// 				name: "Activities",
// 				children: [],
// 				icon: <PiListMagnifyingGlassFill />,
// 			},
// 			{
// 				path: "/calendar",
// 				name: "Calendar",
// 				icon: <HiOutlineCalendar />,
// 				children: [
// 					// {
// 					//   path: "/add-event",
// 					//   name: "Add an Event",
// 					//   icon: LuLayoutDashboard,
// 					// },
// 					// {
// 					//   path: "/add-task",
// 					//   name: "Add a Task",
// 					//   icon: LuLayoutDashboard,
// 					// },
// 					// {
// 					//   path: "/set-alert",
// 					//   name: "Set a Notification",
// 					//   icon: LuLayoutDashboard,
// 					// },
// 					// {
// 					//   path: "/view-agenda",
// 					//   name: "Upcoming",
// 					//   icon: LuLayoutDashboard,
// 					// },
// 					{
// 						path: "/view-tasks",
// 						name: "Tasks By Date",
// 						icon: LuLayoutDashboard,
// 					},
// 				],
// 			},
// 			{
// 				path: "/payouts",
// 				name: "Payouts",
// 				children: [],
// 				icon: <MdPayments />,
// 			},
// 			{
// 				path: "/customers",
// 				name: "Customers",
// 				icon: <FaAddressBook />,
// 				children: [
// 					{
// 						path: "/view-contacts",
// 						name: "View Contact",
// 						icon: EditIcon,
// 					},
// 					{
// 						path: "/add-contact",
// 						name: "Add a Contact",
// 						icon: EditIcon,
// 					},
// 					{
// 						path: "/edit-contact",
// 						name: "Edit a Contact",
// 						icon: EditIcon,
// 					},
// 				],
// 			},
// 			{
// 				path: "/leads",
// 				name: "Opportunities",
// 				icon: <TbUsersPlus />,
// 				children: [],
// 			},
// 			{
// 				path: "/leads-docket",
// 				name: "Lead Docket",
// 				children: [],
// 				icon: <IoDocumentTextOutline />,
// 			},
// 			{
// 				path: "/leads-disburse",
// 				name: "Lead Disbursement",
// 				children: [],
// 				icon: <MdCleanHands />,
// 			},
// 			{
// 				path: "/fresh-leads",
// 				name: "Fresh Leads",
// 				children: [],
// 				icon: <RiUserStarLine />,
// 			},
// 			{
// 				path: "/pipeline",
// 				name: "Target Leads Pipeline",
// 				children: [],
// 				icon: <RiUserSearchLine />,
// 			},
// 			{
// 				path: "/products",
// 				name: "Products",
// 				children: [],
// 				icon: <IoBagRemoveOutline />,
// 			},
// 			{
// 				path: "/orders",
// 				name: "Orders",
// 				children: [],
// 				icon: <TbShoppingBag />,
// 			},
// 			{
// 				path: "/invoice",
// 				name: "Invoices",
// 				children: [],
// 				icon: <TbFileInvoice />,
// 			},

// 			// {
// 			//   path: "/",
// 			//   name: "Products",
// 			//   children: [],
// 			//   icon: <FiShoppingBag />,
// 			// },
// 			// {
// 			//   path: "/",
// 			//   name: "Orders",
// 			//   children: [],
// 			//   icon: <TbShoppingBag />,
// 			// },

// 			// {
// 			//   path: "/",
// 			//   name: "Payment",
// 			//   children: [],
// 			//   icon: <MdOutlinePayment />,
// 			// },

// 			// {
// 			//   path: "/pipeline",
// 			//   name: "Pipeline",
// 			//   icon: <MdOutlineWorkspaces />,
// 			//   children: [
// 			//     {
// 			//       path: "/add-opportunity",
// 			//       name: "Setup New Opportunity",
// 			//       icon: LuLayoutDashboard,
// 			//     },
// 			//     {
// 			//       path: "/edit-opportunity",
// 			//       name: "Edit An Opportunity",
// 			//       icon: LuLayoutDashboard,
// 			//     },
// 			//     {
// 			//       path: "/opportunities",
// 			//       name: "Stage Lists",
// 			//       icon: LuLayoutDashboard,
// 			//     },
// 			//   ],
// 			// },
// 			// {
// 			//   path: "/tasks",
// 			//   name: "Activities",
// 			//   children: [],
// 			// },
// 			// {
// 			//   path: "/quotes",
// 			//   name: "Orders",
// 			//   children: [
// 			//     {
// 			//       path: "/products",
// 			//       name: "View Product List",
// 			//       icon: LuLayoutDashboard,
// 			//     },
// 			//     {
// 			//       path: "/add-quote",
// 			//       name: "Create Order",
// 			//       icon: LuLayoutDashboard,
// 			//     },
// 			//     {
// 			//       path: "/proposal",
// 			//       name: "Request Proposal",
// 			//       icon: LuLayoutDashboard,
// 			//     },
// 			//     {
// 			//       path: "/setup-org",
// 			//       name: "Organization Setup",
// 			//       icon: LuLayoutDashboard,
// 			//     },
// 			//   ],
// 			// },
// 			{
// 				path: "/resources",
// 				name: "Resources",
// 				icon: <PiBooks />,
// 				children: [
// 					{
// 						path: "/access-learning",
// 						name: "Access Learning Materials",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/access-forms",
// 						name: "Access Company Forms",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/access-scripts",
// 						name: "Access Scripts",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/assess",
// 						name: "Take Assessment",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/internal-contact",
// 						name: "Internal Contacts",
// 						icon: BsCalendar3,
// 					},
// 				],
// 			},
// 			{
// 				path: "/reports",
// 				name: "Sales Reports",
// 				children: [],
// 				icon: <TbChartDots />,
// 			},
// 			{
// 				path: "/set-up",
// 				name: "Setup",
// 				icon: <MdOutlineSettingsApplications />,
// 				children: [],
// 			},
// 			// {
// 			//   path: "/",
// 			//   name: "Help",
// 			//   icon: <IoIosHelpCircleOutline />,
// 			//   children: [],
// 			// },
// 		],
// 	},
// 	{
// 		path: "/payroll-insight",
// 		name: "Payroll",
// 		id: "payroll",
// 		icon: <FaDashcube />,
// 		children: [
// 			{
// 				path: "/payroll-insight",
// 				name: "Insights",
// 				children: [],
// 			},
// 			{
// 				path: "/run-payroll",
// 				name: "Run Payroll",
// 				children: [
// 					{
// 						path: "/generate",
// 						name: "Generate Payroll",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/extra-run",
// 						name: "Add Extra Payroll Run",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/issue",
// 						name: "Issue Form",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/notify",
// 						name: "Send Notification",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/individual-setup",
// 						name: "Setup Individual",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/org-setup",
// 						name: "Setup Organization",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/terminate",
// 						name: "Terminate Employee",
// 						icon: LuLayoutDashboard,
// 					},
// 				],
// 			},
// 			{
// 				path: "/timekeeping",
// 				name: "Timekeeping",
// 				children: [
// 					{
// 						path: "/log",
// 						name: "Log a Timesheet",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/review",
// 						name: "Review Timesheets",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/approve",
// 						name: "Approve Timesheets",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/notify",
// 						name: "Send Notification ",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/variance",
// 						name: "Analyze Variances",
// 						icon: LuLayoutDashboard,
// 					},
// 				],
// 			},
// 			{
// 				path: "/scheduling",
// 				name: "Scheduling",
// 				children: [
// 					{
// 						path: "/generate",
// 						name: "Generate Ongoing Schedule",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/setup",
// 						name: "Setup New Schedule",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/notify",
// 						name: "Send Notification",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/org-setup",
// 						name: "Setup Organization",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/individual-setup",
// 						name: "Setup Individual",
// 						icon: LuLayoutDashboard,
// 					},
// 				],
// 			},
// 			{
// 				path: "/attendance",
// 				name: "Attendance",
// 				children: [
// 					{
// 						path: "/leave-request",
// 						name: "Request Leave",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/approve",
// 						name: "Approve Leave",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/log",
// 						name: "Log Form",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/view-record",
// 						name: "View Employee Records",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/view-balance",
// 						name: "View Employee Balances",
// 						icon: LuLayoutDashboard,
// 					},
// 				],
// 			},
// 			{
// 				path: "/reimburse",
// 				name: "Reimbursements",
// 				children: [
// 					{
// 						path: "/initiate-expense",
// 						name: "Initiate Expense Reimbursement",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/approve-expense",
// 						name: "Approve Expense Reimbursement",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/reimburse-cash",
// 						name: "Initiate Petty Cash Reimbursement",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/approve-cash",
// 						name: "Approve Petty Cash Reimbursement",
// 						icon: LuLayoutDashboard,
// 					},
// 				],
// 			},
// 			{
// 				path: "/maintain",
// 				name: "Maintenance",
// 				children: [
// 					{
// 						path: "/add-individual",
// 						name: "Add Individual",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/edit",
// 						name: "Edit Individual",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/setup-org",
// 						name: "Setup Organization",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/setup-admin",
// 						name: "Setup Administrator",
// 						icon: LuLayoutDashboard,
// 					},
// 				],
// 			},
// 			// {
// 			//   path: "/report",
// 			//   name: "Reports",
// 			//   children: [
// 			//     {
// 			//       path: "/payroll",
// 			//       name: "Payroll Reports",
// 			//       icon: LuLayoutDashboard,
// 			//     },
// 			//     {
// 			//       path: "/employee",
// 			//       name: "Employee Reports",
// 			//       icon: LuLayoutDashboard,
// 			//     },
// 			//     {
// 			//       path: "/org",
// 			//       name: "Organizational Reports",
// 			//       icon: LuLayoutDashboard,
// 			//     },
// 			//     {
// 			//       path: "/journal",
// 			//       name: "Journal Entry",
// 			//       icon: LuLayoutDashboard,
// 			//     },
// 			//     {
// 			//       path: "/analytics",
// 			//       name: "Analytics Reports",
// 			//       icon: LuLayoutDashboard,
// 			//     },
// 			//   ],
// 			// },
// 		],
// 	},
// 	{
// 		path: "/project-dashboard",
// 		name: "Project",
// 		id: "project",
// 		icon: <FaRProject />,
// 		children: [
// 			{
// 				path: "/project-dashboard",
// 				name: "Dashboard",
// 				children: [],
// 			},
// 			{
// 				path: "/workview",
// 				name: "Workview",
// 				children: [],
// 			},
// 		],
// 	},
// ];

// export const FD_SIDEBAR_MENU = [
// 	{
// 		path: "/sales-dashboard",
// 		name: "Sales",
// 		id: "sales",
// 		children: [
// 			{
// 				path: "/sales-dashboard",
// 				name: "Dashboard",
// 				children: [],
// 				icon: <RxDashboard />,
// 			},
// 			{
// 				path: "/activities",
// 				name: "Activities",
// 				children: [],
// 				icon: <PiListMagnifyingGlassFill />,
// 			},
// 			{
// 				path: "/calendar",
// 				name: "Calendar",
// 				icon: <HiOutlineCalendar />,
// 				children: [
// 					// {
// 					//   path: "/add-event",
// 					//   name: "Add an Event",
// 					//   icon: LuLayoutDashboard,
// 					// },
// 					// {
// 					//   path: "/add-task",
// 					//   name: "Add a Task",
// 					//   icon: LuLayoutDashboard,
// 					// },
// 					// {
// 					//   path: "/set-alert",
// 					//   name: "Set a Notification",
// 					//   icon: LuLayoutDashboard,
// 					// },
// 					// {
// 					//   path: "/view-agenda",
// 					//   name: "Upcoming",
// 					//   icon: LuLayoutDashboard,
// 					// },
// 					{
// 						path: "/view-tasks",
// 						name: "Tasks By Date",
// 						icon: LuLayoutDashboard,
// 					},
// 				],
// 			},
// 			{
// 				path: "/payouts",
// 				name: "Payouts",
// 				children: [],
// 				icon: <MdPayments />,
// 			},
// 			{
// 				path: "/customers",
// 				name: "Customers",
// 				icon: <FaAddressBook />,
// 				children: [
// 					{
// 						path: "/view-contacts",
// 						name: "View Contact",
// 						icon: EditIcon,
// 					},
// 					{
// 						path: "/add-contact",
// 						name: "Add a Contact",
// 						icon: EditIcon,
// 					},
// 					{
// 						path: "/edit-contact",
// 						name: "Edit a Contact",
// 						icon: EditIcon,
// 					},
// 				],
// 			},
// 			{
// 				path: "/leads",
// 				name: "Opportunities",
// 				icon: <TbUsersPlus />,
// 				children: [],
// 			},
// 			{
// 				path: "/leads-docket",
// 				name: "Lead Docket",
// 				children: [],
// 				icon: <IoDocumentTextOutline />,
// 			},
// 			{
// 				path: "/leads-disburse",
// 				name: "Lead Disbursement",
// 				children: [],
// 				icon: <MdCleanHands />,
// 			},
// 			{
// 				path: "/fresh-leads",
// 				name: "Fresh Leads",
// 				children: [],
// 				icon: <RiUserStarLine />,
// 			},
// 			{
// 				path: "/pipeline",
// 				name: "Target Leads Pipeline",
// 				children: [],
// 				icon: <RiUserSearchLine />,
// 			},
// 			{
// 				path: "/products",
// 				name: "Products",
// 				children: [],
// 				icon: <IoBagRemoveOutline />,
// 			},
// 			{
// 				path: "/orders",
// 				name: "Orders",
// 				children: [],
// 				icon: <TbShoppingBag />,
// 			},
// 			{
// 				path: "/resources",
// 				name: "Resources",
// 				icon: <PiBooks />,
// 				children: [
// 					{
// 						path: "/access-learning",
// 						name: "Access Learning Materials",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/access-forms",
// 						name: "Access Company Forms",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/access-scripts",
// 						name: "Access Scripts",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/assess",
// 						name: "Take Assessment",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/internal-contact",
// 						name: "Internal Contacts",
// 						icon: BsCalendar3,
// 					},
// 				],
// 			},
// 			{
// 				path: "/reports",
// 				name: "Sales Reports",
// 				children: [],
// 				icon: <TbChartDots />,
// 			},
// 			{
// 				path: "/set-up",
// 				name: "Setup",
// 				icon: <MdOutlineSettingsApplications />,
// 				children: [],
// 			},
// 		],
// 	},
// 	{
// 		path: "/payroll",
// 		name: "Payroll",
// 		id: "payroll",
// 		icon: <FaDashcube />,
// 		children: [
// 			{
// 				path: "/payroll-insight",
// 				name: "Insights",
// 				children: [],
// 			},
// 			{
// 				path: "/run-payroll",
// 				name: "Run Payroll",
// 				children: [
// 					{
// 						path: "/generate",
// 						name: "Generate Payroll",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/extra-run",
// 						name: "Add Extra Payroll Run",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/issue",
// 						name: "Issue Form",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/notify",
// 						name: "Send Notification",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/individual-setup",
// 						name: "Setup Individual",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/org-setup",
// 						name: "Setup Organization",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/terminate",
// 						name: "Terminate Employee",
// 						icon: LuLayoutDashboard,
// 					},
// 				],
// 			},
// 			{
// 				path: "/timekeeping",
// 				name: "Timekeeping",
// 				children: [
// 					{
// 						path: "/log",
// 						name: "Log a Timesheet",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/review",
// 						name: "Review Timesheets",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/approve",
// 						name: "Approve Timesheets",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/notify",
// 						name: "Send Notification ",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/variance",
// 						name: "Analyze Variances",
// 						icon: LuLayoutDashboard,
// 					},
// 				],
// 			},
// 			{
// 				path: "/scheduling",
// 				name: "Scheduling",
// 				children: [
// 					{
// 						path: "/generate",
// 						name: "Generate Ongoing Schedule",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/setup",
// 						name: "Setup New Schedule",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/notify",
// 						name: "Send Notification",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/org-setup",
// 						name: "Setup Organization",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/individual-setup",
// 						name: "Setup Individual",
// 						icon: LuLayoutDashboard,
// 					},
// 				],
// 			},
// 			{
// 				path: "/attendance",
// 				name: "Attendance",
// 				children: [
// 					{
// 						path: "/leave-request",
// 						name: "Request Leave",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/approve",
// 						name: "Approve Leave",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/log",
// 						name: "Log Form",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/view-record",
// 						name: "View Employee Records",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/view-balance",
// 						name: "View Employee Balances",
// 						icon: LuLayoutDashboard,
// 					},
// 				],
// 			},
// 			{
// 				path: "/reimburse",
// 				name: "Reimbursements",
// 				children: [
// 					{
// 						path: "/initiate-expense",
// 						name: "Initiate Expense Reimbursement",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/approve-expense",
// 						name: "Approve Expense Reimbursement",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/reimburse-cash",
// 						name: "Initiate Petty Cash Reimbursement",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/approve-cash",
// 						name: "Approve Petty Cash Reimbursement",
// 						icon: LuLayoutDashboard,
// 					},
// 				],
// 			},
// 			{
// 				path: "/maintain",
// 				name: "Maintenance",
// 				children: [
// 					{
// 						path: "/add-individual",
// 						name: "Add Individual",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/edit",
// 						name: "Edit Individual",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/setup-org",
// 						name: "Setup Organization",
// 						icon: LuLayoutDashboard,
// 					},
// 					{
// 						path: "/setup-admin",
// 						name: "Setup Administrator",
// 						icon: LuLayoutDashboard,
// 					},
// 				],
// 			},
// 		],
// 	},
// 	{
// 		path: "/project-dashboard",
// 		name: "Project",
// 		id: "project",
// 		icon: <FaRProject />,
// 		children: [
// 			{
// 				path: "/project-dashboard",
// 				name: "Dashboard",
// 				children: [],
// 			},
// 			{
// 				path: "/workview",
// 				name: "Workview",
// 				children: [],
// 			},
// 		],
// 	},
// ];

export const SIDEBAR_MENU = [
	{
		path: "sales",
		name: "Sales",
		id: "sales",
		children: [
			{
				path: "",
				name: "Dashboard",
				children: [],
				icon: <RxDashboard />,
			},
			{
				path: "activities",
				name: "Activities",
				children: [],
				icon: <PiListMagnifyingGlassFill />,
			},
			{
				path: "calendar",
				name: "Calendar",
				icon: <HiOutlineCalendar />,
				children: [
					{
						path: "/view-tasks",
						name: "Tasks By Date",
						icon: LuLayoutDashboard,
					},
				],
			},
			{
				path: "payouts",
				name: "Payouts",
				children: [],
				icon: <MdPayments />,
			},
			{
				path: "customers",
				name: "Customers",
				icon: <FaAddressBook />,
				children: [
					{
						path: "view-contacts",
						name: "View Contact",
						icon: EditIcon,
					},
					{
						path: "add-contact",
						name: "Add a Contact",
						icon: EditIcon,
					},
					{
						path: "edit-contact",
						name: "Edit a Contact",
						icon: EditIcon,
					},
				],
			},
			{
				path: "leads",
				name: "Opportunities",
				icon: <TbUsersPlus />,
				children: [],
			},
			{
				path: "leads-docket",
				name: "Lead Docket",
				children: [],
				icon: <IoDocumentTextOutline />,
			},
			{
				path: "leads-disburse",
				name: "Lead Disbursement",
				children: [],
				icon: <MdCleanHands />,
			},
			{
				path: "fresh-leads",
				name: "Fresh Leads",
				children: [],
				icon: <RiUserStarLine />,
			},
			{
				path: "pipeline",
				name: "Target Leads Pipeline",
				children: [],
				icon: <RiUserSearchLine />,
			},
			{
				path: "products",
				name: "Products",
				children: [],
				icon: <IoBagRemoveOutline />,
			},
			{
				path: "orders",
				name: "Orders",
				children: [],
				icon: <TbShoppingBag />,
			},
			{
				path: "resources",
				name: "Resources",
				icon: <PiBooks />,
				children: [
					{
						path: "access-learning",
						name: "Access Learning Materials",
						icon: LuLayoutDashboard,
					},
					{
						path: "access-forms",
						name: "Access Company Forms",
						icon: LuLayoutDashboard,
					},
					{
						path: "access-scripts",
						name: "Access Scripts",
						icon: LuLayoutDashboard,
					},
					{
						path: "assess",
						name: "Take Assessment",
						icon: LuLayoutDashboard,
					},
					{
						path: "internal-contact",
						name: "Internal Contacts",
						icon: BsCalendar3,
					},
				],
			},
			{
				path: "reports",
				name: "Sales Reports",
				children: [],
				icon: <TbChartDots />,
			},
			{
				path: "set-up",
				name: "Setup",
				icon: <MdOutlineSettingsApplications />,
				children: [],
			},
		],
	},

	{
		path: "project",
		name: "Project Management",
		id: "project",
		icon: <FaRProject />,
		children: [
			{
				path: "",
				name: "Dashboard",
				children: [],
				icon: <RxDashboard />,
			},
			{
				path: "workview",
				name: "Workview",
				children: [],
				icon: <BiNotepad />,
			},
			{
				path: "comms",
				name: "Communication",
				children: [],
				icon: <FaPeopleArrows />,
			},
			{
				path: "taskboard",
				name: "Taskboard",
				children: [],
				icon: <GoTasklist />,
			},
			{
				path: "agenda",
				name: "Agenda",
				children: [],
				icon: <BiTask />,
			},
			{
				path: "gantt",
				name: "Gantt",
				children: [],
				icon: <FaChartGantt />,
			},
			{
				path: "reports",
				name: "PM Reports",
				children: [],
				icon: <IoDocumentTextOutline />,
			},
			{
				path: "set-up",
				name: "Setup",
				children: [],
				icon: <MdOutlineSettingsApplications />,
			},
		],
	},
	{
		path: "payroll",
		name: "Payroll",
		id: "payroll",
		icon: <FaDashcube />,
		children: [
			{
				path: "",
				name: "Dashboard",
				children: [],
				icon: <RxDashboard />,
			},
			{
				path: "workview",
				name: "Workview",
				children: [],
				icon: <BiNotepad />,
			},
			{
				path: "process",
				name: "Process Payroll",
				children: [],
				icon: <IoDocumentTextOutline />,
			},
			{
				path: "approvals",
				name: "Approvals",
				children: [],
				icon: <HiOutlineBadgeCheck />,
			},
			{
				path: "timesheets",
				name: "Timesheets",
				children: [],
				icon: <CiViewTimeline />,
			},
			{
				path: "employees",
				name: "Employees",
				children: [],
				icon: <FaPeopleGroup />,
			},
			{
				path: "reports",
				name: "Reports",
				children: [],
				icon: <IoDocumentTextOutline />,
			},
			{
				path: "settings",
				name: "Settings",
				children: [],
				icon: <FiSettings />,
			},
			{
				path: "employee-details",
				name: "Employee Dashboard",
				children: [],
				icon: <FaUsersRectangle />,
			},
			{
				path: "emp-records",
				name: "Employee Records",
				children: [],
				icon: <FaUsersGear />,
			},
		],
	},
	{
		path: "scheduling",
		name: "Scheduling",
		id: "scheduling",
		icon: <FaCalendar />,
		children: [
			{
				path: "",
				name: "Dashboard",
				children: [],
				icon: <BiTask />,
			},
			{
				path: "workview",
				name: "Workview",
				children: [],
				icon: <LuLayoutDashboard />,
			},
			{
				path: "reports",
				name: "Scheduling Reports",
				children: [],
				icon: <LuLayoutDashboard />,
			},
			{
				path: "set-up",
				name: "Setup",
				children: [],
				icon: <MdOutlineSettingsApplications />,
			},
			{
				path: "shift-assign",
				name: "Shift Assignment",
				icon: <MdOutlineSettingsApplications />,
			},
		],
	},
	// }
	// {
	// 	path: "/payroll-insight",
	// 	name: "Insights",
	// 	children: [],
	// },
	// 		{
	// 			path: "/run-payroll",
	// 			name: "Run Payroll",
	// 			children: [
	// 				{
	// 					path: "/generate",
	// 					name: "Generate Payroll",
	// 					icon: LuLayoutDashboard,
	// 				},
	// 				{
	// 					path: "/extra-run",
	// 					name: "Add Extra Payroll Run",
	// 					icon: LuLayoutDashboard,
	// 				},
	// 				{
	// 					path: "/issue",
	// 					name: "Issue Form",
	// 					icon: LuLayoutDashboard,
	// 				},
	// 				{
	// 					path: "/notify",
	// 					name: "Send Notification",
	// 					icon: LuLayoutDashboard,
	// 				},
	// 				{
	// 					path: "/individual-setup",
	// 					name: "Setup Individual",
	// 					icon: LuLayoutDashboard,
	// 				},
	// 				{
	// 					path: "/org-setup",
	// 					name: "Setup Organization",
	// 					icon: LuLayoutDashboard,
	// 				},
	// 				{
	// 					path: "/terminate",
	// 					name: "Terminate Employee",
	// 					icon: LuLayoutDashboard,
	// 				},
	// 			],
	// 		},
	// 		{
	// 			path: "/timekeeping",
	// 			name: "Timekeeping",
	// 			children: [
	// 				{
	// 					path: "/log",
	// 					name: "Log a Timesheet",
	// 					icon: LuLayoutDashboard,
	// 				},
	// 				{
	// 					path: "/review",
	// 					name: "Review Timesheets",
	// 					icon: LuLayoutDashboard,
	// 				},
	// 				{
	// 					path: "/approve",
	// 					name: "Approve Timesheets",
	// 					icon: LuLayoutDashboard,
	// 				},
	// 				{
	// 					path: "/notify",
	// 					name: "Send Notification ",
	// 					icon: LuLayoutDashboard,
	// 				},
	// 				{
	// 					path: "/variance",
	// 					name: "Analyze Variances",
	// 					icon: LuLayoutDashboard,
	// 				},
	// 			],
	// 		},
	// 		{
	// 			path: "/scheduling",
	// 			name: "Scheduling",
	// 			children: [
	// 				{
	// 					path: "/generate",
	// 					name: "Generate Ongoing Schedule",
	// 					icon: LuLayoutDashboard,
	// 				},
	// 				{
	// 					path: "/setup",
	// 					name: "Setup New Schedule",
	// 					icon: LuLayoutDashboard,
	// 				},
	// 				{
	// 					path: "/notify",
	// 					name: "Send Notification",
	// 					icon: LuLayoutDashboard,
	// 				},
	// 				{
	// 					path: "/org-setup",
	// 					name: "Setup Organization",
	// 					icon: LuLayoutDashboard,
	// 				},
	// 				{
	// 					path: "/individual-setup",
	// 					name: "Setup Individual",
	// 					icon: LuLayoutDashboard,
	// 				},
	// 			],
	// 		},
	// 		{
	// 			path: "/attendance",
	// 			name: "Attendance",
	// 			children: [
	// 				{
	// 					path: "/leave-request",
	// 					name: "Request Leave",
	// 					icon: LuLayoutDashboard,
	// 				},
	// 				{
	// 					path: "/approve",
	// 					name: "Approve Leave",
	// 					icon: LuLayoutDashboard,
	// 				},
	// 				{
	// 					path: "/log",
	// 					name: "Log Form",
	// 					icon: LuLayoutDashboard,
	// 				},
	// 				{
	// 					path: "/view-record",
	// 					name: "View Employee Records",
	// 					icon: LuLayoutDashboard,
	// 				},
	// 				{
	// 					path: "/view-balance",
	// 					name: "View Employee Balances",
	// 					icon: LuLayoutDashboard,
	// 				},
	// 			],
	// 		},
	// 		{
	// 			path: "/reimburse",
	// 			name: "Reimbursements",
	// 			children: [
	// 				{
	// 					path: "/initiate-expense",
	// 					name: "Initiate Expense Reimbursement",
	// 					icon: LuLayoutDashboard,
	// 				},
	// 				{
	// 					path: "/approve-expense",
	// 					name: "Approve Expense Reimbursement",
	// 					icon: LuLayoutDashboard,
	// 				},
	// 				{
	// 					path: "/reimburse-cash",
	// 					name: "Initiate Petty Cash Reimbursement",
	// 					icon: LuLayoutDashboard,
	// 				},
	// 				{
	// 					path: "/approve-cash",
	// 					name: "Approve Petty Cash Reimbursement",
	// 					icon: LuLayoutDashboard,
	// 				},
	// 			],
	// 		},
	// 		{
	// 			path: "/maintain",
	// 			name: "Maintenance",
	// 			children: [
	// 				{
	// 					path: "/add-individual",
	// 					name: "Add Individual",
	// 					icon: LuLayoutDashboard,
	// 				},
	// 				{
	// 					path: "/edit",
	// 					name: "Edit Individual",
	// 					icon: LuLayoutDashboard,
	// 				},
	// 				{
	// 					path: "/setup-org",
	// 					name: "Setup Organization",
	// 					icon: LuLayoutDashboard,
	// 				},
	// 				{
	// 					path: "/setup-admin",
	// 					name: "Setup Administrator",
	// 					icon: LuLayoutDashboard,
	// 				},
	// 			],
	// 		},
	// 	],
	// },
	// {
	// 	path: "/payroll",
	// 	name: "Accounting",
	// 	id: "accounting",
	// 	icon: <FaDashcube />,
	// 	children: [
	// 		{
	// 			path: "/invoice",
	// 			name: "Invoices",
	// 			children: [],
	// 			icon: <TbFileInvoice />,
	// 		},
	// 	],
	// },
];
