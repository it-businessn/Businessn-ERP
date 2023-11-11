import { Flex, SimpleGrid } from "@chakra-ui/react";
import "react-calendar/dist/Calendar.css";
import { Doughnut } from "react-chartjs-2";
import { FiDollarSign, FiUsers } from "react-icons/fi";
import { TbPointerDollar } from "react-icons/tb";

import { Card, Stat } from "components";
import { useAuthContext } from "hooks/useAuthContext";
import { LandingPageLayout, NotificationBox } from "layouts";
import { useEffect, useState } from "react";
import * as api from "services";
import AreaChart from "./charts/AreaChart";
import BarChart1 from "./charts/BarChart1";
import DoughnutChart from "./charts/DoughnutChart";
import HalfDoughnutChart from "./charts/HalfDoughnutChart";
import LineChart from "./charts/LineChart";
import PieChart from "./charts/PieChart";
import fakedata from "./fakedata.json";

const Dashboard = () => {
  const { user } = useAuthContext();
  const [empData, setEmpData] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      const employees = await api.getDashboardSummary(user.token);
      setEmpData(employees.data);
    };
    fetchEmployees();
  }, []);

  const stats = [
    {
      icon: FiUsers,
      label: "Total Employees",
      value: empData?.totalEmployees,
      delta: {
        // value: empData?.totalEmployees,
        // isUpwardsTrend: true,
      },
    },
    {
      icon: FiDollarSign,
      label: "Gross Salary", //sum basicSalary
      value: "$59.00",
      delta: {
        // value: "2.3%",
        // isUpwardsTrend: true,
      },
    },
    {
      icon: TbPointerDollar,
      label: "Payrolls Expense",
      value: "30",
      delta: {
        // value: "0.1%",
        // isUpwardsTrend: false,
      },
    },
    {
      icon: TbPointerDollar,
      label: "Payrolls Processed",
      value: "30",
      delta: {
        // value: "0.1%",
        // isUpwardsTrend: false,
      },
    },
    {
      icon: TbPointerDollar,
      label: "Working Hours", //total and average
      value: "30",
      delta: {
        // value: "0.1%",
        // isUpwardsTrend: false,
      },
    },
    {
      icon: TbPointerDollar,
      label: "Overtime Hours",
      value: "30",
      delta: {
        // value: "0.1%",
        // isUpwardsTrend: false,
      },
    },
    {
      icon: TbPointerDollar,
      label: "Total Deductions ",
      value: "30",
      delta: {
        // value: "0.1%",
        // isUpwardsTrend: false,
      },
    },
    {
      icon: TbPointerDollar,
      label: "Net Salary ",
      value: "30",
      delta: {
        // value: "0.1%",
        // isUpwardsTrend: false,
      },
    },
  ];
  let data = fakedata;
  const labels1 = ["Employee", "Administrator", "Super Manager", "HR/Manager"];
  return (
    <LandingPageLayout
      headerTitle="Summary"
      content={
        <>
          <Flex flexDir="column">
            <SimpleGrid mr="1.25em" columns={4} height="fit-content" gap={5}>
              {empData &&
                stats.map((stat, id) => <Stat key={stat.label} {...stat} />)}
            </SimpleGrid>
            <SimpleGrid mt="1.25em" mr="1.25em" columns={2} gap={5}>
              <Card>{data && <LineChart data1={data} />}</Card>
              <Card>
                {empData && (
                  <BarChart1
                    title="Payroll Summary by department"
                    employee={empData}
                    legend="Number of Employees"
                  />
                )}
              </Card>
            </SimpleGrid>
            <SimpleGrid
              mt="1.25em"
              mr="1.25em"
              columns={3}
              height="fit-content"
              gap={5}
            >
              <Card>
                <PieChart
                  labels={["Active", "Non-active"]}
                  dataValue={[12, 19]}
                  textTitle="% of Employees"
                  title="Employees By Department"
                />
              </Card>
              <Card>
                <DoughnutChart
                  datalist={[20, 20, 60, 30]}
                  text="Employees By Role"
                  labels={labels1}
                  title="# of Users"
                />
              </Card>
              <Card>
                <HalfDoughnutChart
                  text="% of Attendance"
                  label="Revenue per User"
                  datalist={[20, 20, 60, 30]}
                />
              </Card>
              <Card>
                {empData && (
                  <BarChart1
                    title="Employees joined"
                    employee={empData}
                    legend="Number of Employees"
                  />
                )}
              </Card>
              <Card>
                <AreaChart />
              </Card>

              <Card>
                {/* leaveTypesUtilized */}
                <Doughnut
                  options={{
                    responsive: true,
                    type: "doughnut",
                    data: data,
                    plugins: {
                      legend: { display: false },
                      title: {
                        display: true,
                        text: "Accrued Leaves(in days)",
                      },
                    },
                  }}
                  data={{
                    labels: [
                      "Sick leave",
                      "Casual leave",
                      "Public holiday",
                      "Religious holiday",
                      "Maternity leave",
                      "Paternity leave",
                      "Bereavement leave",
                      "Compensatory leave",
                      "Sabbatical leave",
                      "Unpaid leave",
                    ],
                    datasets: [
                      {
                        label: "Number of days:",
                        data: [1, 2, 1, 1, 3, 1, 1, 1, 1, 2],
                        backgroundColor: [
                          "#94C973",
                          "#A6E8BB",
                          "#05A63A",
                          "#A1F7A1",
                          "#3D550C",
                          "#81B622",
                          "#ECF87F",
                        ],
                        hoverOffset: 4,
                      },
                    ],
                  }}
                />
              </Card>
            </SimpleGrid>
          </Flex>
          <NotificationBox />
        </>
      }
    />
  );
};

export default Dashboard;
