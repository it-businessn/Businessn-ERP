import { VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import * as api from "services";
import AddLogForm from "./AddLogForm";
import LogActivityList from "./LogActivityList";

const Logs = ({ contactId }) => {
  const [activities, setActivities] = useState([]);
  useEffect(() => {
    fetchActivitiesByContactId(contactId);
  }, [contactId]);

  const saveActivity = async (activity) => {
    try {
      activity.contactId = contactId;
      await api.addActivity(activity);
      fetchActivitiesByContactId(contactId);
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
      <AddLogForm onSave={saveActivity} />
      {activities.length && <LogActivityList activities={activities} />}
    </VStack>
  );
};

export default Logs;
