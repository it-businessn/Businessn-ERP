import { Outlet, useNavigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

const RootLayout = () => {
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {user && (
        <DashboardLayout handleLogout={handleLogout} user={user}>
          <main style={{ width: "85vw", marginTop: "110px" }}>
            <Outlet />
          </main>
        </DashboardLayout>
      )}
    </>
  );
};

export default RootLayout;
