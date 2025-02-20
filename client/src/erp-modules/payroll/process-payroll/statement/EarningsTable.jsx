import { Tbody } from "@chakra-ui/react";
import TableLayout from "components/ui/table/TableLayout";
import React from "react";
import ItemRow from "../preview-reports/ItemRow";

const EarningsTable = ({ cols, rows, data, colBg, isNetSummary }) => {
	return (
		<TableLayout
			colBg={colBg}
			tableSize="xs"
			cols={cols}
			textSize="xs"
			bg={"var(--main_color)"}
			width1="9em"
			width2="80px"
			width3="46px"
			isEarning
			whiteSpace="wrap"
		>
			<Tbody>
				{rows.map(
					({ name, rate, totalHours, currentTotal, YTDTotal, YTDHoursTotal, isEarning }) => {
						const isValid =
							!name.includes("Federal") &&
							!name.includes("Provincial") &&
							(name === "Regular" ||
								name === "Net Pay" ||
								name.includes("Gross ") ||
								data[currentTotal] > 0 ||
								data[YTDHoursTotal] > 0 ||
								data[YTDTotal] > 0);
						return (
							<React.Fragment key={name}>
								{isValid && (
									<ItemRow
										isNetSummary={isNetSummary}
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
						);
					},
				)}
			</Tbody>
		</TableLayout>
	);
};

export default EarningsTable;
