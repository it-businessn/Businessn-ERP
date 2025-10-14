import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import Home from "components/Home";
import Loader from "components/Loader";
import Login from "features/login";
import Support from "features/support";
import AffiliateSignup from "features/support/AffiliateSignup";
import CustomerInfo from "features/support/CustomerInfo";
import PageNotFound from "./components/PageNotFound";

// login
const ForgotPassword = lazy(() => import("./features/login/ForgotPassword"));
const Setup = lazy(() => import("./features/setup"));

const SignUp = lazy(() => import("./features/sign-up"));

const Configuration = lazy(() => import("./features/configuration"));
const UserProfileDetails = lazy(() => import("./features/user/profile/UserProfileDetails"));
const VerifyEmail = lazy(() => import("./features/verify-user"));

// accounting
const AccountingDashboard = lazy(() => import("./erp-modules/accounting"));
const AccountingLedger = lazy(() => import("./erp-modules/accounting/AccountingLedger"));
const AccountingWorkview = lazy(() => import("./erp-modules/accounting/AccountingWorkview"));

// budgeting
const BudgetingDashboard = lazy(() => import("./erp-modules/budgeting"));
const BudgetingWorkview = lazy(() => import("./erp-modules/budgeting/BudgetingWorkview"));
const ChartOfAccounts = lazy(() => import("./erp-modules/budgeting/ChartOfAccounts"));

// hr
const HRDashboard = lazy(() => import("./erp-modules/hr"));

// operations
const Operations = lazy(() => import("./erp-modules/operations"));
const Orders = lazy(() => import("./erp-modules/operations/orders"));

// sales
const Activities = lazy(() => import("./erp-modules/sales/activities"));
const AddQuestionForm = lazy(() =>
	import("./erp-modules/sales/resources/add-paper/AddQuestionForm"),
);
const Assessment = lazy(() => import("./erp-modules/sales/resources/attempt-test/Assessment"));
const Calendar = lazy(() => import("./erp-modules/sales/calendar"));
const Contacts = lazy(() => import("./erp-modules/sales/customers/contacts"));
const CRMDashboard = lazy(() => import("./erp-modules/sales/dashboard"));
const Customers = lazy(() => import("./erp-modules/sales/customers"));
const LeadContacts = lazy(() => import("erp-modules/sales/fresh_leads/LeadContacts"));
const FreshLeads = lazy(() => import("./erp-modules/sales/fresh_leads"));
const LeadsDisburse = lazy(() => import("./erp-modules/sales/lead disburse"));
const LeadsDocket = lazy(() => import("./erp-modules/sales/lead docket"));
const Opportunities = lazy(() => import("./erp-modules/sales/opportunities"));
const Payouts = lazy(() => import("./erp-modules/sales/payouts"));

const Pipeline = lazy(() => import("./erp-modules/sales/target-leads-pipeline"));
const Onboarding = lazy(() => import("./erp-modules/sales/onboarding"));
const Products = lazy(() => import("./erp-modules/sales/products"));
const Resources = lazy(() => import("./erp-modules/sales/resources"));
const SalesReport = lazy(() => import("./erp-modules/sales/reports"));

// payroll
const Attendance = lazy(() => import("./erp-modules/payroll/Attendance"));
const LeaveApprovals = lazy(() => import("./erp-modules/payroll/LeaveApprovals"));
const EmployeeDashboard = lazy(() =>
	import("./erp-modules/payroll/employees/dashboard/EmployeeDashboard"),
);
const EmployeeRecord = lazy(() =>
	import("./erp-modules/payroll/employees/dashboard/EmployeeRecord"),
);
const PayrollWorkview = lazy(() => import("./erp-modules/payroll/workview"));
const ProcessPayroll = lazy(() => import("./erp-modules/payroll/process-payroll"));
const ReportListView = lazy(() =>
	import("./erp-modules/payroll/reports/payrun-reports/ReportListView"),
);
const Reports = lazy(() => import("./erp-modules/payroll/reports/individual"));
const Timesheets = lazy(() => import("./erp-modules/payroll/timesheets"));
const Dashboard = lazy(() => import("erp-modules/payroll/dashboard"));
const Employees = lazy(() => import("erp-modules/payroll/employees/pageview"));
const ROE = lazy(() => import("erp-modules/payroll/roe"));
const AffiliateListView = lazy(() => import("erp-modules/payroll/affiliate/list-view"));
const Affiliates = lazy(() => import("erp-modules/payroll/affiliate/page-view"));
const EmployeeListView = lazy(() => import("erp-modules/payroll/employees/listview"));
const Holiday = lazy(() => import("erp-modules/payroll/holidays/Holiday"));

// scheduling
const SchedulingDashboard = lazy(() => import("erp-modules/scheduling/dashboard"));
const ScheduleReports = lazy(() => import("./erp-modules/scheduling/Reports"));
const ScheduleWorkView = lazy(() => import("./erp-modules/scheduling/workview"));
const Crew = lazy(() => import("./erp-modules/scheduling/crew"));
const LocationSite = lazy(() => import("./erp-modules/scheduling/location-site"));
const ShiftAssignment = lazy(() => import("./erp-modules/scheduling/ShiftAssignment"));

// projectmanagement
const Communications = lazy(() => import("./erp-modules/project-management/communication"));
const Agenda = lazy(() => import("./erp-modules/project-management/Agenda"));
const PMReports = lazy(() => import("./erp-modules/project-management/Reports"));
const Tickets = lazy(() => import("./erp-modules/project-management/tickets"));
const Gantt = lazy(() => import("./erp-modules/project-management/Gantt"));
const WorkView = lazy(() => import("./erp-modules/project-management/workview"));
const Taskboard = lazy(() => import("./erp-modules/project-management/Taskboard"));
const ProjectDashboard = lazy(() => import("erp-modules/project-management/dashboard"));

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
	LEAVE_APPROVALS: "/leave-approvals",
	TIMESHEETS: "/timesheets",
	EMPLOYEES: "/employees",
	AFFILIATE: "/affiliates",
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

	//admin console
	ADMIN_CONSOLE: "/admin-console",
};

export const workViewPath = `${ROUTE_PATH.PAYROLL}${ROUTE_PATH.WORKVIEW}`;
export const userProfilePath = ROUTE_PATH.PROFILE;
export const adminConsolePath = ROUTE_PATH.ADMIN_CONSOLE;
export const customerPath = `${ROUTE_PATH.SALES}${ROUTE_PATH.CUSTOMERS}`;
export const questionnairePath = `${ROUTE_PATH.SALES}${ROUTE_PATH.ADD_PAPER}`;
export const processPayrollPath = `${ROUTE_PATH.PAYROLL}${ROUTE_PATH.PROCESS}`;
export const timesheetPath = `${ROUTE_PATH.PAYROLL}${ROUTE_PATH.TIMESHEETS}`;
export const leaveApprovalPath = `${ROUTE_PATH.PAYROLL}${ROUTE_PATH.LEAVE_APPROVALS}`;
export const payrollEmployeePath = `${ROUTE_PATH.PAYROLL}${ROUTE_PATH.EMPLOYEES}`;
export const payrollAffiliatePath = `${ROUTE_PATH.PAYROLL}${ROUTE_PATH.AFFILIATE}`;
export const payrollROEPath = `${ROUTE_PATH.PAYROLL}/roe`;
export const payrollReportPath = `${ROUTE_PATH.PAYROLL}${ROUTE_PATH.REPORT}`;
export const payrollEmpDashboardPath = `${ROUTE_PATH.PAYROLL}${ROUTE_PATH.EMP_DASHBOARD}`;

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
				path: `${ROUTE_PATH.SALES}/onboarding`,
				element: <Onboarding />,
			},
			{
				path: `${ROUTE_PATH.SALES}${ROUTE_PATH.PRODUCTS}`,
				element: <Products />,
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
				element: <ProjectDashboard />,
			},
			{
				path: `${ROUTE_PATH.PROJECT}/overview`,
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
			{
				path: `${ROUTE_PATH.PROJECT}/tickets`,
				element: <Tickets />,
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
				path: `${processPayrollPath}/:stepNum`,
				element: <ProcessPayroll />,
			},
			{
				path: `${processPayrollPath}/:payNo/:year`,
				element: <ProcessPayroll />,
			},
			{
				path: `${ROUTE_PATH.PAYROLL}/attendance`,
				element: <Attendance />,
			},
			{
				path: leaveApprovalPath,
				element: <LeaveApprovals />,
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
				path: payrollAffiliatePath,
				element: <AffiliateListView />,
			},
			{
				path: `${payrollAffiliatePath}/info`,
				element: <Affiliates />,
			},
			{
				path: `${payrollAffiliatePath}/info/:id/:stepNo`,
				element: <Affiliates />,
			},
			{
				path: payrollROEPath,
				element: <ROE />,
			},
			{
				path: payrollReportPath,
				element: <ReportListView />,
			},
			{
				path: `${payrollReportPath}/:year`,
				element: <ReportListView />,
			},
			{
				path: `${payrollReportPath}/detail`,
				element: <Reports />,
			},
			{
				path: `${ROUTE_PATH.PAYROLL}${ROUTE_PATH.SETTINGS}`,
				element: <Holiday />,
			},
			{
				path: payrollEmpDashboardPath,
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
				path: `${ROUTE_PATH.SCHEDULING}/crew`,
				element: <Crew />,
			},
			{
				path: `${ROUTE_PATH.SCHEDULING}/sites`,
				element: <LocationSite />,
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
				path: ROUTE_PATH.ADMIN_CONSOLE,
				element: <Configuration />,
			},
			{
				path: `/tickets`,
				element: <Tickets />,
			},
			/* HR */
			{
				path: "/hr",
				element: <HRDashboard />,
			},
			{
				path: "/hr/resources",
				element: <Resources isHRType />,
			},
			/* Operations */
			{
				path: "/operations",
				element: <Operations />,
			},
			{
				path: `/operations${ROUTE_PATH.ORDERS}`,
				element: <Orders />,
			},
			/* Accounting */
			{
				path: "/accounting",
				element: <AccountingDashboard />,
			},
			{
				path: `/accounting${ROUTE_PATH.WORKVIEW}`,
				element: <AccountingWorkview />,
			},
			{
				path: `/accounting/ledger`,
				element: <AccountingLedger />,
			},
			{
				path: `/accounting/coa`,
				element: <ChartOfAccounts />,
			},
			/* Budgeting */
			{
				path: "/budgeting",
				element: <BudgetingDashboard />,
			},
			{
				path: `/budgeting${ROUTE_PATH.WORKVIEW}`,
				element: <BudgetingWorkview />,
			},
			{
				path: `/budgeting/coa`,
				element: <ChartOfAccounts />,
			},
		],
	},
	{
		path: ROUTE_PATH.LOGIN,
		element: <Login />,
	},
	{ path: "/support", element: <Support /> },
	// { path: "/info", element: <CustomerInfo /> },
	{
		path: ROUTE_PATH.FORGOT_PWD,
		element: <ForgotPassword />,
	},
	{
		path: ROUTE_PATH.SIGNUP,
		// element: <SignUp />,
		element: <CustomerInfo />,
	},
	{
		path: "/portal/signup",
		// element: <SignUp />,
		element: <AffiliateSignup />,
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
