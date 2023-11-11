import {
  Alert,
  AlertDescription,
  Box,
  Center,
  CloseButton,
  Flex,
  HStack,
  Stack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Card } from "components";
import { useAuthContext } from "hooks/useAuthContext";
import moment from "moment";
import { useEffect, useState, useTransition } from "react";
import Calendar from "react-calendar";
import "react-datepicker/dist/react-datepicker.css";
import * as api from "services";
import "../features/sidebar/Sidebar.css";

const NotificationBox = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [date, setDate] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { user } = useAuthContext();
  const dateTemplate = (date) => {
    if (date.day > 10 && date.day < 15) {
      return (
        <strong
          style={{
            textDecoration: "line-through",
            color: "brand.500",
          }}
        >
          {date.day}
        </strong>
      );
    }

    return date.day;
  };
  const fetchDateNotification = async (e) => {
    setDate(e.value);
    const notification = await api.getNotificationByDate(e.value, user.token);
    console.log(notification);
    if (notification.status === 200) {
      setEndDate(null);
      setStartDate(null);
      setNotifications(notification.data);
    }
  };
  const handleClick = (id) => {
    const result = notifications.filter((item) => item._id !== id);
    setNotifications(result);
  };
  const [notificationList, setNotificationList] = useState();
  const [notifications, setNotifications] = useState(null);

  useEffect(() => {
    const fetchAllNotifications = async () => {
      const notificationList = await api.getNotifications(user.token);
      setNotifications(notificationList.data);
      // msgs.current.show(notifications);
    };
    fetchAllNotifications();
  }, []);
  return (
    <Flex width="25%" flexDir="column">
      <Card pb={3}>
        <Text textAlign="center" fontWeight="medium">
          Current Pay Period
        </Text>
        <Calendar
          inline
          selectionMode="range"
          readOnlyInput
          value={date}
          onChange={fetchDateNotification}
          dateTemplate={dateTemplate}
        />
        <Center>
          <HStack>
            {/* <VStack> */}
            {/* <Text>Approved Deadline</Text> */}
            {/* <Text>icon center and approved date time</Text> */}
            {/* </VStack> */}
            <VStack>
              {/* <Text>Pay period</Text> */}
              {/* <Text>icon center and July 01st-15th</Text> */}
              <Text>
                {moment(new Date("2023-10-17")).format("YYYY/MM/DD")} -{" "}
                {moment(new Date("2023-10-30")).format("YYYY/MM/DD")}
              </Text>
            </VStack>
          </HStack>
        </Center>
      </Card>
      <Card p={3} overflowY="scroll">
        <Text textAlign="center" fontWeight="medium">
          Notifications
        </Text>
        {notifications && notifications.length ? (
          <>
            {notifications.map((item) => (
              <Stack
                key={item._id}
                justify="space-between"
                fontSize="sm"
                align="baseline"
                flexDir="row"
              >
                <Alert status="success">
                  <Box>
                    <AlertDescription>{item.message}</AlertDescription>
                  </Box>
                  <CloseButton
                    alignSelf="flex-start"
                    position="relative"
                    right={-1}
                    top={-1}
                    onClick={(e) => {
                      e.preventDefault();
                      handleClick(item._id);
                    }}
                  />
                </Alert>
              </Stack>
            ))}
          </>
        ) : (
          <Alert status="success">
            <Box>
              <AlertDescription>No notifications to display</AlertDescription>
            </Box>
          </Alert>
        )}
      </Card>
    </Flex>
  );
};

export default NotificationBox;
