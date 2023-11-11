import { Stack, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import "features/sidebar/Sidebar.css";
import moment from "moment";
import { userCurrency } from "utils";

function Payroll({ record }) {
  return (
    <Stack spacing={8}>
      <Table marginTop="1em" variant="simple" size="sm">
        <Tbody>
          <Tr>
            <Td>Employee Name</Td>
            <Td>{record.name}</Td>
            <Td>Pay date</Td>
            <Td>{moment(record.nextPayDate).format("YYYY-MM-DD")}</Td>
          </Tr>
          <Tr>
            <Td>Date of Joining</Td>
            <Td>{moment(record.dateOfJoining).format("YYYY-MM-DD")}</Td>
            <Td>Pay period</Td>
            <Td>
              {moment(record.lastPayDate).format("YYYY/MM/DD")} -
              {moment(record.nextPayDate).format("YYYY/MM/DD")}
            </Td>
          </Tr>
          <Tr>
            <Td>Worked Days</Td>
            <Td>24</Td>
            <Td>Designation</Td>
            <Td>{record.role}</Td>
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
            <Td></Td>
            <Td>{userCurrency(record.currency).format(0)}</Td>
          </Tr>
          <Tr>
            <Td>Incentive Pay</Td>
            <Td></Td>
            <Td>{userCurrency(record.currency).format(0)}</Td>
          </Tr>
          <Tr>
            <Td>Allowance</Td>
            <Td></Td>
            <Td>{userCurrency(record.currency).format(400)}</Td>
          </Tr>

          <Tr>
            <Td></Td>
            <Td textAlign="right">Total Earnings</Td>
            <Td>{userCurrency(record.currency).format(record.gross)}</Td>
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
            <Td>EPF</Td>
            <Td></Td>
            <Td>{userCurrency(record.currency).format(200)}</Td>
          </Tr>
          <Tr>
            <Td>Federal Tax</Td>
            <Td></Td>
            <Td>{userCurrency(record.currency).format(200)}</Td>
          </Tr>
          <Tr>
            <Td>Professional Tax</Td>
            <Td></Td>
            <Td>{userCurrency(record.currency).format(80)}</Td>
          </Tr>
          <Tr>
            <Td></Td>
            <Td textAlign="right">Total Deductions</Td>
            <Td>{userCurrency(record.currency).format(12)}</Td>
          </Tr>
          <Tr>
            <Td></Td>
            <Td textAlign="right">Net Pay</Td>
            <Td>{userCurrency(record.currency).format(record.netPay)}</Td>
          </Tr>
        </Tbody>
      </Table>
    </Stack>
  );
}

export default Payroll;
