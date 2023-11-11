import {
  Button,
  Card,
  CardBody,
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
  Select,
  Stack,
  StackDivider,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { TOAST } from "config/constant";
import { Field, Form, FormikProvider, useFormik } from "formik";
import { DashboardLayout, ProfileContainer } from "layouts";
import { useEffect, useState } from "react";
import * as api from "services";
import LeaveTable from "./LeaveTable";

function LeaveWidget() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [leaveType, setLeaveType] = useState([]);
  const [userData, setData] = useState(null);
  useEffect(() => {
    fetchUserData();
    const fetchConfigurationOptionsByLeaveType = async (key) => {
      let configuration = await api.getConfigurationsByName(key);

      configuration.data.items.forEach((type) =>
        setLeaveType((prev) => [...prev, type.name])
      );
    };
    fetchConfigurationOptionsByLeaveType("leaveBalance");
  }, []);
  const fetchUserData = async () => {
    try {
      let result = await api.getLeaveRequest(user.token);
      setData(result.data);
    } catch (error) {}
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  let initialValues = {
    reason: "",
  };
  const formik = useFormik({
    initialValues,
    onSubmit: (formValues) => {
      try {
        handleSubmit(formValues);
      } catch (error) {
        console.log(error);
      }
    },
  });

  const toast = useToast();
  const handleSubmit = async (values) => {
    try {
      const updateData = await api.raiseLeaveRequest(
        user?.user._id,
        values,
        user.token
      );
      fetchUserData();
      toast(TOAST.SUCCESS);
      onClose();
    } catch (error) {
      toast(TOAST.ERROR);
      // setError(error.response.data.error);
      console.log(error);
    }
  };
  const handleAllSubmit = async (values) => {
    try {
      const updateData = await api.updateLeaveRequestDetailsById(
        values.id,
        values,
        user.token
      );
      fetchUserData();
      toast(TOAST.SUCCESS);
    } catch (error) {
      // setError(error.response.data.error);
      console.log(error);
    }
  };
  return (
    <DashboardLayout>
      <ProfileContainer>
        <Stack>
          <Card>
            <CardBody>
              <Flex justifyContent="space-between">
                <Heading size="xs"> Leave Requests</Heading>
                {/* <Button onClick={onOpen} variant="primary">
                  Raise New Request
                </Button> */}
              </Flex>
              {userData && (
                <LeaveTable
                  user={user?.user}
                  employees={userData}
                  // employees={userData.filter(
                  //     (data) =>
                  //         data.raisedBy ===
                  //         user?.user.email
                  // )}
                />
              )}
            </CardBody>
          </Card>
          {/* {user &&
                        userData &&
                        user?.user?.role !== USER_ROLE.EMPLOYEE && (
                            <>
                                <Card>
                                    <CardBody>
                                        <Flex justifyContent="space-between">
                                            <Heading size="xs">
                                                Requests Pending for Action
                                            </Heading>
                                            {!allRequests && (
                                                <Button
                                                    onClick={() =>
                                                        setAllReq(true)
                                                    }
                                                    variant="primary"
                                                >
                                                    View All Requests
                                                </Button>
                                            )}
                                            {allRequests && (
                                                <Button
                                                    onClick={() =>
                                                        setAllReq(false)
                                                    }
                                                    variant="primary"
                                                >
                                                    Hide All Requests
                                                </Button>
                                            )}
                                        </Flex>
                                        <LeaveTableAll
                                            user={user?.userDetails?.data}
                                            employees={userData.filter(
                                                (data) =>
                                                    data.leaveRequestStatus !==
                                                        "Approved" &&
                                                    data.approverName ===
                                                        user?.userDetails?.data
                                                            .email
                                            )}
                                            handleAllSubmit={handleAllSubmit}
                                        />
                                    </CardBody>
                                </Card>
                                {allRequests && (
                                    <Card>
                                        <CardBody>
                                            <Flex justifyContent="space-between">
                                                <Heading size="xs">
                                                    Requests Actioned
                                                </Heading>
                                            </Flex>
                                            <LeaveTableAllActioned
                                                user={user?.userDetails?.data}
                                                employees={userData.filter(
                                                    (data) =>
                                                        data.approverName ===
                                                        user?.userDetails?.data
                                                            .email
                                                )}
                                            />
                                        </CardBody>
                                    </Card>
                                )}
                            </>
                        )} */}
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Raise Leave Request</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack divider={<StackDivider />}>
                  <FormikProvider value={formik}>
                    <Form>
                      {/* <Field
                                                name="approverName"
                                                key="approverName"
                                            >
                                                {({ field }) => (
                                                    <FormControl id="approverName">
                                                        <FormLabel>
                                                            Leave Approver Name
                                                        </FormLabel>
                                                        <Input {...field} />
                                                    </FormControl>
                                                )}
                                            </Field> */}
                      <Field name="startDate" key="startDate">
                        {({ field }) => (
                          <FormControl id="startDate">
                            <FormLabel>From</FormLabel>
                            <Input {...field} type="date" />
                          </FormControl>
                        )}
                      </Field>
                      <Field name="endDate" key="endDate">
                        {({ field }) => (
                          <FormControl id="endDate">
                            <FormLabel>To</FormLabel>
                            <Input type="date" {...field} />
                          </FormControl>
                        )}
                      </Field>
                      <Field name="leaveType" key="leaveType">
                        {({ field }) => (
                          <FormControl id="leaveType">
                            <FormLabel>Leave Type</FormLabel>
                            <Select placeholder="Select leave type" {...field}>
                              {leaveType.map((item) => (
                                <option key={item}>{item}</option>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="reason" key="reason">
                        {({ field }) => (
                          <FormControl id="reason">
                            <FormLabel>Reason</FormLabel>
                            <Input {...field} />
                          </FormControl>
                        )}
                      </Field>
                      <Flex direction="row" justify="flex-end" py="4">
                        <Button variant="outline" mr={3} onClick={onClose}>
                          Close
                        </Button>
                        <Button type="submit" variant="primary">
                          Submit
                        </Button>
                      </Flex>
                    </Form>
                  </FormikProvider>
                </Stack>
              </ModalBody>
            </ModalContent>
          </Modal>
        </Stack>
      </ProfileContainer>
    </DashboardLayout>
  );
}

export default LeaveWidget;
