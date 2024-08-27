import { Box, HStack, Stack, Tbody } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import React from "react";
import { formatDateBar, getAmount, isExtraPay } from "utils";
import { ACCRUAL_TYPES, HeaderTable } from "./data";
import ItemRow from "./ItemRow";

const EmployeeInfo = ({ data }) => {
	return (
		<Stack
			textAlign={"center"}
			alignItems="center"
			position="relative"
			flex={0.2}
		>
			<BoxCard bg={"var(--main_color)"}>
				<Stack spacing={5}>
					<Box>
						<TextTitle size="xs" title={data.empId.fullName} />
						<HStack mt={5} backgroundColor="var(--payStub_bg)">
							<TextTitle align="left" title={"Net Pay:"} size="xs" />
							<TextTitle
								align="center"
								title={getAmount(data.currentNetPay)}
								size="xs"
							/>
						</HStack>
						<HStack backgroundColor="var(--payStub_bg)">
							<TextTitle align="left" title={"Pay Date:"} size="xs" />
							<TextTitle
								align="center"
								title={formatDateBar(data.payPeriodPayDate)}
								size="xs"
							/>
						</HStack>
						<HStack mt={5} backgroundColor="var(--payStub_bg)">
							<TextTitle align="left" title={"Employee#:"} size="xs" />
							<TextTitle
								align="center"
								title={data.empId.employeeId}
								size="xs"
							/>
						</HStack>
						<HStack backgroundColor="var(--payStub_bg)">
							<TextTitle align="left" title={"Company#:"} size="xs" />
							<TextTitle align="center" title={"NA"} size="xs" />
						</HStack>
						<HStack
							mt={5}
							w={"100%"}
							spacing={0}
							backgroundColor="var(--payStub_bg)"
						>
							<TextTitle
								border={"1px solid black"}
								align="left"
								title={"Pay Period #:"}
								size="xs"
							/>
							<TextTitle
								border={"1px solid black"}
								align="center"
								title={isExtraPay(data.payPeriodNum, data.isExtraRun)}
								size="xs"
								borderLeftWidth={0}
							/>
						</HStack>
						<HStack
							border={"1px solid black"}
							borderTopWidth={0}
							backgroundColor="var(--main_color)"
						>
							<NormalTextTitle
								align="center"
								title={`${formatDateBar(
									data.payPeriodStartDate,
								)} - ${formatDateBar(data.payPeriodEndDate)}`}
								size="xs"
							/>
						</HStack>
					</Box>
					<Box>
						<TextTitle align={"center"} title={"Information"} size={"sm"} />
						{ACCRUAL_TYPES.map(({ type, items }) => (
							<React.Fragment key={type}>
								<HeaderTable
									title1={type}
									title2="Current Total"
									title3="YTD Totals"
									addVacCols
								/>
								<TableLayout
									textSize="xs"
									inVisible
									bg="var(--main_color)"
									tableSize="xs"
								>
									<Tbody>
										{items?.map(
											({ name, rate, totalHours, currentTotal, YTDTotal }) => (
												<ItemRow
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
							</React.Fragment>
						))}
					</Box>
				</Stack>
			</BoxCard>
		</Stack>
	);
};

export default EmployeeInfo;
