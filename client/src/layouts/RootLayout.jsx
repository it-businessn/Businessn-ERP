import { Outlet } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

const RootLayout = () => {
  return (
    <DashboardLayout>
      <main style={{ width: "85vw", marginTop: "100px" }}>
        <Outlet />
      </main>
    </DashboardLayout>
  );
};

export default RootLayout;
