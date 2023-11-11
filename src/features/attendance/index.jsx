import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  StackDivider,
  useDisclosure,
} from "@chakra-ui/react";
import { USER_ROLE } from "config/constant";
import { DashboardLayout, ProfileContainer } from "layouts";
import { useEffect, useState } from "react";
import { Form } from "react-router-dom";
import * as api from "services";
import AttendanceTable from "./AttendanceTable";

function AttendanceWidget() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [userData, setData] = useState(null);
  useEffect(() => {
    fetchUserData();
  }, []);
  const fetchUserData = async () => {
    try {
      let result = await api.getAttendanceDetails(user.token);
      setData(result.data);
    } catch (error) {}
  };
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [clockInTime, setInTime] = useState(null);
  const [clockOutTime, setOutTime] = useState(null);
  const [breakInTime, setBreakInTime] = useState(null);
  const [breakOutTime, setBreakOutTime] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const values = { clockInTime, clockOutTime, breakInTime, breakOutTime };
    try {
      const updateData = await api.addUserAttendanceDetailsById(
        user.user._id,
        values,
        user.token
      );
      fetchUserData();
      onClose();
    } catch (error) {
      // setError(error.response.data.error);
      console.log(error);
    }
  };
  const handleFormSubmit = async (values, record) => {
    console.log(values, record);
    try {
      // const updateData = await api.updateAttendanceDetailsById(
      //     record._id,
      //     values,
      //     user.token
      // );
      // fetchUserData();
      // onClose();
    } catch (error) {
      // setError(error.response.data.error);
      console.log(error);
    }
  };
  const [showEmpTime, setShowEmpTime] = useState(false);
  const combineDateTime = () => {
    const selectedTime = showEmpTime;

    console.log("Combined Date and Time:", showEmpTime);
    if (!selectedTime) {
      console.log("Please select a time.");
      return;
    }

    // Get the current date as a string (format: YYYY-MM-DD)
    const currentDate = new Date().toISOString().slice(0, 10);

    // Combine the date and time to create a full Date object
    const combinedDateTime = new Date(`${currentDate}T${selectedTime}`);

    console.log("Combined Date and Time:", showEmpTime, combinedDateTime);
  };
  return (
    <DashboardLayout>
      <ProfileContainer>
        <Stack spacing="3">
          <Flex justifyContent="space-between">
            <Heading size="xs"> Timesheet Details</Heading>

            <Spacer />
            <Button onClick={onOpen} variant="primary">
              Raise New Log
            </Button>
            {/* {user && user.user?.role !== USER_ROLE.EMPLOYEE && (
              <>
                {!showEmpTime ? (
                  <Button
                    pl={3}
                    onClick={() => setShowEmpTime(true)}
                    variant="link"
                  >
                    View Employee Timesheet
                  </Button>
                ) : (
                  <Button
                    pl={3}
                    onClick={() => setShowEmpTime(false)}
                    variant="link"
                  >
                    Hide Employee Timesheet
                  </Button>
                )}
              </>
            )} */}
          </Flex>
          {userData && (
            <AttendanceTable
              handleFormSubmit={handleFormSubmit}
              user={user}
              employees={userData.filter((item) => item.email === user.email)}
            />
          )}
          {user &&
            userData &&
            user?.role !== USER_ROLE.EMPLOYEE &&
            showEmpTime && (
              <>
                <Flex justifyContent="space-between">
                  <Heading size="xs">Employee Timesheet Details</Heading>
                </Flex>
                <AttendanceTable
                  handleFormSubmit={handleFormSubmit}
                  user={user}
                  employees={userData}
                />
              </>
            )}
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader> New Attendance Log </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack divider={<StackDivider />}>
                  <Form onSubmit={handleSubmit}>
                    <FormControl id="clockInTime">
                      <FormLabel>Time-in</FormLabel>

                      <Input
                        type="time"
                        onChange={(e) => setInTime(e.target.value)}
                      />
                    </FormControl>

                    <FormControl id="breakInTime">
                      <FormLabel>Break-out</FormLabel>
                      <Input
                        type="time"
                        onChange={(e) => setBreakInTime(e.target.value)}
                      />
                    </FormControl>
                    <FormControl id="breakOutTime">
                      <FormLabel>Break-out</FormLabel>
                      <Input
                        type="time"
                        onChange={(e) => setBreakOutTime(e.target.value)}
                      />
                    </FormControl>
                    <FormControl id="clockOutTime">
                      <FormLabel>Time-out</FormLabel>
                      <Input
                        type="time"
                        onChange={(e) => setOutTime(e.target.value)}
                      />
                    </FormControl>

                    <Flex direction="row" justify="flex-end" py="4">
                      <Button variant="outline" mr={3} onClick={onClose}>
                        Close
                      </Button>
                      <Button type="submit" variant="primary">
                        Submit
                      </Button>
                    </Flex>
                  </Form>
                </Stack>
              </ModalBody>
            </ModalContent>
          </Modal>
        </Stack>
      </ProfileContainer>
    </DashboardLayout>
  );
}

export default AttendanceWidget;
