import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  StackDivider,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { Field, Form, FormikProvider, useFormik } from "formik";

import moment from "moment";
import { useState } from "react";
import { IoArrowDown } from "react-icons/io5";
const AttendanceTable = ({ user, employees, handleFormSubmit }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  let initialValues = {
    inTime: "",
    breakInTime: "",
    breakOutTime: "",
    outTime: "",
  };
  const [record, setRecord] = useState(null);
  const formik = useFormik({
    initialValues,
    onSubmit: (formValues) => {
      try {
        formValues.inTime = formValues.inTime.replace(":", ".");
        formValues.outTime = formValues.outTime.replace(":", ".");
        formValues.breakInTime = formValues.breakInTime.replace(":", ".");
        formValues.breakOutTime = formValues.breakInTime.replace(":", ".");
        let diff = Number(formValues.inTime) - Number(formValues.outTime);
        formValues.totalHours = Math.abs(diff).toFixed(2);
        handleFormSubmit(formValues, record);
      } catch (error) {
        console.log(error);
      }
    },
  });
  const openModal = (log) => {
    setRecord(log);
    initialValues = { inTime: log?.inTime, outTime: log?.outTime };
    onOpen();
  };
  return (
    <>
      <Table variant="simple">
        <Thead bg="#f0f2f4">
          <Tr>
            {/* <Th>Email</Th> */}
            <Th>
              <HStack spacing="3">
                <HStack spacing="1">
                  <Text>Created On</Text>
                  <Icon as={IoArrowDown} color="muted" boxSize="4" />
                </HStack>
              </HStack>
            </Th>
            <Th>Time In</Th>
            <Th>Break In</Th>
            <Th>Break Out</Th>
            <Th>Time Out</Th>
            <Th>Attendance status</Th>
            <Th>Total </Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {employees.length ? (
            <>
              {employees.map((employee) => (
                <Tr key={employee._id}>
                  {/* <Td>{employee.email}</Td> */}
                  <Td>{moment(employee.createdAt).format("YYYY-MM-DD")}</Td>
                  <Td>
                    <Text>{employee.clockInTime}</Text>
                  </Td>
                  <Td>
                    <Text>{employee.breakInTime}</Text>
                  </Td>
                  <Td>
                    <Text>{employee.breakOutTime}</Text>
                  </Td>
                  <Td>
                    <Text color="muted">{employee.clockOutTime}</Text>
                  </Td>
                  <Td>
                    <Text>{employee.status}</Text>
                  </Td>
                  <Td>
                    <Text color="muted">{employee.totalWorkHours}</Text>
                  </Td>
                  <Td>
                    <Button onClick={() => openModal(employee)} variant="link">
                      Edit Log
                    </Button>
                  </Td>
                </Tr>
              ))}
            </>
          ) : (
            <Tr>
              <Td>No record to show</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader> Edit Attendance Log </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack divider={<StackDivider />}>
              <FormikProvider value={formik}>
                <Form>
                  <Field name="inTime" key="inTime">
                    {({ field }) => (
                      <FormControl id="inTime">
                        <FormLabel>Time-in</FormLabel>
                        <Input
                          {...field}
                          type="time"
                          defaultValue={initialValues.inTime}
                        />
                      </FormControl>
                    )}
                  </Field>{" "}
                  <Field name="breakInTime" key="breakInTime">
                    {({ field }) => (
                      <FormControl id="breakInTime">
                        <FormLabel>Break-in</FormLabel>
                        <Input
                          {...field}
                          type="time"
                          defaultValue={initialValues.breakInTime}
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="breakOutTime" key="breakOutTime">
                    {({ field }) => (
                      <FormControl id="breakOutTime">
                        <FormLabel>Break-out</FormLabel>
                        <Input
                          {...field}
                          type="time"
                          defaultValue={initialValues.breakOutTime}
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="outTime" key="outTime">
                    {({ field }) => (
                      <FormControl id="outTime">
                        <FormLabel>Time-out</FormLabel>
                        <Input
                          {...field}
                          defaultValue={initialValues.outTime}
                          type="time"
                        />
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
    </>
  );
};
export default AttendanceTable;
