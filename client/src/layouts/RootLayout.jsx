import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

const RootLayout = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  return (
    <>
      {user && (
        <DashboardLayout user={user}>
          <main style={{ width: "85vw", marginTop: "110px" }}>
            <Outlet />
          </main>
        </DashboardLayout>
      )}
    </>
  );
};

export default RootLayout;
