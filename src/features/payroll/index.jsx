import {
  Button,
  Card,
  Flex,
  Heading,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { UserStat } from "components";
import { DashboardLayout, ProfileContainer } from "layouts";
import moment from "moment";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { BsCalendar2Week } from "react-icons/bs";
import * as api from "services";
import { userCurrency } from "utils";
import PayrollTable from "./PayrollTable";
import { TOAST } from "config/constant";

function PayrollWidget() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState(null);
  const [graph, setGraph] = useState(null);
  let deductions = [];
  let netSalary = [];
  let grossSalary = [];
  if (graph && graph.length) {
    graph.forEach((graphData) => {
      deductions.push(graphData.totalDeductions);
      netSalary.push(graphData.totalNetPay);
      grossSalary.push(graphData.totalGross);
    });
    // deductions.unshift(34, 0, 0, 0, 0);
    // netSalary.unshift(34, 0, 0, 0, 0);
    // grossSalary.unshift(34, 0, 0, 0, 0);
  }
  const barChartData = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Total Deductions",
        backgroundColor: "#B1D8B7",
        data: deductions,
      },
      {
        label: "Total Gross",
        backgroundColor: "#2F5233",
        data: grossSalary,
      },
      {
        label: "Net Pay",
        backgroundColor: "#76B947",
        data: netSalary,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Net Pay Issued",
      },
      labels: { display: true },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };
  useEffect(() => {
    fetchPayroll();
  }, []);
  const [totalNet, setTotaLNet] = useState(0);
  const [payDate, setPayDate] = useState(null);
  const [gross, setGross] = useState(0);
  const [payPeriodStart, setPayPeriodStart] = useState(null);
  const [payPeriodEnd, setPayPeriodEnd] = useState(null);
  const fetchPayroll = async () => {
    try {
      let result = await api.getPayroll(user.token);
      result.data.forEach((record) => {
        setTotaLNet((prev) => (prev += record.netPay));
        setGross((prev) => (prev += record.grossIncomePerPayPeriod));
        setPayDate(new Date(record.paymentDate).toDateString());
        setPayPeriodStart(
          new Date(record.payrollPeriodStartDate).toDateString()
        );
        setPayPeriodEnd(new Date(record.payrollPeriodEndDate).toDateString());
      });
      let graphResult = await api.getPayrollByCategory(user.token);
      setGraph(graphResult.data.data);
      setData(result.data);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  let stats = [
    // {
    //     icon: BsCalendar2Week,
    //     label: "Total Payslips Issued",
    //     value: "3",
    //     delta: {
    //         value: "Jul 12, 2023",
    //         value2: "- Jul 12, 2023",
    //     },
    // },
    {
      icon: BsCalendar2Week,
      label: "Total Amount issued",
      value: userCurrency("CAD").format(totalNet),
      delta: {
        value: ` ${moment(new Date("2023-10-17")).format("YYYY/MM/DD")} - 
        ${moment(new Date("2023-10-30")).format("YYYY/MM/DD")}`,
        value2: "",
      },
    },
    {
      icon: BsCalendar2Week,
      label: "Next Pay Date",
      value: payDate,
      delta: {
        value: `Gross: ${userCurrency("CAD").format(gross)}`,
        value2: `Net: ${userCurrency("CAD").format(totalNet)}`,
      },
    },
  ];
  const toast = useToast();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const generatePayslip = await api.generatePayslip(data, user.token);
      if (generatePayslip.statusText === "OK") {
        toast({
          title: "Payslips generated successfully",
          status: "success",
          isClosable: true,
        });
      }
    } catch (error) {
      toast(TOAST.ERROR);
      // setError(error.response.data.error);
      console.log(error);
    }
  };
  return (
    <DashboardLayout>
      <ProfileContainer>
        <Stack spacing="3">
          <Flex>
            <Heading size="xs">
              Payroll
              {/* <IconButton
                onClick={onOpen}
                icon={<FiFilter fontSize="1.5rem" />}
                variant="ghost"
                aria-label="Edit employee"
              /> */}
            </Heading>
            <Spacer />
            <Text>View Report</Text>
          </Flex>
          <SimpleGrid columns={2} gap={5}>
            <Card>
              <Bar options={options} data={barChartData} />
            </Card>
            <Flex justifyContent="space-evenly" flexDirection="row">
              {stats.map((stat, id) => (
                <UserStat key={stat.label} {...stat} />
              ))}
            </Flex>
          </SimpleGrid>
          <Flex>
            <Heading size="xxs">Summary</Heading>
            <Spacer />
            <Button onClick={handleSubmit}>Generate Payslip</Button>
          </Flex>
          {data && <PayrollTable user={user?.user} payrollData={data} />}
        </Stack>
      </ProfileContainer>
    </DashboardLayout>
  );
}

export default PayrollWidget;
