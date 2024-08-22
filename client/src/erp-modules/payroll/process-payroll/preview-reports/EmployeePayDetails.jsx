import { HStack, Stack, Tbody } from "@chakra-ui/react";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import payStubImg from "../../../../assets/coverImgPaystub.png";
import ItemRow from "./ItemRow";

const EmployeePayDetails = ({ data }) => {
	const EARNINGS_COLS = [
		"",
		"Rate",
		"Hours",
		"Current Total",
		"YTD Hours",
		"YTD Totals",
	];

	const NET_PAY_COLS = ["", "", "", "Current Total", "", "YTD Totals"];
	const BLANK_COLS = ["", "", "", "", "", ""];

	return (
		<Stack w={"60%"} spacing={0} mt={3}>
			<HStack
				justifyContent={"space-between"}
				w={"100%"}
				backgroundImage={payStubImg}
				backgroundSize="cover"
				backgroundPosition="center"
				backgroundColor="var(--lead_cards_border)"
				backgroundBlendMode="overlay"
				filter={"opacity(0.2)"}
			>
				<TextTitle visibility={"hidden"} title={"Earnings"} size={"xl"} />
				<TextTitle title={"Current"} size={"xl"} />
				<TextTitle title={"Year to Date"} size={"xl"} />
			</HStack>
			<TextTitle title={"Earnings"} size={"xl"} />
			<TableLayout cols={EARNINGS_COLS} size="md" bg="var(--primary_bg_1)">
				<Tbody>
					<ItemRow
						title={"Regular"}
						isEarning
						rate={data.regPay}
						totalHours={data.totalRegHoursWorked}
						currentTotal={data.currentRegPayTotal}
						YTDTotal={data.YTDRegPayTotal}
						YTDHoursTotal={data.YTDRegHoursWorked}
					/>
					{data.YTDOverTimePayTotal > 0 && (
						<ItemRow
							isEarning
							title={"Overtime"}
							rate={data.overTimePay}
							totalHours={data.totalOvertimeHoursWorked}
							currentTotal={data.currentOverTimePayTotal}
							YTDTotal={data.YTDOverTimePayTotal}
							YTDHoursTotal={data.YTDOvertimeHoursWorked}
						/>
					)}
					{data.YTDDblOverTimePayTotal > 0 && (
						<ItemRow
							isEarning
							title={"Double Overtime"}
							rate={data.dblOverTimePay}
							totalHours={data.totalDblOvertimeHoursWorked}
							currentTotal={data.currentDblOverTimePayTotal}
							YTDTotal={data.YTDDblOverTimePayTotal}
							YTDHoursTotal={data.YTDDblOvertimeHoursWorked}
						/>
					)}
					{data.YTDStatPayTotal > 0 && (
						<ItemRow
							isEarning
							title={"Stat Pay"}
							rate={data.statPay}
							totalHours={data.totalStatHours}
							currentTotal={data.currentStatPayTotal}
							YTDTotal={data.YTDStatPayTotal}
							YTDHoursTotal={data.YTDStatHoursWorked}
						/>
					)}
					{data.YTDStatWorkPayTotal > 0 && (
						<ItemRow
							isEarning
							title={"Stat Worked Pay"}
							rate={data.statWorkPay}
							totalHours={data.totalStatDayHoursWorked}
							currentTotal={data.currentStatWorkPayTotal}
							YTDTotal={data.YTDStatWorkPayTotal}
							YTDHoursTotal={data.YTDStatDayHoursWorked}
						/>
					)}
					{data.YTDVacationPayTotal > 0 && (
						<ItemRow
							isEarning
							title={"Vacation Pay"}
							rate={data.vacationPay}
							totalHours={data.totalVacationHoursWorked}
							currentTotal={data.currentVacationPayTotal}
							YTDTotal={data.YTDVacationPayTotal}
							YTDHoursTotal={data.YTDVacationHoursWorked}
						/>
					)}
					{data.YTDSickPayTotal > 0 && (
						<ItemRow
							isEarning
							title={"Sick Pay"}
							rate={data.sickPay}
							totalHours={data.totalSickHoursWorked}
							currentTotal={data.currentSickPayTotal}
							YTDTotal={data.YTDSickPayTotal}
							YTDHoursTotal={data.YTDSickHoursWorked}
						/>
					)}
					{data.YTDCommission > 0 && (
						<ItemRow
							isEarning
							title={"Commission"}
							rate={0}
							totalHours={0}
							currentTotal={data.commission}
							YTDTotal={data.YTDCommission}
							YTDHoursTotal={0}
						/>
					)}
					{data.YTDRetroactive > 0 && (
						<ItemRow
							isEarning
							title={"Retroactive"}
							rate={0}
							totalHours={0}
							currentTotal={data.retroactive}
							YTDTotal={data.YTDRetroactive}
							YTDHoursTotal={0}
						/>
					)}
					{data.YTDVacationPayout > 0 && (
						<ItemRow
							isEarning
							title={"Vacation Payout"}
							rate={0}
							totalHours={0}
							currentTotal={data.vacationPayout}
							YTDTotal={data.YTDVacationPayout}
							YTDHoursTotal={0}
						/>
					)}
					{data.YTDBonus > 0 && (
						<ItemRow
							isEarning
							title={"Bonus"}
							rate={0}
							totalHours={0}
							currentTotal={data.bonus}
							YTDTotal={data.YTDBonus}
							YTDHoursTotal={0}
						/>
					)}
					{data.YTDTerminationPayout > 0 && (
						<ItemRow
							isEarning
							title={"Termination Payout"}
							rate={0}
							totalHours={0}
							currentTotal={data.terminationPayout}
							YTDTotal={data.YTDTerminationPayout}
							YTDHoursTotal={0}
						/>
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
			<TableLayout cols={BLANK_COLS} size="md" inVisible bg="#fff">
				<Tbody>
					<ItemRow
						title={"Gross Earnings"}
						rate={0}
						totalHours={0}
						currentTotal={data.currentGrossPay}
						YTDTotal={data.YTDGrossPay}
					/>
				</Tbody>
			</TableLayout>
			<TextTitle mt={-2} title={"Deductions"} size={"xl"} />
			<TableLayout
				cols={BLANK_COLS}
				size="md"
				inVisible
				bg="var(--primary_bg_1)"
			>
				<Tbody>
					<ItemRow
						w="0"
						title={"Federal Tax"}
						rate={0}
						totalHours={0}
						currentTotal={data.currentFDTaxDeductions}
						YTDTotal={data.YTD_FDTaxDeductions}
					/>
					<ItemRow
						w="0"
						title={"State Tax"}
						rate={0}
						totalHours={0}
						currentTotal={data.currentStateTaxDeductions}
						YTDTotal={data.YTDStateTaxDeductions}
					/>
					<ItemRow
						w="0"
						title={"EI"}
						rate={0}
						totalHours={0}
						currentTotal={data.currentEIDeductions}
						YTDTotal={data.YTD_EIDeductions}
					/>
					<ItemRow
						w="0"
						title={"CPP"}
						rate={0}
						totalHours={0}
						currentTotal={data.currentCPPDeductions}
						YTDTotal={data.YTD_CPPDeductions}
					/>
					<ItemRow
						w="0"
						title={"Union Dues"}
						rate={0}
						totalHours={0}
						currentTotal={data?.currentUnionDuesDeductions ?? 0}
						YTDTotal={data?.YTD_UnionDuesDeductions ?? 0}
					/>

					{/* <Tr>
						<Td w={"10em"}>
							<TextTitle title={"Other"} />
						</Td>
						<Td w={"3em"}>
							<TextTitle visibility="hidden" />
						</Td>
						<Td w={"3em"}>
							<TextTitle visibility="hidden" />
						</Td>
						<Td w={"10em"}>
							<NormalTextTitle title={`$0.00`}  />
						</Td>
						<Td w={"10em"}>
							<NormalTextTitle title={`$0.00`}  />
						</Td>
					</Tr> */}
					<ItemRow
						w="0"
						title={"Total Deductions"}
						rate={0}
						totalHours={0}
						currentTotal={data.currentDeductionsTotal}
						YTDTotal={data.YTDDeductionsTotal}
					/>
				</Tbody>
			</TableLayout>
			<TextTitle title={"Net Pay"} size={"xl"} />
			<TableLayout cols={NET_PAY_COLS} size="md" bg="var(--primary_bg_1)">
				<Tbody>
					<ItemRow
						w="7em"
						title={"Net Pay"}
						rate={0}
						totalHours={0}
						currentTotal={data.currentNetPay}
						YTDTotal={data.YTDNetPay}
					/>
				</Tbody>
			</TableLayout>
		</Stack>
	);
};

export default EmployeePayDetails;
