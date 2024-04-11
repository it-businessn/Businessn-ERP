import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import Loader from "./components/Loader";
import PageNotFound from "./features/PageNotFound";
// import AddPayrun from "./features/payroll/AddPayRun";
import Communications from "erp-modules/project-management/communication";
import AddQuestionForm from "erp-modules/sales/resources/add-paper/AddQuestionForm";
import Assessment from "erp-modules/sales/resources/attempt-test/Assessment";
import SalesHome from "./features/home";
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

const Contacts = lazy(() => import("./features/sales/contacts"));

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
				element: <SalesHome />,
			},
			{
				path: "/sales",
				element: <CRMDashboard />,
			},
			{
				path: "/sales/activities",
				element: <Activities />,
			},
			{
				path: "/sales/calendar",
				element: <Calendar />,
			},
			{
				path: "/sales/payouts",
				element: <Payouts />,
			},
			{
				path: "/sales/customers",
				element: <Customers />,
			},
			{
				path: "/sales/leads",
				element: <Opportunities />,
			},
			{
				path: "/sales/leads-docket",
				element: <LeadsDocket />,
			},
			{
				path: "/sales/leads-disburse",
				element: <LeadsDisburse />,
			},
			{
				path: "/sales/fresh-leads",
				element: <FreshLeads />,
			},
			{
				path: "/sales/pipeline",
				element: <Pipeline />,
			},
			{
				path: "/sales/products",
				element: <Products />,
			},
			{
				path: "/sales/orders",
				element: <Orders />,
			},
			{
				path: "/sales/profile",
				element: <UserProfileDetails />,
			},
			// {
			// 	path: "/invoice",
			// 	element: <Invoice />,
			// },
			{
				path: "/sales/resources",
				element: <Resources />,
			},
			{
				path: "/sales/add-paper",
				element: <AddQuestionForm />,
			},
			{
				path: "/sales/assessment/:category",
				element: <Assessment />,
			},
			{
				path: "/sales/reports",
				element: <SalesReport />,
			},
			{
				path: ":module/set-up",
				element: <Setup />,
			},
			// {
			// 	path: "/view-contacts",
			// 	element: <Contacts />,
			// },
			// {
			// 	path: "/add-contact",
			// 	element: <AddContact />,
			// },
			// {
			// 	path: "/edit-contact",
			// 	element: <EditContact />,
			// },
			// {
			// 	path: "/view-tasks",
			// 	element: <TaskByDate />,
			// },
			// {
			// 	path: "/add-opportunity",
			// 	element: <AddOpportunity />,
			// },
			// {
			// 	path: "/edit-opportunity",
			// 	element: <EditOpportunity />,
			// },
			// {
			// 	path: "/opportunities",
			// 	element: <OpportunitiesList />,
			// },
			// {
			// 	path: "/tasks",
			// 	element: <TaskDashboard />,
			// },
			// {
			// 	path: "/edit-user/:id",
			// 	element: <EditUser />,
			// },
			// {
			// 	path: "/generate",
			// 	element: <PayrollTable />,
			// },
			// {
			// 	path: "/generate-payrun",
			// 	element: <GeneratePayRun />,
			// },
			// {
			// 	path: "/add-payrun",
			// 	element: <AddPayrun />,
			// },

			{
				path: "/project",
				element: <WorkView />,
			},
			{
				path: "/project/workview",
				element: <WorkView />,
			},
			{
				path: "/project/comms",
				element: <Communications />,
			},
			{
				path: "/payroll",
				element: <Employees />,
			},
			{
				path: "*",
				element: <PageNotFound />,
			},
		],
	},
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/forgot-password",
		element: <ForgotPassword />,
	},
	{
		path: "/signup",
		element: <SignUp />,
	},
	{
		path: "/verify-email",
		element: <VerifyEmail />,
	},
	{
		path: "*",
		element: <PageNotFound />,
	},
]);
