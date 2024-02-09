import { EditIcon } from "@chakra-ui/icons";
import { BsCalendar3 } from "react-icons/bs";
import { FaDashcube } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";
import { GrResources } from "react-icons/gr";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { LuCalendarDays, LuLayoutDashboard, LuSettings } from "react-icons/lu";
import { MdOutlinePayment, MdOutlineWorkspaces } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { SlPeople } from "react-icons/sl";
import {
  TbFileInvoice,
  TbReportAnalytics,
  TbShoppingBag,
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

export const TOP_NAV_MENU_LIST = [
  // {
  //   path: "/insight",
  //   name: "Insights",
  //   children: [],
  //   id: "insight",
  // },
  // {
  //   path: "/accounting",
  //   name: "Accounting",
  //   children: [],
  //   id: "acc",
  // },
  // {
  //   path: "/inventory",
  //   name: "Inventory",
  //   children: [],
  //   id: "inv",
  // },
  {
    path: "/sales",
    name: "Sales",
    id: "sale",
    children: [
      {
        path: "/sales-insight",
        name: "Dashboard",
        children: [],
        icon: <RxDashboard />,
      },
      {
        path: "/",
        name: "Products",
        children: [],
        icon: <FiShoppingBag />,
      },
      {
        path: "/",
        name: "Orders",
        children: [],
        icon: <TbShoppingBag />,
      },
      {
        path: "/sales",
        name: "Customers",
        icon: <SlPeople />,
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
        path: "/",
        name: "Sales Reports",
        children: [],
        icon: <TbReportAnalytics />,
      },
      {
        path: "/",
        name: "Payment",
        children: [],
        icon: <MdOutlinePayment />,
      },
      {
        path: "/",
        name: "Invoice",
        children: [],
        icon: <TbFileInvoice />,
      },
      {
        path: "/calendar",
        name: "Calendar",
        icon: <LuCalendarDays />,
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
        path: "/pipeline",
        name: "Pipeline",
        icon: <MdOutlineWorkspaces />,
        children: [
          {
            path: "/add-opportunity",
            name: "Setup New Opportunity",
            icon: LuLayoutDashboard,
          },
          {
            path: "/edit-opportunity",
            name: "Edit An Opportunity",
            icon: LuLayoutDashboard,
          },
          {
            path: "/opportunities",
            name: "Stage Lists",
            icon: LuLayoutDashboard,
          },
        ],
      },
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
        path: "/resource",
        name: "Resources",
        icon: <GrResources />,
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
        path: "/",
        name: "Settings",
        icon: <LuSettings />,
        children: [],
      },
      {
        path: "/",
        name: "Help",
        icon: <IoIosHelpCircleOutline />,
        children: [],
      },
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

  // {
  //   path: "/hr",
  //   name: "HR",
  //   id: "hr",
  //   children: [],
  // },
  // {
  //   path: "/marketing",
  //   name: "Marketing",
  //   id: "market",
  //   children: [],
  // },
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
