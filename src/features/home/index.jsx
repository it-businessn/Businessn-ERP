import { USER_ROLE } from "config/constant";
import { useAuthContext } from "hooks/useAuthContext";
import DashboardLayout from "layouts/DashboardLayout";
import { Navigate } from "react-router-dom";
import Dashboard from "../dashboard";
import EmployeeDashboard from "../dashboard/EmployeeDashboard";

const Home = () => {
  // const { user } = useAuthContext();
  // if (!user) {
  //   return <Navigate to="/sign-in" />;
  // }
  // const userRole = user?.user?.role;
  return (
    <>
      {/* {user && ( */}
      <DashboardLayout>
        {/* {userRole === USER_ROLE.EMPLOYEE ? (
            <EmployeeDashboard />
          ) : ( */}
        <Dashboard />
        {/* )} */}
      </DashboardLayout>
      {/* )} */}
    </>
  );
};

export default Home;
