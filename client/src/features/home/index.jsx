import ContactsDashboard from "features/sales/contacts/ContactsDashboard";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);
  return <ContactsDashboard />;
};

export default Home;
