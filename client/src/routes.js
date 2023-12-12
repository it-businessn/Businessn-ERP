import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import Loader from "features/Loader";
import PageNotFound from "features/PageNotFound";
import Home from "features/home";
import RootLayout from "layouts/RootLayout";
import UserProfileDetails from "components/UserProfileDetails";

const AddOpportunity = lazy(() =>
  import("features/sales/pipeline/AddOpportunity")
);
const CalendarDashboard = lazy(() => import("features/sales/calendar"));
const TaskByDate = lazy(() => import("features/sales/calendar/TaskByDate"));

const Contacts = lazy(() => import("features/sales/contacts"));
const ContactsDashboard = lazy(() =>
  import("features/sales/contacts/ContactsDashboard")
);

const TaskDashboard = lazy(() => import("features/sales/tasks"));
const AddContact = lazy(() => import("features/sales/contacts/AddContact"));
const EditContact = lazy(() => import("features/sales/contacts/EditContact"));

const EditOpportunity = lazy(() =>
  import("features/sales/pipeline/EditOpportunity")
);
const OpportunitiesList = lazy(() =>
  import("features/sales/pipeline/OpportunitiesList")
);
const Pipeline = lazy(() => import("features/sales/pipeline"));

const ResourceDashboard = lazy(() => import("features/resources"));

const EditUser = lazy(() => import("features/user/profile/EditUser"));
const ForgotPassword = lazy(() => import("features/login/ForgotPassword"));
const Login = lazy(() => import("features/login"));
const SignUp = lazy(() => import("features/sign-up"));
const VerifyEmail = lazy(() => import("features/verify-user"));

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
        path: "/sales",
        element: <ContactsDashboard />,
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
        path: "/calendar",
        element: <CalendarDashboard />,
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
        path: "/resource",
        element: <ResourceDashboard />,
      },
      {
        path: "/tasks",
        element: <TaskDashboard />,
      },
      {
        path: "/edit-user/:id",
        element: <EditUser />,
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
