import { EditIcon } from "@chakra-ui/icons";
import { BsCalendar3 } from "react-icons/bs";
import { FaUserClock } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { ImProfile } from "react-icons/im";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdAttachMoney } from "react-icons/md";

export const ROUTE_PATH = {
  HOME: "/home",
  PROFILE: "/profile",
  USERS: "/users",
  BANK: "/bank-detail",
  PAYSLIP: "/payslip-detail",
  PAYROLL: "/payroll-detail",
  ATTENDANCE: "/attendance-detail",
  LEAVE: "/leave-detail",
  SETTINGS: "/settings",
  PERMISSION: "/permission",
  TAX: "/tax-payable",
};
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
export const getSideMenu = (role) =>
  role === USER_ROLE.EMPLOYEE
    ? MENU_LIST.filter(
        (item) =>
          item.name !== "Employees" &&
          item.name !== "Payroll" &&
          item.name !== "Payslip"
      )
    : MENU_LIST;
export const getTopNavMenu = () => TOP_NAV_MENU_LIST;
export const TOP_NAV_MENU_LIST = [
  {
    path: "/",
    name: "Insights",
    children: [],
    id: "insight",
  },
  {
    path: "/accounting",
    name: "Accounting",
    children: [],
    id: "acc",
  },
  {
    path: "/inventory",
    name: "Inventory",
    children: [],
    id: "inv",
  },
  {
    path: "/payroll",
    name: "Payroll",
    id: "payroll",
    children: [
      {
        path: ROUTE_PATH.PROFILE,
        name: "Insights",
        children: [],
      },
      {
        path: ROUTE_PATH.PROFILE,
        name: "Run Payroll",
        children: [
          {
            path: "/inventory",
            name: "Generate Payroll",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Add Extra Payroll Run",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Issue Form",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Send Notification",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Setup Individual",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Setup Organization",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Terminate Employee",
            icon: LuLayoutDashboard,
          },
        ],
      },
      {
        path: ROUTE_PATH.PROFILE,
        name: "Timekeeping",
        children: [
          {
            path: "/inventory",
            name: "Log a Timesheet",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Review Timesheets",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Approve Timesheets",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Send Notification ",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Analyze Variances",
            icon: LuLayoutDashboard,
          },
        ],
      },
      {
        path: ROUTE_PATH.PROFILE,
        name: "Scheduling",
        children: [
          {
            path: "/inventory",
            name: "Generate Ongoing Schedule",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Setup New Schedule",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Send Notification",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Setup Organization",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Setup Individual",
            icon: LuLayoutDashboard,
          },
        ],
      },
      {
        path: ROUTE_PATH.PROFILE,
        name: "Attendance",
        children: [
          {
            path: "/inventory",
            name: "Request Leave",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Approve Leave",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Log Form",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "View Employee Records",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "View Employee Balances",
            icon: LuLayoutDashboard,
          },
        ],
      },
      {
        path: ROUTE_PATH.PROFILE,
        name: "Reimbursements",
        children: [
          {
            path: "/inventory",
            name: "Initiate Expense Reimbursement",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Approve Expense Reimbursement",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Initiate Petty Cash Reimbursement",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Approve Petty Cash Reimbursement",
            icon: LuLayoutDashboard,
          },
        ],
      },
      {
        path: ROUTE_PATH.PROFILE,
        name: "Maintenance",
        children: [
          {
            path: "/inventory",
            name: "Add Individual",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Edit Individual",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Setup Organization",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Setup Administrator",
            icon: LuLayoutDashboard,
          },
        ],
      },
      {
        path: ROUTE_PATH.PROFILE,
        name: "Reports",
        children: [
          {
            path: "/inventory",
            name: "Payroll Reports",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Employee Reports",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Organizational Reports",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Journal Entry",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Analytics Reports",
            icon: LuLayoutDashboard,
          },
        ],
      },
    ],
  },
  {
    path: "/sales",
    name: "Sales",
    id: "sale",
    children: [
      {
        path: ROUTE_PATH.PROFILE,
        name: "Insights",
        children: [],
      },
      {
        path: ROUTE_PATH.PROFILE,
        name: "Contacts",
        children: [
          {
            path: "/",
            name: "View Contact",
            icon: EditIcon,
          },
          {
            path: "/inventory",
            name: "Add a Contact",
            icon: EditIcon,
          },
          {
            path: "/inventory",
            name: "Edit a Contact",
            icon: EditIcon,
          },
          {
            path: "/inventory",
            name: "Log Activity",
            icon: EditIcon,
          },
        ],
      },
      {
        path: ROUTE_PATH.PROFILE,
        name: "Calendar",
        children: [
          {
            path: "/inventory",
            name: "Add an Event",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Add a Task",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Set a Notification",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "View Itinerary",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "View Task List",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Log an Event",
            icon: LuLayoutDashboard,
          },
        ],
      },
      {
        path: ROUTE_PATH.PROFILE,
        name: "Pipeline",
        children: [
          {
            path: "/pipeline",
            name: "Setup New Opportunity",
            icon: LuLayoutDashboard,
          },
          {
            path: "/pipeline",
            name: "Edit An Opportunity",
            icon: LuLayoutDashboard,
          },
          {
            path: "/pipeline",
            name: "Stage Lists",
            icon: LuLayoutDashboard,
          },
          {
            path: "/pipeline",
            name: "Add a Task",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Setup Organization",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Setup Contact",
            icon: LuLayoutDashboard,
          },
        ],
      },
      {
        path: ROUTE_PATH.PROFILE,
        name: "Tasks",
        children: [],
      },
      {
        path: ROUTE_PATH.PROFILE,
        name: "Quotes",
        children: [
          {
            path: "/inventory",
            name: "View Product List",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "View Price List",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Create Quote	",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Request Proposal",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Organization Setup",
            icon: LuLayoutDashboard,
          },
        ],
      },
      {
        path: ROUTE_PATH.PROFILE,
        name: "Resources",
        children: [
          {
            path: "/inventory",
            name: "Access Learning Materials",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Access Company Forms",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Access Scripts",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Take Assessment",
            icon: LuLayoutDashboard,
          },
          {
            path: "/inventory",
            name: "Internal Contacts",
            icon: BsCalendar3,
          },
        ],
      },
      {
        path: ROUTE_PATH.PROFILE,
        name: "Reports",
        children: [],
      },
    ],
  },
  {
    path: "/hr",
    name: "HR",
    id: "hr",
    children: [],
  },
  {
    path: "/marketing",
    name: "Marketing",
    id: "market",
    children: [],
  },
];
export const MENU_LIST = [
  {
    path: "/",
    name: "Home",
    icon: LuLayoutDashboard,
  },
  {
    path: ROUTE_PATH.PROFILE,
    name: "Profile",
    icon: ImProfile,
  },
  {
    path: ROUTE_PATH.USERS,
    name: "Employees",
    icon: FiUsers,
  },
  // {
  //   path: ROUTE_PATH.BANK,
  //   name: "Bank",
  //   icon: MdOutlineAccountBalance,
  // },
  {
    path: ROUTE_PATH.PAYSLIP,
    name: "Payslip",
    icon: LiaFileInvoiceDollarSolid,
  },
  {
    path: ROUTE_PATH.PAYROLL,
    name: "Payroll",
    icon: MdAttachMoney,
  },
  {
    path: ROUTE_PATH.LEAVE,
    name: "Leave",
    icon: BsCalendar3,
  },
  {
    path: ROUTE_PATH.ATTENDANCE,
    name: "Timesheet",
    icon: FaUserClock,
  },
];

export const USER_ROLE = {
  EMPLOYEE: "Employee",
};
export const BENEFITS = [];
export const DEDUCTIONS = [];
export const USER_PERMISSIONS = [];
export const FORM_FIELD = {
  TEXT: "textField",
  SELECT: "select",
  DATE: "date",
  COUNTRY: "country",
  STATE: "state",
  CITY: "city",
  LINK: "link",
};

export const LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export const notifications = [
  {
    sticky: true,
    severity: "msg",
    detail: "Reminder: You have new update on your leave request",
  },
  {
    sticky: true,
    severity: "msg",
    detail: "Reminder: Meeting tomorrow at 10:00 AM",
  },
  {
    sticky: true,
    severity: "msg",
    detail: "Upcoming Event: Payroll cutoff date on July 15th at 7:00 PM",
  },
  {
    sticky: true,
    severity: "msg",
    detail: "Important Deadline: Project submission due on September 20th",
  },
  {
    sticky: true,
    severity: "msg",
    detail: "Special Event: Company retreat on November 12th-15th",
  },
  {
    sticky: true,
    severity: "msg",
    detail: "Exciting News: New product launch on February 15th",
  },
  {
    sticky: true,
    severity: "msg",
    detail: "Mark your calendar: Holiday party on December 23rd",
  },
];

export const DASHBOARD_CHARTS = [
  {
    type: "Total Salary",
  },
  {
    type: "Payroll Department Summary",
  },
  {
    type: "Employees by Department",
  },
  {
    type: "Employees by Role",
  },
  {
    type: "% of Attendance",
  },
  {
    type: "Employees joined",
  },
  {
    type: "Overtime ratio",
  },
  {
    type: "Used Leaves",
  },
  {
    type: "Total Employees",
  },
  {
    type: "Total Gross Salary",
  },
  {
    type: "Total Payrolls Processed",
  },
  {
    type: "Total Payrolls Expense",
  },
  {
    type: "Total Working Hours",
  },
  {
    type: "Total Overtime Hours",
  },
  {
    type: "Total Deductions",
  },
  {
    type: "Total Net Salary",
  },
];
