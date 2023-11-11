import { Stack, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import moment from "moment";
import { userCurrency } from "utils";
import "../sidebar/Sidebar.css";

function CalcPayroll({ user, record }) {
  console.log(record, user);
  return (
    <Stack spacing={8}>
      <Table marginTop="1em" variant="simple" size="sm">
        <Tbody>
          <Tr>
            <Td>Employee Name</Td>
            <Td>
              {user.firstName} {user.lastName}
            </Td>
            <Td>Pay date</Td>
            {/* <Td>{moment(user.nextPayDate).format("YYYY-MM-DD")}</Td> */}
          </Tr>
          <Tr>
            <Td>Date of Joining</Td>
            <Td>{moment(user.dateOfJoining).format("YYYY-MM-DD")}</Td>
            <Td>Pay period</Td>
            <Td>
              {moment(record.updatedAt).format("YYYY/MM/DD")} -
              {moment(record.createdAt).format("YYYY/MM/DD")}
            </Td>
          </Tr>
          <Tr>
            <Td>Worked Days</Td>
            <Td>24</Td>
            <Td>Designation</Td>
            <Td>{user.role}</Td>
          </Tr>
        </Tbody>
      </Table>
      <Table variant="striped" size="sm">
        <Thead>
          <Tr>
            <Th></Th>
            <Th fontSize="md" fontWeight="bold">
              Description
            </Th>
            <Th fontSize="md">Sub-amounts</Th>
            <Th fontSize="md" fontWeight="bold">
              Amount
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>1</Td>
            <Td>Gross remuneration for the pay period </Td>
            <Td></Td>
            <Td>{userCurrency("CAD").format(record.grossSalaryByPayPeriod)}</Td>
          </Tr>
          <Tr>
            <Td>2</Td>
            <Td>
              Minus - <br />◼ CPP additional contribution
            </Td>
            <Td>
              <br />
              {record.CPPAdditionalContribution.toFixed(2)}
            </Td>
            <Td color={"red"}>
              <br />
              {userCurrency("CAD").format(record.CPPAdditionalContribution)}
            </Td>
          </Tr>
          <Tr>
            <Td>3</Td>
            <Td>Net remuneration for the pay period (line 1 minus line 2)</Td>
            <Td></Td>
            <Td>{userCurrency("CAD").format(record.netRemuneration)}</Td>
          </Tr>
          <Tr>
            <Td>4</Td>
            <Td>Annual net income</Td>
            <Td></Td>
            <Td>{userCurrency("CAD").format(record.annualNetIncome)}</Td>
          </Tr>
          <Tr>
            <Td>5</Td>
            <Td>
              Minus - <br />
              the annual deduction for living in a prescribed zone reported on
              the federal Form TD1
            </Td>
            <Td></Td>
            <Td color={"red"}>
              {userCurrency("CAD").format(record.zoneDeduction)}
            </Td>
          </Tr>
          <Tr>
            <Td>6</Td>
            <Td>Annual taxable income (line 4 minus line 5)</Td>
            <Td></Td>
            <Td>{userCurrency("CAD").format(record.annualTaxableIncome)}</Td>
          </Tr>
          <Tr>
            <Td colSpan={4}>
              <Text fontSize="md" fontWeight="bold">
                Federal tax Details
              </Text>
            </Td>
          </Tr>
          <Tr>
            <Td>7</Td>
            <Td>Multiply the amount on line 6 by the federal tax rate</Td>
            <Td>
              {record.annualTaxableIncome}
              <br />×{record.federalTaxRate}
            </Td>
            <Td>{userCurrency("CAD").format(record.federalTax)}</Td>
          </Tr>
          <Tr>
            <Td>8</Td>
            <Td>
              Minus - <br />
              the federal constant based on the annual taxable income on line 6
            </Td>
            <Td></Td>
            <Td color="red">
              {userCurrency("CAD").format(record.federalTaxConstantRate)}
            </Td>
          </Tr>
          <Tr>
            <Td>9</Td>
            <Td>Federal tax (line 7 minus line 8)</Td>
            <Td></Td>
            <Td>{userCurrency("CAD").format(record.federalTax)}</Td>
          </Tr>
          <Tr>
            <Td>10</Td>
            <Td>
              Minus the federal tax credits - <br />
              <br />
              ◼ the total of personal tax credit amounts reported on the federal
              Form TD1
              <br />
              ◼ the CPP contributions for the pay period multiplied by the
              number of pay periods in the year
              <br />◼ the EI premiums for the pay period multiplied by the
              number of pay periods in the year
              <br />◼ the Canada employment amount
              <br />
              Total
            </Td>
            <Td>
              {userCurrency("CAD").format(record.federalClaim)}
              <br />
              {userCurrency("CAD").format(record.CPPByPayPeriodMax)}
              <br />
              <br />
              <br />
              <br />
              {userCurrency("CAD").format(record.EIByPayPeriodMax)}
              <br />
              <br />
              <br />
              {userCurrency("CAD").format(record.MAX_CANADA_EMP_CREDIT)}
              <br />
              {userCurrency("CAD").format(record.totalFederalTaxCredits)}
            </Td>
            <Td></Td>
          </Tr>
          <Tr>
            <Td>11</Td>
            <Td>
              Multiply the total on line 10 by the lowest federal tax rate [for
              all income brackets] for the year.
            </Td>
            <Td>X {record.MIN_FEDERAL_TAX_RATE}</Td>
            <Td></Td>
          </Tr>
          <Tr>
            <Td>12</Td>
            <Td>Total federal tax credits</Td>
            <Td></Td>
            <Td color={"red"}>
              {userCurrency("CAD").format(record.totalFederalTaxCreditsRate)}
            </Td>
          </Tr>
          <Tr>
            <Td>13</Td>
            <Td>
              Total federal tax payable for the year (line 9 minus line 12)
            </Td>
            <Td></Td>
            <Td fontWeight="bold">
              {userCurrency("CAD").format(record.totalFederalTaxPayable)}
            </Td>
          </Tr>
          <Tr>
            <Td colSpan={4}>
              <Text fontSize="md" fontWeight="bold">
                Provincial tax Details
              </Text>
            </Td>
          </Tr>
          <Tr>
            <Td>14</Td>
            <Td>
              Basic provincial tax for British Columbia[line6*provincial tax
              rate]
            </Td>
            <Td>
              {userCurrency("CAD").format(record.annualTaxableIncome)} <br />X
              {record.provincialTaxRate}
            </Td>
            <Td></Td>
          </Tr>
          <Tr>
            <Td>15</Td>
            <Td>
              Minus the provincial constant based on the annual taxable income
              on line 6
            </Td>
            <Td>
              -{userCurrency("CAD").format(record.provincialTaxConstantRate)}
            </Td>
            <Td></Td>
          </Tr>
          <Tr>
            <Td>16</Td>
            <Td>
              Provincial tax on income for British Columbia (line 14 minus line
              15)
            </Td>
            <Td></Td>
            <Td>{userCurrency("CAD").format(record.provincialTax)}</Td>
          </Tr>
          <Tr>
            <Td>17</Td>
            <Td>
              Minus the provincial tax credits - <br />
              <br />
              ◼ the total of personal tax credit amounts reported on Form TD1BC
              <br />
              ◼ the CPP contributions for the pay period multiplied by the
              number of pay periods in the year
              <br />◼ the EI premiums for the pay period multiplied by the
              number of pay periods in the year
              <br />
              Total
            </Td>
            <Td>
              {userCurrency("CAD").format(record.provincialClaim)}
              <br />
              {userCurrency("CAD").format(record.CPPByPayPeriodMax)}
              <br />
              <br />
              {userCurrency("CAD").format(record.EIByPayPeriodMax)}
              <br />
              <br />
              {userCurrency("CAD").format(record.totalProvincialTaxCredits)}
            </Td>
            <Td></Td>
          </Tr>
          <Tr>
            <Td>18</Td>
            <Td>
              Multiply the total on line 17 by the lowest provincial tax rate
              for the year
            </Td>
            <Td>X {record.MIN_PROVINCIAL_TAX_RATE}</Td>
            <Td></Td>
          </Tr>
          <Tr>
            <Td>19</Td>
            <Td>Total provincial tax credits</Td>
            <Td></Td>
            <Td color={"red"}>
              {userCurrency("CAD").format(record.totalProvincialTaxCredits)}
            </Td>
          </Tr>
          <Tr>
            <Td>20</Td>
            <Td>
              Provincial tax payable before reduction (line 16 minus line 19)
            </Td>
            <Td></Td>
            <Td>
              {userCurrency("CAD").format(
                record.totalProvincialTaxPayableBeforeReduction
              )}
            </Td>
          </Tr>
          <Tr>
            <Td>21</Td>
            <Td>Minus the British Columbia tax reduction</Td>
            <Td></Td>
            <Td color={"red"}>
              {userCurrency("CAD").format(record.BCTaxReductionAmount)}
            </Td>
          </Tr>
          <Tr>
            <Td>22</Td>
            <Td>
              Total provincial tax payable for the year (line 20 minus line 21)
            </Td>
            <Td></Td>
            <Td>
              {userCurrency("CAD").format(
                record.totalProvincialTaxPayableAfterReduction
              )}
            </Td>
          </Tr>
          <Tr>
            <Td colSpan={4}>
              <Text fontSize="md" fontWeight="bold">
                Calculation of total tax and the tax deduction for the pay
                period
              </Text>
            </Td>
          </Tr>
          <Tr>
            <Td>23</Td>
            <Td>
              Total federal and provincial tax deductions for the year (line 13
              plus line 22). If the result is negative, substitute $0.
            </Td>
            <Td></Td>
            <Td>
              {userCurrency("CAD").format(
                record.totalFederalProvincialTaxDeduction
              )}
            </Td>
          </Tr>
          <Tr>
            <Td>24</Td>
            <Td>
              Tax deduction for the pay period: Divide the amount on line 23 by
              the number of pay periods in the year (52).
            </Td>
            <Td></Td>
            <Td>
              {userCurrency("CAD").format(record.taxDeductionByPayPeriod)}
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Stack>
  );
}

export default CalcPayroll;
