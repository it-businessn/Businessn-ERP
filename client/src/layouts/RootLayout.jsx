import { Outlet } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

const RootLayout = () => {
  return (
    <DashboardLayout>
      <main>
        <Outlet />
      </main>
    </DashboardLayout>
  );
};

export default RootLayout;
