import { Box, SimpleGrid } from "@chakra-ui/react";

import BoxCard from "components/ui/card";
import TextTitle from "components/ui/text/TextTitle";
import { EARNING_TABLE_COLS } from "erp-modules/payroll/workview/data";
import WorkviewTable from "erp-modules/payroll/workview/paygroup-header-table/WorkviewTable";
import usePaygroup from "hooks/usePaygroup";
import EmployeeTimeCard from "./EmployeeTimeCard";

const LeftPane = ({ selectedUser, setStats, company }) => {
	const { payGroupSchedule } = usePaygroup(company, false);
	const filteredPayPeriods = payGroupSchedule
		?.filter((_) => _.isProcessed)
		.sort(
			(a, b) => new Date(b.payPeriodPayDate) - new Date(a.payPeriodPayDate),
		);

	const handleClick = () => console.log("handleRegister");

	return (
		<Box>
			<SimpleGrid
				mb={"1em"}
				columns={{ base: 1 }}
				spacing="1em"
				color={"var(--menu_item_color)"}
			>
				<EmployeeTimeCard selectedUser={selectedUser} company={company} />
			</SimpleGrid>
			<SimpleGrid
				mb={"1em"}
				columns={{ base: 1, md: 1, lg: 2 }}
				spacing="1em"
				color={"var(--menu_item_color)"}
			>
				<BoxCard>
					<TextTitle title={"Earning Statement"} />
					<WorkviewTable
						isEarningTable
						cols={EARNING_TABLE_COLS}
						payGroupSchedule={filteredPayPeriods}
						height="30vh"
						viewLabel="View Paystub"
						handleRegister={handleClick}
					/>
				</BoxCard>
				<BoxCard>
					<TextTitle title="Year End Forms" />
				</BoxCard>
			</SimpleGrid>
		</Box>
	);
};

export default LeftPane;
