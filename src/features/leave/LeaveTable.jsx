import {
  HStack,
  Icon,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useFormik } from "formik";

import moment from "moment";
import { useState } from "react";
import { IoArrowDown } from "react-icons/io5";
import * as api from "services";
const LeaveTable = ({ user, employees }) => {
  console.log(user, employees);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user1, setRecord] = useState(localStorage.getItem("user"));
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
    try {
      const updateData = await api.updateLeaveRequestDetailsById(
        user1._id,
        values,
        user1.token
      );
      onClose();
    } catch (error) {
      // setError(error.response.data.error);
      console.log(error);
    }
  };
  return (
    <Table variant="simple">
      <Thead bg="#f0f2f4">
        <Tr>
          <Th>
            <HStack spacing="3">
              <HStack spacing="1">
                <Text>Raised On</Text>
                <Icon as={IoArrowDown} color="muted" boxSize="4" />
              </HStack>
            </HStack>
          </Th>
          <Th>Duration</Th>
          <Th>Leave Type</Th>
          <Th>Balance</Th>
          <Th>Leave Reason</Th>
          <Th>Status</Th>
        </Tr>
      </Thead>
      <Tbody>
        {employees.length ? (
          <>
            {employees.map((employee) => (
              <Tr key={employee._id}>
                <Td>
                  <Text>{moment(employee.createdAt).format("YYYY-MM-DD")}</Text>
                </Td>
                <Td>{employee.duration}</Td>
                <Td>
                  <Text color="muted">{employee.leaveType}</Text>
                </Td>
                <Td>
                  <Text color="muted">0</Text>
                </Td>
                <Td>
                  <Text color="muted">{employee.reason}</Text>
                </Td>
                <Td>
                  <Text color="muted">{employee.status}</Text>
                </Td>
                {employee.status !== "Pending" && (
                  <Td>
                    <Text color="muted">
                      {employee?.leaveRequestDecisionComment}
                    </Text>
                  </Td>
                )}
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
  );
};
export default LeaveTable;
