import { EditIcon } from "@chakra-ui/icons";
import { BsCalendar3 } from "react-icons/bs";
import { LuLayoutDashboard } from "react-icons/lu";

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
        path: "/",
        name: "Insights",
        children: [],
      },
      {
        path: "/",
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
        path: "/",
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
        path: "/",
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
        path: "/",
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
        path: "/",
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
        path: "/",
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
        path: "/",
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
        path: "/",
        name: "Insights",
        children: [],
      },
      {
        path: "/",
        name: "Contacts",
        children: [
          {
            path: "/contacts",
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
        path: "/",
        name: "Calendar",
        children: [
          {
            path: "/calendar",
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
        path: "/",
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
          // {
          //   path: "/pipeline",
          //   name: "Add a Task",
          //   icon: LuLayoutDashboard,
          // },
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
        path: "/",
        name: "Tasks",
        children: [],
      },
      {
        path: "/",
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
        path: "/",
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
        path: "/",
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

export const getTopNavMenu = () => TOP_NAV_MENU_LIST;

export const FORM_FIELD = {
  TEXT: "textField",
  SELECT: "select",
  DATE: "date",
  COUNTRY: "country",
  STATE: "state",
  CITY: "city",
  LINK: "link",
};
