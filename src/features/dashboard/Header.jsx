import { SimpleGrid } from "@chakra-ui/react";
import { Stat } from "components";
import { FiActivity, FiDollarSign, FiUsers } from "react-icons/fi";
const stats = [
    {
        icon: FiUsers,
        label: "Total Employees",
        value: "100",
        delta: {
            value: "320",
            isUpwardsTrend: true,
        },
    },
    {
        icon: FiDollarSign,
        label: "Avg. Salary",
        value: "56.87%",
        delta: {
            value: "2.3%",
            isUpwardsTrend: true,
        },
    },
    {
        icon: FiActivity,
        label: "Payrolls Processed",
        value: "12.87%",
        delta: {
            value: "0.1%",
            isUpwardsTrend: false,
        },
    },
];
const Header = () => (
    <SimpleGrid
        columns={{
            base: 1,
            md: 3,
        }}
        gap={{
            base: "5",
            md: "6",
        }}
    >
        {stats.map((stat, id) => (
            <Stat key={id} {...stat} />
        ))}
    </SimpleGrid>
);
export default Header;
