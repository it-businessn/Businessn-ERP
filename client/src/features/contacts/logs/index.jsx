import { VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import * as api from "services";
import AddLogForm from "./AddLogForm";
import LogActivityList from "./LogActivityList";

const Logs = ({ showLogForm }) => {
  const [activities, setActivities] = useState([]);
  const [showAddForm, setShowAddForm] = useState(showLogForm);
  useEffect(() => {
    fetchActivities();
  }, []);

  const saveActivity = async (activity) => {
    try {
      const response = await api.addActivity(activity);
      fetchActivities();
      setShowAddForm((prev) => !prev);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchActivities = async () => {
    try {
      const response = await api.getActivities();
      setActivities(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <VStack spacing="4" p="4" width="100%">
      {showAddForm && <AddLogForm onSave={saveActivity} />}
      {activities.length && (
        <LogActivityList
          showLogForm={(state) => setShowAddForm(state)}
          activities={activities}
        />
      )}
    </VStack>
  );
};

export default Logs;
