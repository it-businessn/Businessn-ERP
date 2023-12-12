import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

const RootLayout = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
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
