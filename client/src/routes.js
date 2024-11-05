import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import Home from "components/Home";
import Loader from "components/Loader";
import PageNotFound from "./components/PageNotFound";

// login
const ForgotPassword = lazy(() => import("./features/login/ForgotPassword"));
const Login = lazy(() => import("./features/login"));
const Setup = lazy(() => import("./features/setup"));

const SignUp = lazy(() => import("./features/sign-up"));

const UserProfileDetails = lazy(() =>
	import("./features/user/UserProfileDetails"),
);
const VerifyEmail = lazy(() => import("./features/verify-user"));

// sales
const Activities = lazy(() => import("./erp-modules/sales/activities"));
const AddQuestionForm = lazy(() =>
	import("./erp-modules/sales/resources/add-paper/AddQuestionForm"),
);
const Assessment = lazy(() =>
	import("./erp-modules/sales/resources/attempt-test/Assessment"),
);
const Calendar = lazy(() => import("./erp-modules/sales/calendar"));
const Contacts = lazy(() => import("./erp-modules/sales/customers/contacts"));
const CRMDashboard = lazy(() => import("./erp-modules/sales/dashboard"));
const Customers = lazy(() => import("./erp-modules/sales/customers"));
const LeadContacts = lazy(() =>
	import("erp-modules/sales/fresh_leads/LeadContacts"),
);
const FreshLeads = lazy(() => import("./erp-modules/sales/fresh_leads"));
const LeadsDisburse = lazy(() => import("./erp-modules/sales/lead disburse"));
const LeadsDocket = lazy(() => import("./erp-modules/sales/lead docket"));
const Opportunities = lazy(() => import("./erp-modules/sales/opportunities"));
const Orders = lazy(() => import("./erp-modules/sales/orders"));
const Payouts = lazy(() => import("./erp-modules/sales/payouts"));
const Pipeline = lazy(() =>
	import("./erp-modules/sales/target-leads-pipeline"),
);
const Products = lazy(() => import("./erp-modules/sales/products"));
const Resources = lazy(() => import("./erp-modules/sales/resources"));
const SalesReport = lazy(() => import("./erp-modules/sales/reports"));

// payroll
const Approvals = lazy(() => import("./erp-modules/payroll/Approvals"));

const EmployeeDashboard = lazy(() =>
	import("./erp-modules/payroll/employees/dashboard/EmployeeDashboard"),
);
const EmployeeRecord = lazy(() =>
	import("./erp-modules/payroll/employees/dashboard/EmployeeRecord"),
);
const PayrollWorkview = lazy(() => import("./erp-modules/payroll/workview"));
const ProcessPayroll = lazy(() =>
	import("./erp-modules/payroll/process-payroll"),
);
const Reports = lazy(() => import("./erp-modules/payroll/reports"));
const Timesheets = lazy(() => import("./erp-modules/payroll/timesheets"));
const Dashboard = lazy(() => import("erp-modules/payroll/dashboard"));
const Employees = lazy(() => import("erp-modules/payroll/employees/pageview"));
const EmployeeListView = lazy(() =>
	import("erp-modules/payroll/employees/listview"),
);
const Settings = lazy(() => import("erp-modules/payroll/Settings"));

// scheduling
const SchedulingDashboard = lazy(() =>
	import("erp-modules/scheduling/dashboard"),
);
const ScheduleReports = lazy(() => import("./erp-modules/scheduling/Reports"));
const ScheduleWorkView = lazy(() =>
	import("./erp-modules/scheduling/workview"),
);
const ShiftAssignment = lazy(() =>
	import("./erp-modules/scheduling/ShiftAssignment"),
);

// projectmanagement
const Communications = lazy(() =>
	import("./erp-modules/project-management/communication"),
);
const Agenda = lazy(() => import("./erp-modules/project-management/Agenda"));
const PMReports = lazy(() =>
	import("./erp-modules/project-management/Reports"),
);
const Gantt = lazy(() => import("./erp-modules/project-management/Gantt"));
const WorkView = lazy(() =>
	import("./erp-modules/project-management/workview"),
);
const Taskboard = lazy(() =>
	import("./erp-modules/project-management/Taskboard"),
);

export const ROUTE_PATH = {
	// login
	LOGIN: "/login",
	SIGNUP: "/signup",
	VERIFY_EMAIL: "/verify-email",
	FORGOT_PWD: "/forgot-password",

	CUST_PROFILE: "/profile/:id/:comp",
	PROFILE: "/profile",

	// sales
	SALES: "/sales",
	ACTIVITIES: "/activities",
	CALENDAR: "/calendar",
	PAYOUT: "/payouts",
	CUSTOMERS: "/customers",
	LEADS: "/leads",
	DOCKET: "/leads-docket",
	DISBURSE: "/leads-disburse",
	FRESH_LEADS: "/fresh-leads",
	PIPELINE: "/pipeline",
	PRODUCTS: "/products",
	ORDERS: "/orders",
	RESOURCES: "/resources",
	ADD_PAPER: "/add-paper",
	ASSESSMENT: "/assessment/:category",

	// projectmanagement
	PROJECT: "/project",
	WORKVIEW: "/workview",
	COMMS: "/comms",
	TASK_BOARD: "/taskboard",
	AGENDA: "/agenda",
	GANTT: "/gantt",

	// payroll
	PAYROLL: "/payroll",
	PROCESS: "/process",
	APPROVALS: "/approvals",
	TIMESHEETS: "/timesheets",
	EMPLOYEES: "/employees",
	EMP_DASHBOARD: "/employee-details",
	EMP_RECORD: "/emp-records",
	SETTINGS: "/settings",

	// scheduling
	SCHEDULING: "/scheduling",
	SHIFT_ASSIGN: "/shift-assign",

	// setup
	SETUP: ":module/set-up",

	// reports
	REPORT: "/reports",
};

export const workViewPath = `${ROUTE_PATH.PAYROLL}${ROUTE_PATH.WORKVIEW}`;
export const userProfilePath = `${ROUTE_PATH.SALES}${ROUTE_PATH.PROFILE}`;
export const customerPath = `${ROUTE_PATH.SALES}${ROUTE_PATH.CUSTOMERS}`;
export const questionnairePath = `${ROUTE_PATH.SALES}${ROUTE_PATH.ADD_PAPER}`;
export const processPayrollPath = `${ROUTE_PATH.PAYROLL}${ROUTE_PATH.PROCESS}`;
export const timesheetPath = `${ROUTE_PATH.PAYROLL}${ROUTE_PATH.TIMESHEETS}`;
export const payrollEmployeePath = `${ROUTE_PATH.PAYROLL}${ROUTE_PATH.EMPLOYEES}`;
export const payrollReportPath = `${ROUTE_PATH.PAYROLL}${ROUTE_PATH.REPORT}`;

export const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<Suspense fallback={<Loader />}>
				{/* <Suspense fallback={<></>}> */}
				<Home />
			</Suspense>
		),
		children: [
			/* Sales */
			{
				index: true,
				path: ROUTE_PATH.SALES,
				element: <CRMDashboard />,
			},
			{
				path: `${ROUTE_PATH.SALES}${ROUTE_PATH.ACTIVITIES}`,
				element: <Activities />,
			},
			{
				path: `${ROUTE_PATH.SALES}${ROUTE_PATH.CALENDAR}`,
				element: <Calendar />,
			},
			{
				path: `${ROUTE_PATH.SALES}${ROUTE_PATH.CUSTOMERS}${ROUTE_PATH.CUST_PROFILE}`,
				element: <Contacts />,
			},
			{
				path: `${ROUTE_PATH.SALES}${ROUTE_PATH.FRESH_LEADS}${ROUTE_PATH.CUST_PROFILE}`,
				element: <LeadContacts />,
			},
			{
				path: `${ROUTE_PATH.SALES}${ROUTE_PATH.PAYOUT}`,
				element: <Payouts />,
			},
			{
				path: customerPath,
				element: <Customers />,
			},
			{
				path: `${ROUTE_PATH.SALES}${ROUTE_PATH.LEADS}`,
				element: <Opportunities />,
			},
			{
				path: `${ROUTE_PATH.SALES}${ROUTE_PATH.DOCKET}`,
				element: <LeadsDocket />,
			},
			{
				path: `${ROUTE_PATH.SALES}${ROUTE_PATH.DISBURSE}`,
				element: <LeadsDisburse />,
			},
			{
				path: `${ROUTE_PATH.SALES}${ROUTE_PATH.FRESH_LEADS}`,
				element: <FreshLeads />,
			},
			{
				path: `${ROUTE_PATH.SALES}${ROUTE_PATH.PIPELINE}`,
				element: <Pipeline />,
			},
			{
				path: `${ROUTE_PATH.SALES}${ROUTE_PATH.PRODUCTS}`,
				element: <Products />,
			},
			{
				path: `${ROUTE_PATH.SALES}${ROUTE_PATH.ORDERS}`,
				element: <Orders />,
			},
			{
				path: `${ROUTE_PATH.SALES}${ROUTE_PATH.RESOURCES}`,
				element: <Resources />,
			},
			{
				path: questionnairePath,
				element: <AddQuestionForm />,
			},
			{
				path: `${questionnairePath}/:type`,
				element: <AddQuestionForm />,
			},
			{
				path: `${ROUTE_PATH.SALES}${ROUTE_PATH.ASSESSMENT}`,
				element: <Assessment />,
			},
			{
				path: `${ROUTE_PATH.SALES}${ROUTE_PATH.REPORT}`,
				element: <SalesReport />,
			},
			{
				path: userProfilePath,
				element: <UserProfileDetails />,
			},
			// {
			// 	path: "/invoice",
			// 	element: <Invoice />,
			// },

			/* Project Management*/
			{
				path: ROUTE_PATH.PROJECT,
				// element: <ProjectDashboard />,
				element: <WorkView />,
			},
			{
				path: `${ROUTE_PATH.PROJECT}${ROUTE_PATH.WORKVIEW}`,
				element: <WorkView />,
			},
			{
				path: `${ROUTE_PATH.PROJECT}${ROUTE_PATH.COMMS}`,
				element: <Communications />,
			},
			{
				path: `${ROUTE_PATH.PROJECT}${ROUTE_PATH.TASK_BOARD}`,
				element: <Taskboard />,
			},
			{
				path: `${ROUTE_PATH.PROJECT}${ROUTE_PATH.AGENDA}`,
				element: <Agenda />,
			},
			{
				path: `${ROUTE_PATH.PROJECT}${ROUTE_PATH.GANTT}`,
				element: <Gantt />,
			},
			{
				path: `${ROUTE_PATH.PROJECT}${ROUTE_PATH.REPORT}`,
				element: <PMReports />,
			},

			/* Payroll */
			{
				path: ROUTE_PATH.PAYROLL,
				element: <Dashboard />,
			},
			{
				path: workViewPath,
				element: <PayrollWorkview />,
			},
			{
				path: processPayrollPath,
				element: <ProcessPayroll />,
			},
			{
				path: `${processPayrollPath}/:payNo`,
				element: <ProcessPayroll />,
			},
			{
				path: `${ROUTE_PATH.PAYROLL}${ROUTE_PATH.APPROVALS}`,
				element: <Approvals />,
			},
			{
				path: timesheetPath,
				element: <Timesheets />,
			},
			{
				path: `${timesheetPath}/:id`,
				element: <Timesheets />,
			},
			{
				path: payrollEmployeePath,
				element: <EmployeeListView />,
			},
			{
				path: `${payrollEmployeePath}/info`,
				element: <Employees />,
			},
			{
				path: `${payrollEmployeePath}/info/:id/:stepNo`,
				element: <Employees />,
			},
			{
				path: payrollReportPath,
				element: <Reports />,
			},
			{
				path: `${ROUTE_PATH.PAYROLL}${ROUTE_PATH.SETTINGS}`,
				element: <Settings />,
			},
			{
				path: `${ROUTE_PATH.PAYROLL}${ROUTE_PATH.EMP_DASHBOARD}`,
				element: <EmployeeDashboard />,
			},
			{
				path: `${ROUTE_PATH.PAYROLL}${ROUTE_PATH.EMP_RECORD}`,
				element: <EmployeeRecord />,
			},

			/* Scheduling */
			{
				path: ROUTE_PATH.SCHEDULING,
				element: <SchedulingDashboard />,
			},
			{
				path: `${ROUTE_PATH.SCHEDULING}${ROUTE_PATH.WORKVIEW}`,
				element: <ScheduleWorkView />,
			},
			{
				path: `${ROUTE_PATH.SCHEDULING}${ROUTE_PATH.REPORT}`,
				element: <ScheduleReports />,
			},
			{
				path: `${ROUTE_PATH.SCHEDULING}${ROUTE_PATH.SHIFT_ASSIGN}`,
				element: <ShiftAssignment />,
			},
			{
				path: ROUTE_PATH.SETUP,
				element: <Setup />,
			},
			{
				path: "*",
				element: <PageNotFound />,
			},
		],
	},
	{
		path: ROUTE_PATH.LOGIN,
		element: <Login />,
	},
	{
		path: ROUTE_PATH.FORGOT_PWD,
		element: <ForgotPassword />,
	},
	{
		path: ROUTE_PATH.SIGNUP,
		element: <SignUp />,
	},
	{
		path: ROUTE_PATH.VERIFY_EMAIL,
		element: <VerifyEmail />,
	},
	{
		path: "*",
		element: <PageNotFound />,
	},
]);
