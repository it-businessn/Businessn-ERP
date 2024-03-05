import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import Loader from "./features/Loader";
import PageNotFound from "./features/PageNotFound";
import Home from "./features/home";
// import AddPayrun from "./features/payroll/AddPayRun";
import RootLayout from "./layouts/RootLayout";

// const PayrollTable = lazy(() => import("./features/payroll"));
// const GeneratePayRun = lazy(() => import("./features/payroll/GeneratePayRun"));
const UserProfileDetails = lazy(() =>
	import("./components/user/UserProfileDetails"),
);
const AddOpportunity = lazy(() =>
	import("./features/sales/pipeline/AddOpportunity"),
);
const TaskByDate = lazy(() => import("./features/sales/calendar/TaskByDate"));

const Contacts = lazy(() => import("./features/sales/contacts"));

const TaskDashboard = lazy(() => import("./features/sales/tasks"));
const AddContact = lazy(() => import("./features/sales/contacts/AddContact"));
const EditContact = lazy(() => import("./features/sales/contacts/EditContact"));

const EditOpportunity = lazy(() =>
	import("./features/sales/pipeline/EditOpportunity"),
);
const OpportunitiesList = lazy(() =>
	import("./features/sales/pipeline/OpportunitiesList"),
);

const EditUser = lazy(() => import("./features/user/profile/EditUser"));
const ForgotPassword = lazy(() => import("./features/login/ForgotPassword"));
const Login = lazy(() => import("./features/login"));
const SignUp = lazy(() => import("./features/sign-up"));
const VerifyEmail = lazy(() => import("./features/verify-user"));

const CRMDashboard = lazy(() => import("./features/sales/dashboard"));
const Activities = lazy(() => import("./features/sales/activities"));
const Calendar = lazy(() => import("./features/sales/calendar"));
const Payouts = lazy(() => import("./features/sales/payouts"));
const Customers = lazy(() => import("./features/sales/customers"));

const Opportunities = lazy(() => import("./features/sales/opportunities"));
const LeadsDocket = lazy(() => import("./features/sales/lead docket"));
const LeadsDisburse = lazy(() => import("./features/sales/lead disburse"));
const FreshLeads = lazy(() => import("./features/sales/fresh_leads"));
const Pipeline = lazy(() => import("./features/sales/pipeline"));

const Products = lazy(() => import("./features/sales/products"));
const Orders = lazy(() => import("./features/sales/orders"));
const Invoice = lazy(() => import("./features/sales/invoice"));

const Resources = lazy(() => import("./features/sales/resources"));
const SalesReport = lazy(() => import("./features/sales/reports"));
const Setup = lazy(() => import("./features/sales/setup"));

const ProjectDashboard = lazy(() => import("./features/project/dashboard"));
const Workbench = lazy(() => import("./features/project/workbench"));

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
				element: <Home />,
			},
			{
				path: "/profile",
				element: <UserProfileDetails />,
			},
			{
				path: "/sales-dashboard",
				element: <CRMDashboard />,
			},
			{
				path: "/activities",
				element: <Activities />,
			},
			{
				path: "/calendar",
				element: <Calendar />,
			},
			{
				path: "/payouts",
				element: <Payouts />,
			},
			{
				path: "/customers",
				element: <Customers />,
			},
			{
				path: "/leads",
				element: <Opportunities />,
			},
			{
				path: "/leads-docket",
				element: <LeadsDocket />,
			},
			{
				path: "/leads-disburse",
				element: <LeadsDisburse />,
			},
			{
				path: "/fresh-leads",
				element: <FreshLeads />,
			},
			{
				path: "/pipeline",
				element: <Pipeline />,
			},
			{
				path: "/products",
				element: <Products />,
			},
			{
				path: "/orders",
				element: <Orders />,
			},
			{
				path: "/invoice",
				element: <Invoice />,
			},
			{
				path: "/resources",
				element: <Resources />,
			},
			{
				path: "/reports",
				element: <SalesReport />,
			},
			{
				path: "/set-up",
				element: <Setup />,
			},
			{
				path: "/view-contacts",
				element: <Contacts />,
			},
			{
				path: "/add-contact",
				element: <AddContact />,
			},
			{
				path: "/edit-contact",
				element: <EditContact />,
			},
			{
				path: "/view-tasks",
				element: <TaskByDate />,
			},
			{
				path: "/add-opportunity",
				element: <AddOpportunity />,
			},
			{
				path: "/edit-opportunity",
				element: <EditOpportunity />,
			},
			{
				path: "/opportunities",
				element: <OpportunitiesList />,
			},
			{
				path: "/tasks",
				element: <TaskDashboard />,
			},
			{
				path: "/edit-user/:id",
				element: <EditUser />,
			},
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
				path: "/project-dashboard",
				element: <ProjectDashboard />,
			},
			{
				path: "/workbench-insight",
				element: <Workbench />,
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
