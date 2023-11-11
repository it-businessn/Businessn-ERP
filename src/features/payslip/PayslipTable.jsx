import {
  Box,
  Button,
  Center,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Heading,
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
import PaySlip from "./PaySlip";
const PayslipTable = ({ user, payslips }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const componentRef = useRef();
  const [record, setRecord] = useState(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  // if (user.role === USER_ROLE.EMPLOYEE) {
  //     payslips = payslips.filter((item) => item.email === user.email);
  // }
  const openDrawer = (payslip) => {
    setRecord(payslip);
    onOpen();
  };
  const [businessHeader, setBusinessHeader] = useState(null);
  return (
    <>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>
              <HStack spacing="3">
                <HStack spacing="1">
                  <Text>Start Date</Text>
                  <Icon as={IoArrowDown} color="muted" boxSize="4" />
                </HStack>
              </HStack>
            </Th>
            <Th>End Date</Th>
            <Th>Gross</Th>
            <Th>Deduction</Th>
            <Th>Net Pay</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {payslips.length > 0 ? (
            <>
              {payslips.map((payslip) => (
                <Tr key={payslip._id}>
                  <Td>
                    <HStack spacing="3">
                      <Box>
                        <Text fontWeight="medium">
                          {moment(payslip.paySlipPeriodStartDate).format(
                            "YYYY-MM-DD"
                          )}
                        </Text>
                      </Box>
                    </HStack>
                  </Td>
                  <Td>
                    {moment(payslip.paySlipPeriodEndDate).format("YYYY-MM-DD")}
                  </Td>
                  <Td>
                    <Text color="muted">
                      {userCurrency("CAD").format(
                        payslip.grossIncomePerPayPeriod
                      )}
                    </Text>
                  </Td>
                  <Td>
                    <Text color="muted">
                      {userCurrency("CAD").format(payslip.deductions)}
                    </Text>
                  </Td>
                  <Td>
                    <Text color="muted">
                      {userCurrency("CAD").format(payslip.netSalary)}
                    </Text>
                  </Td>
                  <Td>
                    <Button onClick={() => openDrawer(payslip)} variant="link">
                      View Details
                    </Button>
                    {/* <Button
                                            onClick={() => openDrawer(payslip)}
                                            variant="link"
                                        >
                                            Generate Payslip
                                        </Button> */}
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
      <Drawer
        isOpen={isOpen}
        onClose={() => {
          setBusinessHeader(false);
          onClose();
        }}
        size="lg"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody ref={componentRef}>
            <DrawerHeader>
              <Heading size="sm" textAlign="center">
                PaySlip
                {businessHeader && (
                  <Box
                    position="relative"
                    fontSize="initial"
                    lineHeight="1.25rem"
                  >
                    <Center mt={2}>BusinessN Inc</Center>
                    <Center>5 Washington Square</Center>
                    <Center> New York, USA</Center>
                    <Center>UA-189878</Center>
                  </Box>
                )}
                {!businessHeader && (
                  <Text fontSize="md" color="fg.muted">
                    View a summary of all your paystub details
                  </Text>
                )}
              </Heading>
            </DrawerHeader>
            <Divider />
            {record && <PaySlip record={record} user={user} />}
          </DrawerBody>
          <DrawerFooter>
            <Button
              variant="primary"
              onClick={() => {
                setBusinessHeader(true);
                setTimeout(() => handlePrint(), 1000);
              }}
            >
              Print
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
export default PayslipTable;
