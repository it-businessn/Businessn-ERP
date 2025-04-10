import { Box, Stack } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import EarningsTable from "../statement/EarningsTable";
import {
	DEDUCTION_TYPES,
	DEDUCTIONS_COLS,
	EARNINGS_COLS,
	EARNINGS_TYPES,
	HeaderTable,
	NET_SUMMARY,
	NET_SUMMARY_COLS,
} from "./data";

const EmployeePayDetails = ({ data, isMobile }) => (
	<Stack position="relative" flex={isMobile ? 1 : 0.9} w={isMobile && "100%"}>
		<BoxCard bg={"var(--main_color)"} p={1}>
			<HeaderTable title1="Earnings" title2="Current" title3="Year to Date" />

			<EarningsTable
				isMobile={isMobile}
				cols={EARNINGS_COLS}
				rows={EARNINGS_TYPES}
				data={data}
				isEarning
				colBg="var(--main_color)"
			/>
			<Box mt={2} />
			<EarningsTable
				isMobile={isMobile}
				cols={DEDUCTIONS_COLS}
				rows={DEDUCTION_TYPES}
				data={data}
			/>
			<Box mt={2} />
			<EarningsTable
				isMobile={isMobile}
				isNetSummary
				cols={NET_SUMMARY_COLS}
				rows={NET_SUMMARY}
				data={data}
			/>
		</BoxCard>
	</Stack>
);

export default EmployeePayDetails;
