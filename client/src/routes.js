import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import Loader from "./components/Loader";
import PageNotFound from "./features/PageNotFound";
// import AddPayrun from "./features/payroll/AddPayRun";
import Communications from "erp-modules/project-management/communication";
import Contacts from "erp-modules/sales/customers/contacts";
import AddQuestionForm from "erp-modules/sales/resources/add-paper/AddQuestionForm";
import Assessment from "erp-modules/sales/resources/attempt-test/Assessment";
import ScheduleWorkView from "erp-modules/scheduling/workview";
import RootLayout from "./layouts/RootLayout";

// const PayrollTable = lazy(() => import("./features/payroll"));
// const GeneratePayRun = lazy(() => import("./features/payroll/GeneratePayRun"));
const UserProfileDetails = lazy(() =>
	import("./features/user1/UserProfileDetails"),
);
const AddOpportunity = lazy(() =>
	import("./erp-modules/sales/target-leads-pipeline/AddOpportunity"),
);
const TaskByDate = lazy(() =>
	import("./erp-modules/sales/calendar/TaskByDate"),
);

// const Contacts = lazy(() => import("./features/sales/contacts"));

const TaskDashboard = lazy(() => import("./features/sales/tasks"));
const AddContact = lazy(() => import("./features/sales/contacts/AddContact"));
const EditContact = lazy(() => import("./features/sales/contacts/EditContact"));

const EditOpportunity = lazy(() =>
	import("./erp-modules/sales/target-leads-pipeline/EditOpportunity"),
);
const OpportunitiesList = lazy(() =>
	import("./erp-modules/sales/target-leads-pipeline/OpportunitiesList"),
);

const EditUser = lazy(() => import("./features/user/profile/EditUser"));
const ForgotPassword = lazy(() => import("./features/login/ForgotPassword"));
const Login = lazy(() => import("./features/login"));
const SignUp = lazy(() => import("./features/sign-up"));
const VerifyEmail = lazy(() => import("./features/verify-user"));

const CRMDashboard = lazy(() => import("./erp-modules/sales/dashboard"));
const Activities = lazy(() => import("./erp-modules/sales/activities"));
const Calendar = lazy(() => import("./erp-modules/sales/calendar"));
const Payouts = lazy(() => import("./erp-modules/sales/payouts"));
const Customers = lazy(() => import("./erp-modules/sales/customers"));

const Opportunities = lazy(() => import("./erp-modules/sales/opportunities"));
const LeadsDocket = lazy(() => import("./erp-modules/sales/lead docket"));
const LeadsDisburse = lazy(() => import("./erp-modules/sales/lead disburse"));
const FreshLeads = lazy(() => import("./erp-modules/sales/fresh_leads"));
const Pipeline = lazy(() =>
	import("./erp-modules/sales/target-leads-pipeline"),
);

const Products = lazy(() => import("./erp-modules/sales/products"));
const Orders = lazy(() => import("./erp-modules/sales/orders"));
const Invoice = lazy(() => import("./erp-modules/sales/invoice"));

const Resources = lazy(() => import("./erp-modules/sales/resources"));
const SalesReport = lazy(() => import("./erp-modules/sales/reports"));
const Setup = lazy(() => import("./features/setup"));

const ProjectDashboard = lazy(() =>
	import("./erp-modules/project-management/dashboard"),
);
const WorkView = lazy(() =>
	import("./erp-modules/project-management/workview"),
);

const Employees = lazy(() => import("./erp-modules/payroll/employees"));

export const ROUTE_PATH = {
	ACTIVITIES: "/activities",
	ADD_PAPER: "/add-paper",
	ASSESSMENT: "/assessment/:category",
	CALENDAR: "/calendar",
	COMMS: "/comms",
	CUST_PROFILE: "/profile/:id",
	CUSTOMERS: "/customers",
	DISBURSE: "/leads-disburse",
	DOCKET: "/leads-docket",
	FORGOT_PWD: "/forgot-password",
	FRESH_LEADS: "/fresh-leads",
	LEADS: "/leads",
	LOGIN: "/login",
	MODULE_SETUP: ":module/set-up",
	ORDERS: "/orders",
	PAYOUT: "/payouts",
	PAYROLL: "/payroll",
	PIPELINE: "/pipeline",
	PRODUCTS: "/products",
	PROFILE: "/profile",
	PROJECT: "/project",
	REPORT: "/reports",
	RESOURCES: "/resources",
	SALES: "/sales",
	SCHEDULING: "/scheduling",
	SIGNUP: "/signup",
	VERIFY_EMAIL: "/verify-email",
	WORKVIEW: "/workview",
};

export const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<Suspense fallback={<Loader />}>
				<RootLayout />
			</Suspense>
		),
		children: [
			{
				index: true,
				element: <CRMDashboard />,
			},
			/* Sales */
			{
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
				path: `${ROUTE_PATH.SALES}${ROUTE_PATH.PAYOUT}`,
				element: <Payouts />,
			},
			{
				path: `${ROUTE_PATH.SALES}${ROUTE_PATH.CUSTOMERS}`,
				element: <Customers />,
			},
			{
				path: `${ROUTE_PATH.SALES}${ROUTE_PATH.CUSTOMERS}${ROUTE_PATH.CUST_PROFILE}`,
				element: <Contacts />,
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
				path: `${ROUTE_PATH.SALES}${ROUTE_PATH.PROFILE}`,
				element: <UserProfileDetails />,
			},
			// {
			// 	path: "/invoice",
			// 	element: <Invoice />,
			// },
			{
				path: `${ROUTE_PATH.SALES}${ROUTE_PATH.RESOURCES}`,
				element: <Resources />,
			},
			{
				path: `${ROUTE_PATH.SALES}${ROUTE_PATH.ADD_PAPER}`,
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
				path: ROUTE_PATH.MODULE_SETUP,
				element: <Setup />,
			},
			/* Project Management*/
			{
				path: ROUTE_PATH.PROJECT,
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
			/* Payroll */
			{
				path: ROUTE_PATH.PAYROLL,
				element: <Employees />,
			},
			/* Scheduling */
			{
				path: ROUTE_PATH.SCHEDULING,
				// element: <SchedulingDashboard />,
				element: <ScheduleWorkView />,
			},
			{
				path: `${ROUTE_PATH.SCHEDULING}${ROUTE_PATH.WORKVIEW}`,
				element: <ScheduleWorkView />,
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
