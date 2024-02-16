// PayrollTable.js

import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaCog } from "react-icons/fa";

const PayrollTable = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPayNumber, setSelectedPayNumber] = useState(null);

  const handleSettingsClick = (payNumber) => {
    setSelectedPayNumber(payNumber);
    onOpen();
  };
  const samplePayrollData = [
    {
      employee: "John Doe",
      regularHours: 40,
      overtimePay: 10,
      vacationPay: 8,
      bonusPay: 5,
      medical: 20,
    },
    {
      employee: "Jane Doe",
      regularHours: 35,
      overtimePay: 5,
      vacationPay: 10,
      bonusPay: 3,
      medical: 15,
    },
  ];
  return (
    <>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th></Th>
            <Th>
              <Button
                onClick={() => navigate("/generate-payrun")}
                colorScheme="teal"
                size="sm"
                ml="2"
              >
                Regular Payrun
              </Button>
            </Th>
            <Th>
              <Button
                onClick={() => navigate("/add-payrun")}
                colorScheme="teal"
                size="sm"
                ml="2"
              >
                Extra Payrun
              </Button>
            </Th>
          </Tr>
        </Thead>
        <Tbody></Tbody>
      </Table>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Action</Th>
            <Th>Pay Number</Th>
            <Th>Pay Date</Th>
            <Th>Pay Period</Th>
            <Th>Bill</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>
              <Button size="sm" colorScheme="teal">
                Pay Now
              </Button>
            </Td>
            <Td>
              Pay Number 1
              <Button
                size="sm"
                colorScheme="teal"
                variant="ghost"
                ml="2"
                onClick={() => handleSettingsClick("Pay Number 1")}
              >
                <Icon as={FaCog} />
              </Button>
            </Td>
            <Td>Pay Date 1</Td>
            <Td>Pay Period 1</Td>
            <Td>Bill 1</Td>
            <Td>Status 1</Td>
          </Tr>
          <Tr>
            <Td>
              <Button size="sm" colorScheme="teal" mt="2">
                View
              </Button>
            </Td>
            <Td>
              Pay Number 2
              <Button
                size="sm"
                colorScheme="teal"
                variant="ghost"
                ml="2"
                onClick={() => handleSettingsClick("Pay Number 2")}
              >
                <Icon as={FaCog} />
              </Button>
            </Td>
            <Td>Pay Date 2</Td>
            <Td>Pay Period 2</Td>
            <Td>Bill 2</Td>
            <Td>Status 2</Td>
          </Tr>
        </Tbody>
      </Table>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Payroll Table Dialog</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Employee</Th>
                  <Th>Regular Hours</Th>
                  <Th>Overtime Pay</Th>
                  <Th>Vacation Pay</Th>
                  <Th>Bonus Pay</Th>
                  <Th>Medical</Th>
                </Tr>
              </Thead>
              <Tbody>
                {samplePayrollData.map((row, index) => (
                  <Tr key={index}>
                    <Td>{row.employee}</Td>
                    <Td>{row.regularHours}</Td>
                    <Td>{row.overtimePay}</Td>
                    <Td>{row.vacationPay}</Td>
                    <Td>{row.bonusPay}</Td>
                    <Td>{row.medical}</Td>
                  </Tr>
                ))}
                <Tr>
                  <Td>Total</Td>
                  <Td>
                    {samplePayrollData.reduce(
                      (sum, row) => sum + row.regularHours,
                      0
                    )}
                  </Td>
                  <Td>
                    {samplePayrollData.reduce(
                      (sum, row) => sum + row.overtimePay,
                      0
                    )}
                  </Td>
                  <Td>
                    {samplePayrollData.reduce(
                      (sum, row) => sum + row.vacationPay,
                      0
                    )}
                  </Td>
                  <Td>
                    {samplePayrollData.reduce(
                      (sum, row) => sum + row.bonusPay,
                      0
                    )}
                  </Td>
                  <Td>
                    {samplePayrollData.reduce(
                      (sum, row) => sum + row.medical,
                      0
                    )}
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PayrollTable;
