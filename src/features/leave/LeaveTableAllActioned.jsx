import {
    Box,
    HStack,
    Icon,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";

import moment from "moment";
import { IoArrowDown } from "react-icons/io5";
const LeaveTableAllActioned = ({ user, employees }) => {
    let initialValues = {
        leaveRequestDecisionComment: "",
        leaveApproved: "",
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
                                    <Icon
                                        as={IoArrowDown}
                                        color="muted"
                                        boxSize="4"
                                    />
                                </HStack>
                            </HStack>
                        </Th>
                        <Th>Duration</Th>
                        <Th>Balance</Th>
                        <Th>Created On</Th>
                        <Th>Request Type</Th>
                        <Th>Leave Reason</Th>
                        <Th>Status</Th>
                        <Th>Comment</Th>
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
                                                <Text fontWeight="medium">
                                                    {employee.raisedBy}
                                                </Text>
                                            </Box>
                                        </HStack>
                                    </Td>
                                    <Td>{employee.durationOfLeave}</Td>
                                    <Td>{employee.leaveBalance}</Td>
                                    <Td>
                                        <Text>
                                            {moment(employee.created).format(
                                                "YYYY-MM-DD"
                                            )}
                                        </Text>
                                    </Td>
                                    <Td>
                                        <Text color="muted">
                                            {employee.leaveType}
                                        </Text>
                                    </Td>
                                    <Td>
                                        <Text color="muted">
                                            {employee.leaveReason}
                                        </Text>
                                    </Td>
                                    <Td>
                                        <Text color="muted">
                                            {employee.leaveRequestStatus}
                                        </Text>
                                    </Td>
                                    <Td>
                                        <Text color="muted">
                                            {
                                                employee.leaveRequestDecisionComment
                                            }
                                        </Text>
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
        </>
    );
};
export default LeaveTableAllActioned;
