import { ROUTE_PATH } from "config/constant";
import Loader from "features/Loader";
import PageNotFound from "features/PageNotFound";
import FederalTaxSummary from "features/calculate-payroll/FederalTax";
import Home from "features/home";
import CalendarDashboard from "features/sales/calendar";
import Pipeline from "features/sales/pipeline";
import RootLayout from "layouts/RootLayout";
import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
const Login = lazy(() => import("features/login"));
const ForgotPassword = lazy(() => import("features/login/ForgotPassword"));
const VerifyEmail = lazy(() => import("features/verify-user"));
const Leave = lazy(() => import("features/leave"));
const SignUp = lazy(() => import("features/sign-up"));
const Profile = lazy(() => import("features/user/profile"));
const User = lazy(() => import("features/user/user-list"));
const Bank = lazy(() => import("features/bank"));
const AddBankDetail = lazy(() => import("features/bank/AddBankDetail"));
const Payslip = lazy(() => import("features/payslip"));
const PayrollSummary = lazy(() => import("features/calculate-payroll"));
const EditUser = lazy(() => import("features/user/profile/EditUser"));
const Payroll = lazy(() => import("features/payroll"));
const Attendance = lazy(() => import("features/attendance"));
const Configuration = lazy(() => import("features/configuration"));
const Permission = lazy(() => import("features/permission"));

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
        path: ROUTE_PATH.PROFILE,
        element: <Profile />,
      },
      {
        path: "/edit-user/:id",
        element: <EditUser />,
      },
      {
        path: ROUTE_PATH.BANK,
        element: <Bank />,
      },
      {
        path: "/add-bank-detail/:id",
        element: <AddBankDetail />,
      },
      {
        path: ROUTE_PATH.PAYSLIP,
        element: <Payslip />,
      },
      {
        path: ROUTE_PATH.PAYROLL,
        element: <Payroll />,
      },
      {
        path: ROUTE_PATH.ATTENDANCE,
        element: <Attendance />,
      },
      {
        path: ROUTE_PATH.LEAVE,
        element: <Leave />,
      },
      {
        path: ROUTE_PATH.TAX,
        element: <PayrollSummary />,
      },
      {
        path: "tax",
        element: <FederalTaxSummary />,
      },
      {
        path: ROUTE_PATH.SETTINGS,
        element: <Configuration />,
      },
      {
        path: ROUTE_PATH.PERMISSION,
        element: <Permission />,
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
    ],
  },
]);
