import { BsCalendar3 } from "react-icons/bs";
import { FaUserClock } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { ImProfile } from "react-icons/im";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdAttachMoney, MdOutlineAccountBalance } from "react-icons/md";

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
