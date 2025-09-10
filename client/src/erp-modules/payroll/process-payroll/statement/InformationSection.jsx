import { Stack, Tbody } from "@chakra-ui/react";
import TableLayout from "components/ui/table/TableLayout";
import React from "react";
import { roundUpNumber } from "utils/convertAmt";
import ItemRow from "../preview-reports/ItemRow";
import { SUM_TOTALS } from "../preview-reports/data";

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
				{items?.map((lineItem) => {
					const { name, rate, totalHours, currentTotal, YTDTotal } = lineItem;

					lineItem.isTotals = SUM_TOTALS.find((_) => name.includes(_));
					lineItem.rate = roundUpNumber(data[rate]);
					lineItem.totalHours = roundUpNumber(data[totalHours]);
					lineItem.currentTotal = roundUpNumber(data[currentTotal]);
					lineItem.YTDTotal = roundUpNumber(data[YTDTotal]);

					lineItem.isValid =
						lineItem.YTDTotal >= 0 ||
						name.includes("CPP") ||
						name.includes("Vacation") ||
						name.includes("Balance") ||
						name.includes("Benefits");

					return (
						<React.Fragment key={name}>
							{lineItem.isValid && (
								<ItemRow
									isTotals={lineItem.isTotals}
									title={name}
									isInfo
									isEarning={false}
									rate={lineItem.rate}
									totalHours={lineItem.totalHours}
									currentTotal={lineItem.currentTotal}
									YTDTotal={lineItem.YTDTotal}
								/>
							)}
						</React.Fragment>
					);
				})}
			</Tbody>
		</TableLayout>
	</Stack>
);

export default InformationSection;
