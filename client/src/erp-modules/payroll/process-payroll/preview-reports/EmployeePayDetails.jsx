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
import ItemRow from "./ItemRow";

const EmployeePayDetails = ({ data }) => {
	return (
		<Stack
			textAlign={"center"}
			alignItems="center"
			position="relative"
			flex={0.8}
		>
			<BoxCard bg={"var(--main_color)"}>
				<TextTitle align={"center"} title={"Earnings Statement"} />

				<HeaderTable
					title1="Earnings"
					title2="Current"
					title3="Year to Date"
					addHiddenCols
				/>
				<TableLayout
					tableSize="xs"
					cols={EARNINGS_COLS}
					textSize="xs"
					bg={"var(--main_color)"}
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
									{name === "Regular" && (
										<ItemRow
											title={name}
											isEarning={isEarning}
											rate={data[rate]}
											totalHours={data[totalHours]}
											currentTotal={data[currentTotal]}
											YTDTotal={data[YTDTotal]}
											YTDHoursTotal={data[YTDHoursTotal]}
										/>
									)}
									{(data[YTDTotal] > 0 || name.includes("Gross ")) && (
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

						{/* <Tr>
				<Td>
					<TextTitle title={"Other"} />
				</Td>
				<Td>
					<TextTitle title={"regular"} />
				</Td>
				<Td>
					<TextTitle title={"regular"} />
				</Td>
				<Td>
					<TextTitle title={"regular"} />
				</Td>
				<Td>
					<TextTitle title={"regular"} />
				</Td>
			</Tr> */}
					</Tbody>
				</TableLayout>
				<HeaderTable
					title1="Deductions"
					title2="Current Total"
					title3="YTD Totals"
					addHiddenCols
				/>
				<TableLayout
					tableSize="xs"
					textSize="xs"
					bg={"var(--main_color)"}
					inVisible
				>
					<Tbody>
						{DEDUCTION_TYPES.map(
							({ name, rate, totalHours, currentTotal, YTDTotal }) => (
								<ItemRow
									w="0"
									key={name}
									title={name}
									isEarning={false}
									rate={data[rate] ?? 0}
									totalHours={data[totalHours] ?? 0}
									currentTotal={data[currentTotal] ?? 0}
									YTDTotal={data[YTDTotal] ?? 0}
								/>
							),
						)}
					</Tbody>
				</TableLayout>
				<HeaderTable
					title1="Net Pay"
					title2="Current Total"
					title3="YTD Totals"
					addHiddenCols
				/>
				<TableLayout
					tableSize="xs"
					textSize="xs"
					bg={"var(--main_color)"}
					inVisible
				>
					<Tbody>
						{NET_SUMMARY.map(
							({ name, rate, totalHours, currentTotal, YTDTotal }) => (
								<ItemRow
									w="0"
									key={name}
									title={name}
									isEarning={false}
									rate={data[rate] ?? 0}
									totalHours={data[totalHours] ?? 0}
									currentTotal={data[currentTotal] ?? 0}
									YTDTotal={data[YTDTotal] ?? 0}
								/>
							),
						)}
					</Tbody>
				</TableLayout>
			</BoxCard>
		</Stack>
	);
};

export default EmployeePayDetails;
