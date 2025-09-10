import { Tbody } from "@chakra-ui/react";
import TableLayout from "components/ui/table/TableLayout";
import React from "react";
import { roundUpNumber } from "utils/convertAmt";
import ItemRow from "../preview-reports/ItemRow";
import { SUM_TOTALS } from "../preview-reports/data";

const EarningsTable = ({ cols, rows, data, colBg, isNetSummary, isMobile }) => {
	return (
		<TableLayout
			colBg={colBg}
			tableSize="xs"
			cols={cols}
			textSize="xs"
			bg={"var(--main_color)"}
			width1={isMobile ? "auto" : "9em"}
			width2={isMobile ? "auto" : "80px"}
			width3={isMobile ? "auto" : "46px"}
			isEarning
			whiteSpace="wrap"
		>
			<Tbody>
				{rows.map((lineItem) => {
					const { isEarning, name, rate, totalHours, currentTotal, YTDTotal, YTDHoursTotal } =
						lineItem;

					lineItem.isTotals =
						(!isNetSummary && SUM_TOTALS.find((_) => name.includes(_))) ||
						(isNetSummary && name.includes("Net Pay")) ||
						name.includes("Gross Earnings") ||
						name.includes("Total Deductions");

					lineItem.rate = roundUpNumber(data[rate]);
					lineItem.totalHours = roundUpNumber(data[totalHours]);
					lineItem.currentTotal = roundUpNumber(data[currentTotal]);
					lineItem.YTDHoursTotal = roundUpNumber(data[YTDHoursTotal]);
					lineItem.YTDTotal = roundUpNumber(data[YTDTotal]);

					lineItem.isValid =
						!name.includes("Federal") &&
						!name.includes("Provincial") &&
						(name === "Regular" ||
							name === "Net Pay" ||
							name.includes("Gross ") ||
							lineItem.currentTotal > 0 ||
							lineItem.YTDHoursTotal > 0 ||
							lineItem.YTDTotal > 0);

					return (
						<React.Fragment key={name}>
							{lineItem.isValid && (
								<ItemRow
									isTotals={lineItem.isTotals}
									title={name}
									isEarning={isEarning}
									rate={lineItem.rate}
									totalHours={lineItem.totalHours}
									currentTotal={lineItem.currentTotal}
									YTDTotal={lineItem.YTDTotal}
									YTDHoursTotal={lineItem.YTDHoursTotal}
								/>
							)}
						</React.Fragment>
					);
				})}
			</Tbody>
		</TableLayout>
	);
};

export default EarningsTable;
