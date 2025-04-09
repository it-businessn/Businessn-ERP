import { BiNotepad, BiTask } from "react-icons/bi";
import { CiViewTimeline } from "react-icons/ci";
import { FaAddressBook, FaDashcube, FaRProject, FaSalesforce } from "react-icons/fa";
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
import { MdCleanHands, MdOutlineSettingsApplications, MdPayments } from "react-icons/md";
import { PiBooks, PiListMagnifyingGlassFill } from "react-icons/pi";
import { RiUserSearchLine, RiUserStarLine } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import { TbChartDots, TbShoppingBag, TbUsersPlus } from "react-icons/tb";

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
					// {
					// 	path: "/view-tasks",
					// 	name: "Tasks By Date",
					// 	icon: <LuLayoutDashboard />,
					// },
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
					// {
					// 	path: "view-contacts",
					// 	name: "View Contact",
					// 	icon: EditIcon,
					// },
					// {
					// 	path: "add-contact",
					// 	name: "Add a Contact",
					// 	icon: EditIcon,
					// },
					// {
					// 	path: "edit-contact",
					// 	name: "Edit a Contact",
					// 	icon: EditIcon,
					// },
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
				path: "onboarding",
				name: "Onboarding",
				children: [],
				icon: <FaUsersGear />,
			},
			{
				path: "products",
				name: "Products",
				children: [],
				icon: <IoBagRemoveOutline />,
			},
			{
				path: "resources",
				name: "Resources",
				icon: <PiBooks />,
				children: [
					// {
					// 	path: "access-learning",
					// 	name: "Access Learning Materials",
					// 	icon: <LuLayoutDashboard />,
					// },
					// {
					// 	path: "access-forms",
					// 	name: "Access Company Forms",
					// 	icon: <LuLayoutDashboard />,
					// },
					// {
					// 	path: "access-scripts",
					// 	name: "Access Scripts",
					// 	icon: <LuLayoutDashboard />,
					// },
					// {
					// 	path: "assess",
					// 	name: "Take Assessment",
					// 	icon: <LuLayoutDashboard />,
					// },
					// {
					// 	path: "internal-contact",
					// 	name: "Internal Contacts",
					// 	icon: <BsCalendar3 />,
					// },
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
				path: "tickets",
				name: "Tickets",
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
				path: "attendance",
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
				icon: <FaPeopleGroup />,
				children: [
					{
						path: "employees",
						name: "List View",
					},
					{
						path: "employees/info",
						name: "Individual View",
					},
				],
			},
			{
				path: "reports",
				name: "Reports",
				icon: <IoDocumentTextOutline />,
				children: [
					{
						path: "reports",
						name: "Payrun Reports",
					},
					{
						path: "reports/detail",
						name: "Individual Reports",
					},
				],
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
			{
				path: "set-up",
				name: "Setup",
				children: [],
				icon: <MdOutlineSettingsApplications />,
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
	{
		path: "hr",
		name: "HR",
		id: "hr",
		icon: <FaCalendar />,
		children: [
			{
				path: "",
				name: "Company",
				children: [],
				icon: <BiTask />,
			},
		],
	},
	{
		path: "operations",
		name: "Operations",
		id: "operations",
		icon: <FaSalesforce />,
		children: [
			{
				path: "",
				name: "Dashboard",
				children: [],
				icon: <BiTask />,
			},
			{
				path: "orders",
				name: "Orders",
				children: [],
				icon: <TbShoppingBag />,
			},
		],
	},

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

export const productsInfo = [
	{
		_id: "ACBKK01",
		name: "Bookkeeping",
		category: "Accounting",
		base_price: "56",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ACBKK02",
		name: "Bookkeeping",
		category: "Accounting",
		base_price: "54",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ACBKK03",
		name: "Bookkeeping",
		category: "Accounting",
		base_price: "52",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ACBKK04",
		name: "Bookkeeping",
		category: "Accounting",
		base_price: "50",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ACBKK05",
		name: "Bookkeeping",
		category: "Accounting",
		base_price: "48",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ACBKK06",
		name: "Bookkeeping",
		category: "Accounting",
		base_price: "46",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ACBKK07",
		name: "Bookkeeping",
		category: "Accounting",
		base_price: "44",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ACBKK08",
		name: "Bookkeeping",
		category: "Accounting",
		base_price: "42",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ACBKK09",
		name: "Bookkeeping",
		category: "Accounting",
		base_price: "30",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ACCOT01",
		name: "Controller",
		category: "Accounting",
		base_price: "75",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ACCOT02",
		name: "Controller",
		category: "Accounting",
		base_price: "75",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ACCOT03",
		name: "Controller",
		category: "Accounting",
		base_price: "75",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ACCOT04",
		name: "Controller",
		category: "Accounting",
		base_price: "75",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ACCOT05",
		name: "Controller",
		category: "Accounting",
		base_price: "75",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ACCOT06",
		name: "Controller",
		category: "Accounting",
		base_price: "75",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ACCOT07",
		name: "Controller",
		category: "Accounting",
		base_price: "75",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ACCOT08",
		name: "Controller",
		category: "Accounting",
		base_price: "75",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ACCOT09",
		name: "Controller",
		category: "Accounting",
		base_price: "75",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ACCFO01",
		name: "CFO",
		category: "Accounting",
		base_price: "200",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ACCFO02",
		name: "CFO",
		category: "Accounting",
		base_price: "200",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ACCFO03",
		name: "CFO",
		category: "Accounting",
		base_price: "200",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ACCFO04",
		name: "CFO",
		category: "Accounting",
		base_price: "200",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ACCFO05",
		name: "CFO",
		category: "Accounting",
		base_price: "200",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ACCFO06",
		name: "CFO",
		category: "Accounting",
		base_price: "200",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ACCFO07",
		name: "CFO",
		category: "Accounting",
		base_price: "200",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ACCFO08",
		name: "CFO",
		category: "Accounting",
		base_price: "200",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ACCFO09",
		name: "CFO",
		category: "Accounting",
		base_price: "200",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITISA01",
		name: "IT Systems Admin",
		category: "IT",
		base_price: "45",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITISA02",
		name: "IT Systems Admin",
		category: "IT",
		base_price: "45",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITISA03",
		name: "IT Systems Admin",
		category: "IT",
		base_price: "45",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITISA04",
		name: "IT Systems Admin",
		category: "IT",
		base_price: "45",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITISA05",
		name: "IT Systems Admin",
		category: "IT",
		base_price: "45",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITISA06",
		name: "IT Systems Admin",
		category: "IT",
		base_price: "45",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITISA07",
		name: "IT Systems Admin",
		category: "IT",
		base_price: "45",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITISA08",
		name: "IT Systems Admin",
		category: "IT",
		base_price: "45",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITISA09",
		name: "IT Systems Admin",
		category: "IT",
		base_price: "45",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITWDV01",
		name: "Web Developer",
		category: "IT",
		base_price: "60",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITWDV02",
		name: "Web Developer",
		category: "IT",
		base_price: "60",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITWDV03",
		name: "Web Developer",
		category: "IT",
		base_price: "60",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITWDV04",
		name: "Web Developer",
		category: "IT",
		base_price: "60",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITWDV05",
		name: "Web Developer",
		category: "IT",
		base_price: "60",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITWDV06",
		name: "Web Developer",
		category: "IT",
		base_price: "60",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITWDV07",
		name: "Web Developer",
		category: "IT",
		base_price: "60",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITWDV08",
		name: "Web Developer",
		category: "IT",
		base_price: "60",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITWDV09",
		name: "Web Developer",
		category: "IT",
		base_price: "60",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITINT01",
		name: "Integrations",
		category: "IT",
		base_price: "70",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITINT02",
		name: "Integrations",
		category: "IT",
		base_price: "70",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITINT03",
		name: "Integrations",
		category: "IT",
		base_price: "70",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITINT04",
		name: "Integrations",
		category: "IT",
		base_price: "70",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITINT05",
		name: "Integrations",
		category: "IT",
		base_price: "70",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITINT06",
		name: "Integrations",
		category: "IT",
		base_price: "70",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITINT07",
		name: "Integrations",
		category: "IT",
		base_price: "70",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITINT08",
		name: "Integrations",
		category: "IT",
		base_price: "70",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITINT09",
		name: "Integrations",
		category: "IT",
		base_price: "70",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITAUT01",
		name: "Automations",
		category: "IT",
		base_price: "80",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITAUT02",
		name: "Automations",
		category: "IT",
		base_price: "80",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITAUT03",
		name: "Automations",
		category: "IT",
		base_price: "80",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITAUT04",
		name: "Automations",
		category: "IT",
		base_price: "80",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITAUT05",
		name: "Automations",
		category: "IT",
		base_price: "80",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITAUT06",
		name: "Automations",
		category: "IT",
		base_price: "80",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITAUT07",
		name: "Automations",
		category: "IT",
		base_price: "80",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITAUT08",
		name: "Automations",
		category: "IT",
		base_price: "80",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "ITAUT09",
		name: "Automations",
		category: "IT",
		base_price: "80",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "AIAXP01",
		name: "AI Expert",
		category: "AI",
		base_price: "80",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "AIAXP02",
		name: "AI Expert",
		category: "AI",
		base_price: "80",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "AIAXP03",
		name: "AI Expert",
		category: "AI",
		base_price: "80",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "AIAXP04",
		name: "AI Expert",
		category: "AI",
		base_price: "80",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "AIAXP05",
		name: "AI Expert",
		category: "AI",
		base_price: "80",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "AIAXP06",
		name: "AI Expert",
		category: "AI",
		base_price: "80",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "AIAXP07",
		name: "AI Expert",
		category: "AI",
		base_price: "80",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "AIAXP08",
		name: "AI Expert",
		category: "AI",
		base_price: "80",
		cost: "29",
		quantity: 2,
	},
	{
		_id: "AIAXP09",
		name: "AI Expert",
		category: "AI",
		base_price: "80",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "AIDSI01",
		name: "Data Scientist",
		category: "AI",
		base_price: "70",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "AIDSI02",
		name: "Data Scientist",
		category: "AI",
		base_price: "70",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "AIDSI03",
		name: "Data Scientist",
		category: "AI",
		base_price: "70",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "AIDSI04",
		name: "Data Scientist",
		category: "AI",
		base_price: "70",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "AIDSI05",
		name: "Data Scientist",
		category: "AI",
		base_price: "70",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "AIDSI06",
		name: "Data Scientist",
		category: "AI",
		base_price: "70",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "AIDSI07",
		name: "Data Scientist",
		category: "AI",
		base_price: "70",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "AIDSI08",
		name: "Data Scientist",
		category: "AI",
		base_price: "70",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "AIDSI09",
		name: "Data Scientist",
		category: "AI",
		base_price: "70",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "MKMTG01",
		name: "Marketing Manager",
		category: "Marketing",
		base_price: "85",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "MKMTG02",
		name: "Marketing Manager",
		category: "Marketing",
		base_price: "85",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "MKMTG03",
		name: "Marketing Manager",
		category: "Marketing",
		base_price: "85",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "MKMTG04",
		name: "Marketing Manager",
		category: "Marketing",
		base_price: "85",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "MKMTG05",
		name: "Marketing Manager",
		category: "Marketing",
		base_price: "85",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "MKMTG06",
		name: "Marketing Manager",
		category: "Marketing",
		base_price: "85",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "MKMTG07",
		name: "Marketing Manager",
		category: "Marketing",
		base_price: "85",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "MKMTG08",
		name: "Marketing Manager",
		category: "Marketing",
		base_price: "85",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "MKMTG09",
		name: "Marketing Manager",
		category: "Marketing",
		base_price: "85",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "MKSMG01",
		name: "Social Media Manager",
		category: "Marketing",
		base_price: "65",
		cost: "65",
		quantity: 1,
	},
	{
		_id: "MKSMG02",
		name: "Social Media Manager",
		category: "Marketing",
		base_price: "65",
		cost: "65",
		quantity: 1,
	},
	{
		_id: "MKSMG03",
		name: "Social Media Manager",
		category: "Marketing",
		base_price: "65",
		cost: "65",
		quantity: 1,
	},
	{
		_id: "MKSMG04",
		name: "Social Media Manager",
		category: "Marketing",
		base_price: "65",
		cost: "65",
		quantity: 1,
	},
	{
		_id: "MKSMG05",
		name: "Social Media Manager",
		category: "Marketing",
		base_price: "65",
		cost: "65",
		quantity: 1,
	},
	{
		_id: "MKSMG06",
		name: "Social Media Manager",
		category: "Marketing",
		base_price: "65",
		cost: "65",
		quantity: 1,
	},
	{
		_id: "MKSMG07",
		name: "Social Media Manager",
		category: "Marketing",
		base_price: "65",
		cost: "65",
		quantity: 1,
	},
	{
		_id: "MKSMG08",
		name: "Social Media Manager",
		category: "Marketing",
		base_price: "65",
		cost: "65",
		quantity: 1,
	},
	{
		_id: "MKSMG09",
		name: "Social Media Manager",
		category: "Marketing",
		base_price: "65",
		cost: "65",
		quantity: 1,
	},
	{
		_id: "MKCST01",
		name: "Content Strategist",
		category: "Marketing",
		base_price: "45",
		cost: "45",
		quantity: 1,
	},
	{
		_id: "MKCST02",
		name: "Content Strategist",
		category: "Marketing",
		base_price: "45",
		cost: "45",
		quantity: 1,
	},
	{
		_id: "MKCST03",
		name: "Content Strategist",
		category: "Marketing",
		base_price: "45",
		cost: "45",
		quantity: 1,
	},
	{
		_id: "MKCST04",
		name: "Content Strategist",
		category: "Marketing",
		base_price: "45",
		cost: "45",
		quantity: 1,
	},
	{
		_id: "MKCST05",
		name: "Content Strategist",
		category: "Marketing",
		base_price: "45",
		cost: "45",
		quantity: 1,
	},
	{
		_id: "MKCST06",
		name: "Content Strategist",
		category: "Marketing",
		base_price: "45",
		cost: "45",
		quantity: 1,
	},
	{
		_id: "MKCST07",
		name: "Content Strategist",
		category: "Marketing",
		base_price: "45",
		cost: "45",
		quantity: 1,
	},
	{
		_id: "MKCST08",
		name: "Content Strategist",
		category: "Marketing",
		base_price: "45",
		cost: "45",
		quantity: 1,
	},
	{
		_id: "MKCST09",
		name: "Content Strategist",
		category: "Marketing",
		base_price: "45",
		cost: "45",
		quantity: 1,
	},
	{
		_id: "PHPYA01",
		name: "Payroll Admin",
		category: "Payroll & HR",
		base_price: "44",
		cost: "44",
		quantity: 1,
	},
	{
		_id: "PHPYA02",
		name: "Payroll Admin",
		category: "Payroll & HR",
		base_price: "44",
		cost: "44",
		quantity: 1,
	},
	{
		_id: "PHPYA03",
		name: "Payroll Admin",
		category: "Payroll & HR",
		base_price: "44",
		cost: "44",
		quantity: 1,
	},
	{
		_id: "PHPYA04",
		name: "Payroll Admin",
		category: "Payroll & HR",
		base_price: "44",
		cost: "44",
		quantity: 1,
	},
	{
		_id: "PHPYA05",
		name: "Payroll Admin",
		category: "Payroll & HR",
		base_price: "44",
		cost: "44",
		quantity: 1,
	},
	{
		_id: "PHPYA06",
		name: "Payroll Admin",
		category: "Payroll & HR",
		base_price: "44",
		cost: "44",
		quantity: 1,
	},
	{
		_id: "PHPYA07",
		name: "Payroll Admin",
		category: "Payroll & HR",
		base_price: "44",
		cost: "44",
		quantity: 1,
	},
	{
		_id: "PHPYA08",
		name: "Payroll Admin",
		category: "Payroll & HR",
		base_price: "44",
		cost: "44",
		quantity: 1,
	},
	{
		_id: "PHPYA09",
		name: "Payroll Admin",
		category: "Payroll & HR",
		base_price: "44",
		cost: "44",
		quantity: 1,
	},
	{
		_id: "PHHRM01",
		name: "HR Manager",
		category: "Payroll & HR",
		base_price: "84",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "PHHRM02",
		name: "HR Manager",
		category: "Payroll & HR",
		base_price: "84",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "PHHRM03",
		name: "HR Manager",
		category: "Payroll & HR",
		base_price: "84",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "PHHRM04",
		name: "HR Manager",
		category: "Payroll & HR",
		base_price: "84",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "PHHRM05",
		name: "HR Manager",
		category: "Payroll & HR",
		base_price: "84",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "PHHRM06",
		name: "HR Manager",
		category: "Payroll & HR",
		base_price: "84",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "PHHRM07",
		name: "HR Manager",
		category: "Payroll & HR",
		base_price: "84",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "PHHRM08",
		name: "HR Manager",
		category: "Payroll & HR",
		base_price: "84",
		cost: "29",
		quantity: 1,
	},
	{
		_id: "PHHRM09",
		name: "HR Manager",
		category: "Payroll & HR",
		base_price: "84",
		cost: "29",
		quantity: 1,
	},
];

export const projectsData = [
	{
		id: 1,
		name: "Project A",
		tasksLeft: 5,
		assignees: [
			{
				id: 1,
				name: "John Doe",
				avatarUrl:
					"https://images.unsplash.com/photo-1484863137850-59afcfe05386?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZnJlZSUyMHBlb3BsZSUyMGF2YXRhciUyMGljb258ZW58MHx8MHx8fDI%3D",
			},
			{
				id: 2,
				name: "Jane Smith",
				avatarUrl:
					"https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZnJlZSUyMHBlb3BsZSUyMGF2YXRhciUyMGljb258ZW58MHx8MHx8fDI%3D",
			},
		],
	},
	{
		id: 2,
		name: "Project B",
		tasksLeft: 8,
		assignees: [
			{
				id: 3,
				name: "Alice Johnson",
				avatarUrl:
					"https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZnJlZSUyMHBlb3BsZSUyMGF2YXRhciUyMGljb258ZW58MHx8MHx8fDI%3D",
			},
			{
				id: 4,
				name: "Bob Wilson",
				avatarUrl:
					"https://images.unsplash.com/photo-1484863137850-59afcfe05386?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZnJlZSUyMHBlb3BsZSUyMGF2YXRhciUyMGljb258ZW58MHx8MHx8fDI%3D",
			},
		],
	},
	{
		id: 3,
		name: "Project C",
		tasksLeft: 3,
		assignees: [
			{
				id: 5,
				name: "Charlie Brown",
				avatarUrl:
					"https://images.unsplash.com/photo-1488751045188-3c55bbf9a3fa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZnJlZSUyMHBlb3BsZSUyMGF2YXRhciUyMGljb258ZW58MHx8MHx8fDI%3D",
			},
			{
				id: 6,
				name: "Diana Miller",
				avatarUrl:
					"https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZnJlZSUyMHBlb3BsZSUyMGF2YXRhciUyMGljb258ZW58MHx8MHx8fDI%3D",
			},
		],
	},
	{
		id: 4,
		name: "Project D",
		tasksLeft: 12,
		assignees: [
			{
				id: 7,
				name: "Eva White",
				avatarUrl:
					"https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGZyZWUlMjBwZW9wbGUlMjBhdmF0YXIlMjBpY29ufGVufDB8fDB8fHwy",
			},
			{
				id: 8,
				name: "Frank Black",
				avatarUrl:
					"https://images.unsplash.com/photo-1463453091185-61582044d556?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGZyZWUlMjBwZW9wbGUlMjBhdmF0YXIlMjBpY29ufGVufDB8fDB8fHwy",
			},
		],
	},
	{
		id: 5,
		name: "Project E",
		tasksLeft: 2,
		assignees: [
			{
				id: 9,
				name: "Grace Turner",
				avatarUrl:
					"https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGZyZWUlMjBwZW9wbGUlMjBhdmF0YXIlMjBpY29ufGVufDB8fDB8fHwy",
			},
			{
				id: 10,
				name: "Harry Green",
				avatarUrl:
					"https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGZyZWUlMjBwZW9wbGUlMjBhdmF0YXIlMjBpY29ufGVufDB8fDB8fHwy",
			},
		],
	},
];

export const tasksData = [
	{
		taskName: "Design Mockup",
		assignees: [
			{
				id: 1,
				name: "John Doe",
				avatarUrl:
					"https://images.unsplash.com/photo-1484863137850-59afcfe05386?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZnJlZSUyMHBlb3BsZSUyMGF2YXRhciUyMGljb258ZW58MHx8MHx8fDI%3D",
			},
		],
		checklist: [
			{
				item: "Create wireframes",
				completed: true,
				assignee: {
					id: 54,
					name: "Jane Smith",
					avatarUrl:
						"https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZnJlZSUyMHBlb3BsZSUyMGF2YXRhciUyMGljb258ZW58MHx8MHx8fDI%3D",
				},
			},
			{
				item: "Gather feedback",
				completed: false,
				assignee: {
					id: 55,
					name: "Jane Smith",
					avatarUrl:
						"https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZnJlZSUyMHBlb3BsZSUyMGF2YXRhciUyMGljb258ZW58MHx8MHx8fDI%3D",
				},
			},
		],
		projectName: "Project A",
		lastUpdated: "2024-03-05",
		taskStatus: "In Progress",
	},
	{
		taskName: "Code Implementation",
		assignees: [
			{
				id: 2,
				name: "Jane Smith",
				avatarUrl:
					"https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZnJlZSUyMHBlb3BsZSUyMGF2YXRhciUyMGljb258ZW58MHx8MHx8fDI%3D",
			},
			{
				id: 23,
				name: "Jane Smiths",
				avatarUrl:
					"https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZnJlZSUyMHBlb3BsZSUyMGF2YXRhciUyMGljb258ZW58MHx8MHx8fDI%3D",
			},
		],
		checklist: [
			{
				item: "Write code",
				completed: true,
				assignee: {
					id: 51,
					name: "Jane Smith",
					avatarUrl:
						"https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZnJlZSUyMHBlb3BsZSUyMGF2YXRhciUyMGljb258ZW58MHx8MHx8fDI%3D",
				},
			},
			{
				item: "Test functionality",
				completed: true,
				assignee: {
					id: 52,
					name: "Jane Smith",
					avatarUrl:
						"https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZnJlZSUyMHBlb3BsZSUyMGF2YXRhciUyMGljb258ZW58MHx8MHx8fDI%3D",
				},
			},
			{
				item: "Document code",
				completed: true,
				assignee: {
					id: 53,
					name: "Jane Smith",
					avatarUrl:
						"https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZnJlZSUyMHBlb3BsZSUyMGF2YXRhciUyMGljb258ZW58MHx8MHx8fDI%3D",
				},
			},
		],
		projectName: "Project B",
		lastUpdated: "2024-03-04",
		taskStatus: "Completed",
	},
	{
		taskName: "Testing",
		assignees: [
			{
				id: 3,
				name: "Jane Smith",
				avatarUrl:
					"https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZnJlZSUyMHBlb3BsZSUyMGF2YXRhciUyMGljb258ZW58MHx8MHx8fDI%3D",
			},
		],
		projectName: "Project C",
		lastUpdated: "2024-03-03",
		taskStatus: "Pending",
	},
	{
		taskName: "Documentation",
		assignees: [
			{
				id: 4,
				name: "Jane Smith",
				avatarUrl:
					"https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZnJlZSUyMHBlb3BsZSUyMGF2YXRhciUyMGljb258ZW58MHx8MHx8fDI%3D",
			},
		],
		projectName: "Project A",
		lastUpdated: "2024-03-02",
		taskStatus: "In Progress",
	},
	{
		taskName: "Bug Fixing",
		assignees: [
			{
				id: 5,
				name: "Jane Smith",
				avatarUrl:
					"https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZnJlZSUyMHBlb3BsZSUyMGF2YXRhciUyMGljb258ZW58MHx8MHx8fDI%3D",
			},
		],
		projectName: "Project B",
		lastUpdated: "2024-03-01",
		taskStatus: "In Progress",
	},
];
