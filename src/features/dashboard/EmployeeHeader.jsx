import { SimpleGrid } from "@chakra-ui/react";
import { UserStat } from "components";
import { FiDollarSign, FiSend } from "react-icons/fi";
const empStats = [
    {
        icon: FiDollarSign,
        label: "Gross Salary Paid",
        value: "$3456.33",
        period: "Feb 12 - Feb 28",
    },
    {
        icon: FiDollarSign,
        label: "Net Salary ",
        value: "$2000.90",
        period: "Feb 12 - Feb 28",
    },
    {
        icon: FiSend,
        label: "Payrolls Processed",
        value: "12",
        period: "Feb 12 - Feb 28",
    },
    {
        icon: FiDollarSign,
        label: "Total Taxes Paid",
        value: "$3456.33",
    },
    {
        icon: FiDollarSign,
        label: "Total CPP Paid",
        value: "$2000.90",
    },
    {
        icon: FiSend,
        label: "Total EI Paid",
        value: "$2000.90",
    },
    {
        icon: FiDollarSign,
        label: "Next Pay Date",
        value: "Jul 12, 2023",
        delta: {
            text1: "Gross: $2000.90",
            text2: "Net: $3456.33",
        },
    },
    {
        icon: FiDollarSign,
        label: "Last Pay Date",
        value: "Jun 12, 2023",
        delta: {
            text1: "Gross: $2000.90",
            text2: "Net: $3456.33",
        },
    },
    {
        icon: FiSend,
        label: "Used Vacation in Days",
        value: "12",
        range: 50,
    },
    {
        icon: FiSend,
        label: "Accrued Leaves",
        value: "12",
        range: 25,
    },
    {
        icon: FiSend,
        label: " Leave Balance",
        value: "12",
        delta: { link: "Raise New  Leave Request", to: "/" },
    },
    {
        icon: FiSend,
        label: " Sick Leave Balance",
        value: "12",
        delta: { link: "Raise New Sick Leave Request", to: "/" },
    },
];
const EmployeeHeader = () => (
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
        {empStats.map((stat, id) => (
            <UserStat key={id} {...stat} />
        ))}
    </SimpleGrid>
);
export default EmployeeHeader;
