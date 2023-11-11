import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from "@chakra-ui/react";
import { Card } from "components";
import { userCurrency } from "utils";
import EmployeePayrollSummary from "./EmployeePayrollSummary";
const PayrollTable = ({ user, payrolls }) => {
  return (
    <>
      <Accordion allowMultiple={true} defaultIndex={[1, 3, 5, 7]}>
        {payrolls.map((payroll) => (
          <Card mb={5} key={payroll._id}>
            <AccordionItem>
              <Box as="p">
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    Employee Name: {payroll.employee.firstName}{" "}
                    {payroll.employee.lastName}
                  </Box>
                  <Box as="span" flex="1" textAlign="left">
                    Role: {payroll.employee.role}
                  </Box>
                  <Box as="span" flex="1" textAlign="left">
                    Net Remuneration:{" "}
                    {userCurrency("CAD").format(payroll.netRemuneration)}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </Box>

              <Box as="p">
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    Address:{" "}
                    {`${payroll.employee.address.streetNumber} ${payroll.employee.address.city}, ${payroll.employee.address.state}, ${payroll.employee.address.country}, ${payroll.employee.address.postalCode}`}
                  </Box>
                </AccordionButton>
              </Box>
              <AccordionPanel pb={4}>
                <EmployeePayrollSummary
                  user={payroll.employee}
                  payrollData={payroll}
                />
              </AccordionPanel>
            </AccordionItem>
          </Card>
        ))}
      </Accordion>
    </>
  );
};
export default PayrollTable;
