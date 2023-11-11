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
  useDisclosure,
} from "@chakra-ui/react";
import moment from "moment";
import { useRef, useState } from "react";
import { IoArrowDown } from "react-icons/io5";
import { useReactToPrint } from "react-to-print";
import { userCurrency } from "utils";
const PayrollTable = ({ user, payrollData }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const componentRef = useRef();
  const [record, setRecord] = useState(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  // if (user.role === USER_ROLE.EMPLOYEE) {
  //     payrollData = payrollData.filter((item) => item.email === user.email);
  // }
  return (
    <>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>
              <HStack spacing="3">
                <HStack spacing="1">
                  <Text>Start Pay Period</Text>
                  <Icon as={IoArrowDown} color="muted" boxSize="4" />
                </HStack>
              </HStack>
            </Th>
            <Th>End Pay Period</Th>
            <Th>Gross</Th>
            <Th>Deduction</Th>
            <Th>Net Pay</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {payrollData.length > 0 ? (
            <>
              {payrollData.map((payroll) => (
                <Tr key={payroll._id}>
                  <Td>
                    <HStack spacing="3">
                      <Box>
                        <Text fontWeight="medium">
                          {moment(payroll.payrollPeriodStartDate).format(
                            "YYYY-MM-DD"
                          )}
                        </Text>
                      </Box>
                    </HStack>
                  </Td>
                  <Td>
                    {moment(payroll.payrollPeriodEndDate).format("YYYY-MM-DD")}
                  </Td>
                  <Td>
                    <Text color="muted">
                      {userCurrency("CAD").format(
                        payroll.grossIncomePerPayPeriod
                      )}
                    </Text>
                  </Td>
                  <Td>
                    <Text color="muted">
                      {userCurrency("CAD").format(payroll.totalDeductions)}
                    </Text>
                  </Td>
                  <Td>
                    <Text color="muted">
                      {userCurrency("CAD").format(payroll.netPay)}
                    </Text>
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
    </>
  );
};
export default PayrollTable;
