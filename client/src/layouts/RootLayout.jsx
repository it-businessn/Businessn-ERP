import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

const RootLayout = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <>
      {user && (
        <DashboardLayout handleLogout={handleLogout} user={user}>
          <main className="main_content">
            <Outlet />
          </main>
        </DashboardLayout>
      )}
    </>
  );
};

export default RootLayout;
