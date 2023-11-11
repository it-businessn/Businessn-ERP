import { Flex, Stack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import moment from "moment";
import { userCurrency } from "utils";
import "../sidebar/Sidebar.css";

function EmployeePayrollSummary({ user, payrollData }) {
  return (
    <Stack>
      <Table size="sm">
        <Tbody>
          <Tr>
            <Td as="strong">Department:</Td>
            <Td>{user.department}</Td>
            <Td as="strong">Start:</Td>
            <Td>{moment(user.dateOfJoining).format("YYYY-MM-DD")}</Td>
            <Td as="strong">Ins. Hrs:</Td>
            <Td>80</Td>
            <Td as="strong">F-TD1:</Td>
            <Td>{payrollData.federalClaim}</Td>
            <Td as="strong">P-TD1:</Td>
            <Td>{payrollData.provincialClaim}</Td>
          </Tr>

          <Tr>
            <Td as="strong">Amount</Td>
            <Td>
              {(
                payrollData.grossSalaryByPayPeriod -
                (payrollData.taxDeductionByPayPeriod +
                  payrollData.CPPContribution +
                  payrollData.EIContribution)
              ).toFixed(2)}
            </Td>
          </Tr>
        </Tbody>
      </Table>
      <Flex>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th fontWeight="bold">Earning</Th>
              {/* <Th>Units</Th> */}
              {/* <Th>YTD Units</Th> */}
              <Th>Rate</Th>
              <Th>Current</Th>
              <Th>YTD</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Regular</Td>
              {/* <Td>49.19</Td> */}
              {/* <Td>40</Td> */}
              <Td>{payrollData.HOURLY_RATE.toFixed(2)}</Td>
              <Td>
                {userCurrency("CAD").format(payrollData.grossSalaryByPayPeriod)}
              </Td>
              <Td>
                {userCurrency("CAD").format(payrollData.grossSalaryByPayPeriod)}
              </Td>
            </Tr>
            <Tr>
              <Td>
                Stat Pay
                <br />
                @1.0
              </Td>
              {/* <Td></Td> */}
              <Td></Td>
              <Td></Td>
              <Td>{userCurrency("CAD").format(0)}</Td>
            </Tr>
            <Tr>
              <Td>
                Stat Pay
                <br />
                @1.5
              </Td>
              {/* <Td></Td> */}
              <Td></Td>
              <Td></Td>
              <Td>{userCurrency("CAD").format(0)}</Td>
            </Tr>
            {/* <Tr>
              <Td>
                Retro
                <br />
                Pay $
              </Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td>{userCurrency("CAD").format(285.79)}</Td>
            </Tr> */}
          </Tbody>
        </Table>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th fontWeight="bold">Deduction</Th>
              <Th></Th>
              <Th></Th>
              <Th>Current</Th>
              <Th></Th>
              <Th>YTD</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Federal Tax</Td>
              <Td></Td>
              <Td></Td>
              <Td>
                {userCurrency("CAD").format(
                  payrollData.taxDeductionByPayPeriod
                )}
              </Td>
              <Td></Td>
              <Td>
                {userCurrency("CAD").format(
                  payrollData.taxDeductionByPayPeriod
                )}
              </Td>
            </Tr>

            <Tr>
              <Td>CPP </Td>
              <Td></Td>
              <Td></Td>
              <Td>{userCurrency("CAD").format(payrollData.CPPContribution)}</Td>
              <Td></Td>
              <Td>{userCurrency("CAD").format(payrollData.CPPContribution)}</Td>
            </Tr>
            <Tr>
              <Td>EI </Td>
              <Td></Td>
              <Td></Td>
              <Td>{userCurrency("CAD").format(payrollData.EIContribution)}</Td>
              <Td></Td>
              <Td>{userCurrency("CAD").format(payrollData.EIContribution)}</Td>
            </Tr>
          </Tbody>
        </Table>
      </Flex>
      <Flex>
        <Table size="sm"></Table>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th fontWeight="bold">Accrual</Th>
              <Th>Units</Th>
              <Th>YTD Units</Th>
              <Th>Rate</Th>
              <Th>Current</Th>
              <Th>YTD</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Vacation Accr</Td>
              <Td></Td>
              <Td></Td>
              <Td>4.00</Td>
              <Td>{userCurrency("CAD").format(0)}</Td>
              <Td>{userCurrency("CAD").format(0)}</Td>
            </Tr>
          </Tbody>
        </Table>
      </Flex>
      <Flex>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th fontWeight="bold">Gross Pay</Th>
              <Th>Current</Th>
              <Th>YTD </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td></Td>
              <Td>
                {userCurrency("CAD").format(payrollData.grossSalaryByPayPeriod)}
              </Td>
              <Td>
                {userCurrency("CAD").format(payrollData.grossSalaryByPayPeriod)}
              </Td>
            </Tr>
          </Tbody>
        </Table>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th fontWeight="bold">Deductions</Th>
              <Th>Current</Th>
              <Th>YTD </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td></Td>
              <Td>
                {userCurrency("CAD").format(
                  payrollData.taxDeductionByPayPeriod +
                    payrollData.CPPContribution +
                    payrollData.EIContribution
                )}
              </Td>
              <Td>
                {userCurrency("CAD").format(
                  payrollData.taxDeductionByPayPeriod +
                    payrollData.CPPContribution +
                    payrollData.EIContribution
                )}
              </Td>
            </Tr>
          </Tbody>
        </Table>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th fontWeight="bold">Net Pay</Th>
              <Th>Current</Th>
              <Th>YTD </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td></Td>
              <Td>
                {userCurrency("CAD").format(
                  payrollData.grossSalaryByPayPeriod -
                    (payrollData.taxDeductionByPayPeriod +
                      payrollData.CPPContribution +
                      payrollData.EIContribution)
                )}
              </Td>
              <Td>
                {userCurrency("CAD").format(
                  payrollData.grossSalaryByPayPeriod -
                    (payrollData.taxDeductionByPayPeriod +
                      payrollData.CPPContribution +
                      payrollData.EIContribution)
                )}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Flex>
    </Stack>
  );
}

export default EmployeePayrollSummary;
