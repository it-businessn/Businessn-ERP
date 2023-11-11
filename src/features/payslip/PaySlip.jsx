import { Stack, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import moment from "moment";
import { userCurrency } from "utils";
import "../sidebar/Sidebar.css";

function PaySlip({ record, user }) {
  return (
    <Stack spacing={8}>
      <Table marginTop="1em" variant="simple" size="sm">
        <Tbody>
          <Tr>
            <Td>Employee Name</Td>
            <Td>{record.employeeName}</Td>
            <Td>Pay date</Td>
            <Td>{moment(record.paymentDate).format("YYYY-MM-DD")}</Td>
          </Tr>
          <Tr>
            {/* <Td>Date of Joining</Td>
            <Td>{moment(user.dateOfJoining).format("YYYY-MM-DD")}</Td> */}
            <Td>Pay period</Td>
            <Td colSpan={2}>
              {moment(record.paySlipPeriodStartDate).format("YYYY/MM/DD")} -{" "}
              {moment(record.paySlipPeriodEndDate).format("YYYY/MM/DD")}
            </Td>
          </Tr>
          <Tr>
            <Td>Worked Hours</Td>
            <Td>80</Td>
            <Td>Department</Td>
            <Td>{record.employeeDepartment}</Td>
          </Tr>
        </Tbody>
      </Table>
      <Table variant="striped" size="sm">
        <Thead>
          <Tr>
            <Th fontSize="md" fontWeight="bold">
              Earnings
            </Th>
            <Th></Th>
            <Th fontSize="md" fontWeight="bold">
              Amount
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Basic</Td>
            <Td style={{ width: "278px" }}></Td>
            <Td>{record.grossIncomePerPayPeriod.toFixed(2)}</Td>
          </Tr>
          {/* <Tr>
            <Td>Incentive Pay</Td>
            <Td></Td>
            <Td>{userCurrency("CAD").format(record.deductions)}</Td>
          </Tr>
          <Tr>
            <Td>Allowance</Td>
            <Td></Td>
            <Td>{userCurrency("CAD").format(record.netSalary)}</Td>
          </Tr> */}

          <Tr>
            <Td></Td>
            <Td textAlign="right">Total Earnings</Td>
            <Td>
              {userCurrency("CAD").format(record.grossIncomePerPayPeriod)}
            </Td>
          </Tr>
        </Tbody>
      </Table>
      <Table variant="striped" size="sm">
        <Thead>
          <Tr>
            <Th>
              <Text fontSize="md" fontWeight="bold">
                Deductions
              </Text>
            </Th>
            <Th></Th>
            <Th fontSize="md" fontWeight="bold">
              Amount
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Federal Tax</Td>
            <Td></Td>
            <Td> {(0.2 * record.deductions).toFixed(2)}</Td>
          </Tr>
          <Tr>
            <Td>Professional Tax</Td>
            <Td></Td>
            <Td> {(0.5 * record.deductions).toFixed(2)}</Td>
          </Tr>
          <Tr>
            <Td>EPF</Td>
            <Td></Td>
            <Td> {(0.3 * record.deductions).toFixed(2)}</Td>
          </Tr>
          <Tr>
            <Td></Td>
            <Td textAlign="right">Total Deductions</Td>
            <Td>{userCurrency("CAD").format(record.deductions)}</Td>
          </Tr>
          <Tr>
            <Td></Td>
            <Td textAlign="right">Net Pay</Td>
            <Td>{userCurrency("CAD").format(record.netSalary)}</Td>
          </Tr>
        </Tbody>
      </Table>
    </Stack>
  );
}

export default PaySlip;
