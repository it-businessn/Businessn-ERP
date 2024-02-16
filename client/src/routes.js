import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import Loader from "features/Loader";
import PageNotFound from "features/PageNotFound";
import Home from "features/home";
// import AddPayrun from "features/payroll/AddPayRun";
import RootLayout from "layouts/RootLayout";

// const PayrollTable = lazy(() => import("features/payroll"));
// const GeneratePayRun = lazy(() => import("features/payroll/GeneratePayRun"));
const UserProfileDetails = lazy(() => import("components/UserProfileDetails"));
const AddOpportunity = lazy(() =>
	import("features/sales/pipeline/AddOpportunity"),
);
const Calendar = lazy(() => import("features/sales/calendar"));
const TaskByDate = lazy(() => import("features/sales/calendar/TaskByDate"));

const Contacts = lazy(() => import("features/sales/contacts"));

const TaskDashboard = lazy(() => import("features/sales/tasks"));
const AddContact = lazy(() => import("features/sales/contacts/AddContact"));
const EditContact = lazy(() => import("features/sales/contacts/EditContact"));

const EditOpportunity = lazy(() =>
	import("features/sales/pipeline/EditOpportunity"),
);
const OpportunitiesList = lazy(() =>
	import("features/sales/pipeline/OpportunitiesList"),
);
const Pipeline = lazy(() => import("features/sales/pipeline"));

const EditUser = lazy(() => import("features/user/profile/EditUser"));
const ForgotPassword = lazy(() => import("features/login/ForgotPassword"));
const Login = lazy(() => import("features/login"));
const SignUp = lazy(() => import("features/sign-up"));
const VerifyEmail = lazy(() => import("features/verify-user"));

const CRMDashboard = lazy(() => import("features/sales"));
const Customers = lazy(() => import("features/sales/customers"));
const SalesReport = lazy(() => import("features/sales/reports"));
const FreshLeads = lazy(() => import("features/sales/fresh_leads"));
const Resources = lazy(() => import("features/sales/resources"));

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
				path: "/sales-dashboard",
				element: <CRMDashboard />,
			},
			{
				path: "/customers",
				element: <Customers />,
			},
			{
				path: "/reports",
				element: <SalesReport />,
			},
			{
				path: "/fresh-leads",
				element: <FreshLeads />,
			},
			{
				path: "/resources",
				element: <Resources />,
			},
			{
				path: "/calendar",
				element: <Calendar />,
			},
			{
				path: "/profile",
				element: <UserProfileDetails />,
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
				path: "/pipeline",
				element: <Pipeline />,
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
