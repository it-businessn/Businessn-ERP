import { Stack, Tbody } from "@chakra-ui/react";
import TableLayout from "components/ui/table/TableLayout";
import React from "react";
import ItemRow from "../preview-reports/ItemRow";

const InformationSection = ({ type, items, data }) => (
	<Stack w={"100%"} mt={2}>
		<TableLayout
			textSize="xs"
			bg="var(--main_color)"
			tableSize="xs"
			w={"100%"}
			isInfo
			cols={[type, "Current Total", "YTD Totals"]}
			whiteSpace="wrap"
			width1="8em"
			width2="8em"
			width3="6em"
		>
			<Tbody>
				{items?.map(({ name, rate, totalHours, currentTotal, YTDTotal }) => (
					<React.Fragment key={name}>
						{(data[YTDTotal] >= 0 ||
							name.includes("CPP") ||
							name.includes("Vacation") ||
							name.includes("Balance") ||
							name.includes("Benefits")) && (
							<ItemRow
								title={name}
								isInfo
								isEarning={false}
								rate={data[rate] ?? 0}
								totalHours={data[totalHours] ?? 0}
								currentTotal={data[currentTotal] ?? 0}
								YTDTotal={data[YTDTotal] ?? 0}
							/>
						)}
					</React.Fragment>
				))}
			</Tbody>
		</TableLayout>
	</Stack>
);

export default InformationSection;
