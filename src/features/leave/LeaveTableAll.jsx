import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    FormControl,
    FormLabel,
    HStack,
    Heading,
    Icon,
    IconButton,
    Radio,
    RadioGroup,
    Stack,
    Table,
    Tbody,
    Td,
    Text,
    Textarea,
    Th,
    Thead,
    Tr,
    useDisclosure,
} from "@chakra-ui/react";
import { Field, Form, FormikProvider, useFormik } from "formik";

import { CheckIcon } from "@chakra-ui/icons";
import { USER_ROLE } from "config/constant";
import moment from "moment";
import { useState } from "react";
import { FaBan } from "react-icons/fa";
import { IoArrowDown } from "react-icons/io5";

const LeaveTableAll = ({ user, employees, handleAllSubmit }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [record, setRecord] = useState(null);
  let initialValues = {
    leaveRequestDecisionComment: "",
    leaveApproved: "",
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

  const handleSubmit = async (values) => {
    values.leaveApproved = "Yes" ? true : false;
    values.id = record._id;
    handleAllSubmit(values);
    onClose();
  };
  const openApproveModal = (employee) => {
    setRecord(employee);
    onOpen();
  };
  return (
    <>
      <Table variant="simple" layout="fixed">
        <Thead bg="#f0f2f4">
          <Tr>
            <Th width={200}>
              <HStack spacing="3">
                <HStack spacing="1">
                  <Text>Requested By</Text>
                  <Icon as={IoArrowDown} color="muted" boxSize="4" />
                </HStack>
              </HStack>
            </Th>
            <Th>Duration</Th>
            <Th>Balance</Th>
            <Th>Created On</Th>
            <Th>Request Type</Th>
            <Th>Leave Reason</Th>
            <Th>Status</Th>
            <Th> Comment</Th>
            {user.role !== USER_ROLE.EMPLOYEE && <Th> Action</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {employees.length ? (
            <>
              {employees.map((employee) => (
                <Tr key={employee._id}>
                  <Td>
                    <HStack spacing="3">
                      <Box>
                        <Text fontWeight="medium">{employee.raisedBy}</Text>
                      </Box>
                    </HStack>
                  </Td>
                  <Td>{employee.durationOfLeave}</Td>
                  <Td>{employee.leaveBalance}</Td>
                  <Td>
                    <Text>{moment(employee.created).format("YYYY-MM-DD")}</Text>
                  </Td>
                  <Td>
                    <Text color="muted">{employee.leaveType}</Text>
                  </Td>
                  <Td>
                    <Text color="muted">{employee.leaveReason}</Text>
                  </Td>
                  <Td>
                    <Text color="muted">{employee.leaveRequestStatus}</Text>
                  </Td>
                  <Td>
                    <Text color="muted">
                      {employee.leaveRequestDecisionComment}
                    </Text>
                  </Td>
                  <Td>
                    {user.role !== USER_ROLE.EMPLOYEE &&
                      user.email === employee.approverName &&
                      employee.leaveRequestStatus !== "Approved" && (
                        <HStack spacing="1">
                          <IconButton
                            onClick={() => openApproveModal(employee)}
                            icon={<CheckIcon color="brand.500" />}
                            variant="ghost"
                            borderRadius="50%"
                            size="xs"
                            aria-label="Edit employee"
                          />
                          <IconButton
                            icon={<FaBan color="red" fontSize=".5rem" />}
                            onClick={() => openApproveModal(employee)}
                            variant="ghost"
                            borderRadius="50%"
                            size="xs"
                            aria-label="Edit employee"
                          />
                        </HStack>
                      )}
                  </Td>
                </Tr>
              ))}
            </>
          ) : (
            <Tr>
              <Td colSpan={9}>No record to show</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      <Drawer isOpen={isOpen} onClose={onClose} size="lg">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader textAlign="center" spacing={3}>
            <Heading size="sm">Approve Leave</Heading>
            <Text fontSize="md" color="fg.muted">
              View details of leave request
            </Text>
          </DrawerHeader>

          <DrawerBody>
            <Table variant="simple" size="sm">
              {record && (
                <Tbody>
                  <Tr>
                    <Td>Employee Email</Td>
                    <Td>{record.raisedBy}</Td>
                    <Td>Requested On</Td>
                    <Td>{moment(record.created).format("YYYY-MM-DD")}</Td>
                  </Tr>
                  <Tr>
                    <Td>Duration of Leave(in days) </Td>
                    <Td>{record.durationOfLeave}</Td>
                    <Td>Duration period</Td>
                    <Td>
                      {moment(record.leaveStartDate).format("YYYY-MM-DD")}-
                      {moment(record.leaveEndDate).format("YYYY-MM-DD")}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Leave Reason</Td>
                    <Td>{record.leaveReason}</Td>
                    <Td>Leave Type</Td>
                    <Td>{record.leaveType}</Td>
                  </Tr>
                </Tbody>
              )}
            </Table>
            {/* <Field name={item.name} key={item.name}>
                            {({ field, form: { setFieldValue } }) => (
                                <FormControl>
                                    <FormLabel>{item.label}</FormLabel>
                                    <Stack direction="row">
                                        <label className="text-gray-500 font-bold">
                                            <Field
                                                {...field}
                                                name={item.name}
                                                value="true"
                                                className="mr-2 leading-tight"
                                                type={item.type}
                                            />
                                            <span class="text-sm">Yes</span>
                                        </label>
                                        <label className="text-gray-500 font-bold">
                                            <Field
                                                {...field}
                                                name={item.name}
                                                value="false"
                                                className="mr-2 leading-tight"
                                                type={item.type}
                                            />
                                            <span class="text-sm">No</span>
                                        </label>
                                    </Stack>
                                </FormControl>
                            )}
                        </Field> */}
            <FormikProvider value={formik}>
              <Form>
                <Table variant="simple">
                  <Tbody>
                    <Tr>
                      <Td padding="2em 1em">
                        <Field name="leaveApproved" key="leaveApproved">
                          {({ field }) => (
                            <FormControl
                              id="leaveApproved"
                              display="flex"
                              justifyContent="flex-start"
                            >
                              <FormLabel>Approve Request</FormLabel>
                              <RadioGroup defaultValue="No">
                                <Stack spacing={5} direction="row">
                                  <Radio
                                    {...field}
                                    colorScheme="red"
                                    value="No"
                                  >
                                    No
                                  </Radio>
                                  <Radio
                                    {...field}
                                    colorScheme="green"
                                    value="Yes"
                                  >
                                    Yes
                                  </Radio>
                                </Stack>
                              </RadioGroup>
                            </FormControl>
                          )}
                        </Field>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td padding="1em">
                        <Field
                          name="leaveRequestDecisionComment"
                          key="leaveRequestDecisionComment"
                        >
                          {({ field }) => (
                            <FormControl id="leaveRequestDecisionComment">
                              <FormLabel>Comment</FormLabel>
                              <Textarea {...field} />
                            </FormControl>
                          )}
                        </Field>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
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
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
export default LeaveTableAll;
