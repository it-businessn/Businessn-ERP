import { VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import * as api from "services";
import AddLogForm from "./AddLogForm";
import LogActivityList from "./LogActivityList";

const Logs = ({ contact, showLogForm }) => {
  const [activities, setActivities] = useState([]);
  const [showAddForm, setShowAddForm] = useState(showLogForm);
  useEffect(() => {
    fetchActivitiesByContactId(contact);
  }, []);

  const saveActivity = async (activity) => {
    try {
      activity.contactId = contact;
      await api.addActivity(activity);
      fetchActivitiesByContactId(contact);
      setShowAddForm((prev) => !prev);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchActivitiesByContactId = async (contact) => {
    try {
      const response = await api.getActivitiesByContactId(contact);
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
