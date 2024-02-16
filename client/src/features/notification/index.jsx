import { Alert, AlertIcon, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import * as api from "services";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.getNotifications();
        setNotifications(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <Box>
      {notifications.map((notification) => (
        <Alert key={notification._id} status={notification.status}>
          <AlertIcon />
          {notification.message}
        </Alert>
      ))}
    </Box>
  );
};

export default Notifications;
