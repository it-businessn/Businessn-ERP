import { Tbody } from "@chakra-ui/react";
import TableLayout from "components/ui/table/TableLayout";
import React from "react";
import ItemRow from "../preview-reports/ItemRow";

const EarningsTable = ({ cols, rows, data, colBg }) => {
	return (
		<TableLayout
			colBg={colBg}
			tableSize="xs"
			cols={cols}
			textSize="xs"
			bg={"var(--main_color)"}
			width1="30px"
			width2="80px"
			isEarning
			whiteSpace="wrap"
		>
			<Tbody>
				{rows.map(
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
	);
};

export default EarningsTable;
