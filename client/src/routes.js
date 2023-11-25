import Loader from "features/Loader";
import PageNotFound from "features/PageNotFound";
import Contacts from "features/contacts";
import Home from "features/home";
import CalendarDashboard from "features/sales/calendar";
import Pipeline from "features/sales/pipeline";
import RootLayout from "layouts/RootLayout";
import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
const Login = lazy(() => import("features/login"));
const ForgotPassword = lazy(() => import("features/login/ForgotPassword"));
const VerifyEmail = lazy(() => import("features/verify-user"));
const SignUp = lazy(() => import("features/sign-up"));
const EditUser = lazy(() => import("features/user/profile/EditUser"));

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
        path: "/sign-in",
        element: <Login />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "/verify-email",
        element: <VerifyEmail />,
      },
      {
        path: "/calendar",
        element: <CalendarDashboard />,
      },
      {
        path: "/pipeline",
        element: <Pipeline />,
      },
      {
        path: "/view-contacts",
        element: <Contacts />,
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
]);
