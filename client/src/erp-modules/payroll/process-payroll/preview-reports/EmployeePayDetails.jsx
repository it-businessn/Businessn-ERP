import { Stack, Tbody } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import React from "react";
import {
	DEDUCTION_TYPES,
	EARNINGS_COLS,
	EARNINGS_TYPES,
	HeaderTable,
	NET_SUMMARY,
} from "./data";
import InformationSection from "./InformationSection";
import ItemRow from "./ItemRow";

const EmployeePayDetails = ({ data }) => (
	<Stack position="relative" flex={1} spacing={0}>
		<BoxCard bg={"var(--main_color)"} p={1}>
			<TextTitle align={"center"} title={"Earnings Statement"} />
			<HeaderTable title1="Earnings" title2="Current" title3="Year to Date" />
			<TableLayout
				colBg="var(--main_color)"
				tableSize="xs"
				cols={EARNINGS_COLS}
				textSize="xs"
				bg={"var(--main_color)"}
				width1="6em"
				isEarning
				whiteSpace="wrap"
			>
				<Tbody>
					{EARNINGS_TYPES.map(
						({
							name,
							rate,
							totalHours,
							currentTotal,
							YTDTotal,
							YTDHoursTotal,
							isEarning,
						}) => (
							<React.Fragment key={name}>
								{(name === "Regular" ||
									data[YTDTotal] > 0 ||
									name.includes("Gross ")) && (
									<ItemRow
										title={name}
										isEarning={isEarning}
										rate={data[rate] ?? 0}
										totalHours={data[totalHours] ?? 0}
										currentTotal={data[currentTotal] ?? 0}
										YTDTotal={data[YTDTotal] ?? 0}
										YTDHoursTotal={data[YTDHoursTotal] ?? 0}
									/>
								)}
							</React.Fragment>
						),
					)}
				</Tbody>
			</TableLayout>
			<InformationSection
				type={"Deductions"}
				items={DEDUCTION_TYPES}
				data={data}
			/>
			<InformationSection type={"Net Pay"} items={NET_SUMMARY} data={data} />
		</BoxCard>
	</Stack>
);

export default EmployeePayDetails;
