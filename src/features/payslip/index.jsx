import {
  Flex,
  Heading,
  IconButton,
  SimpleGrid,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { Card, UserStat } from "components";
import { useAuthContext } from "hooks/useAuthContext";
import { DashboardLayout, ProfileContainer } from "layouts";
import moment from "moment";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { BsCalendar2Week } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";
import * as api from "services";
import { userCurrency } from "utils";
import PayslipTable from "./PayslipTable";

function PayslipWidget() {
  const { user } = useAuthContext();
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
    deductions.unshift(34, 0, 0, 0, 0);
    netSalary.unshift(34, 0, 0, 0, 0);
    grossSalary.unshift(34, 0, 0, 0, 0);
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

  const [totalNet, setTotalNet] = useState(0);
  const [gross, setGross] = useState(0);
  const [payDate, setPayDate] = useState(null);
  const fetchPayslip = async (token) => {
    let response = await api.getPayslip(token);
    response.data.forEach((item) => {
      setTotalNet((prev) => (prev += item.netSalary));
      setPayDate(new Date(item.paymentDate).toDateString());
      setGross((prev) => (prev += item.grossIncomePerPayPeriod));
    });
    let graphResult = await api.getPayslipByCategory(user.token);
    setGraph(graphResult.data.data);
    setData(response.data);
  };
  useEffect(() => {
    fetchPayslip(user.token);
  }, []);
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
  const [filter, setFilter] = useState(null);
  const [create, setCreate] = useState(null);
  const generatePayslip = () => {
    setCreate(true);
    onOpen();
  };
  const applyFilter = () => {
    setFilter(true);
    onOpen();
  };
  const dismiss = () => {
    setCreate(false);
    setFilter(false);
    onClose();
  };
  return (
    <DashboardLayout>
      <ProfileContainer>
        <Stack spacing="3">
          <Heading size="xs">
            Payslip
            <IconButton
              onClick={applyFilter}
              icon={<FiFilter fontSize="1.5rem" />}
              variant="ghost"
              aria-label="Edit employee"
            />
          </Heading>
          <SimpleGrid columns={2} gap={0}>
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
          </Flex>
          {data && <PayslipTable user={user?.user} payslips={data} />}
        </Stack>
      </ProfileContainer>
    </DashboardLayout>
  );
}

export default PayslipWidget;
