import { Stack, Tbody } from "@chakra-ui/react";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import ItemRow from "./ItemRow";

const EmployeePayDetails = ({ data }) => {
	const EARNINGS_COLS = [
		"",
		"Rate",
		"Hours",
		"Current Total",
		"YTD (Year to Date)",
	];

	const NET_PAY_COLS = ["", "", "", "Current Total", "YTD (Year to Date)"];
	const BLANK_COLS = ["", "", "", "", ""];

	return (
		<Stack w={"60%"} spacing={0}>
			<TextTitle title={"Earnings"} size={"xl"} />
			<TableLayout cols={EARNINGS_COLS} size="md">
				<Tbody>
					<ItemRow
						title={"Regular"}
						rate={data.regPay}
						totalHours={data.totalRegHoursWorked}
						currentTotal={data.currentRegPayTotal}
						YTDTotal={data.YTDRegPayTotal}
					/>
					{data.currentOverTimePayTotal > 0 && (
						<ItemRow
							title={"Overtime"}
							rate={data.overTimePay}
							totalHours={data.totalOvertimeHoursWorked}
							currentTotal={data.currentOverTimePayTotal}
							YTDTotal={data.YTDOverTimePayTotal}
						/>
					)}
					{data.currentDblOverTimePayTotal > 0 && (
						<ItemRow
							title={"Double Overtime"}
							rate={data.dblOverTimePay}
							totalHours={data.totalDblOvertimeHoursWorked}
							currentTotal={data.currentDblOverTimePayTotal}
							YTDTotal={data.YTDDblOverTimePayTotal}
						/>
					)}
					{data.currentStatPayTotal > 0 && (
						<ItemRow
							title={"Stat Pay"}
							rate={data.statPay}
							totalHours={data.totalStatHours}
							currentTotal={data.currentStatPayTotal}
							YTDTotal={data.YTDStatPayTotal}
						/>
					)}
					{data.currentStatWorkPayTotal > 0 && (
						<ItemRow
							title={"Stat Worked Pay"}
							rate={data.statWorkPay}
							totalHours={data.totalStatDayHoursWorked}
							currentTotal={data.currentStatWorkPayTotal}
							YTDTotal={data.YTDStatWorkPayTotal}
						/>
					)}
					{data.currentVacationPayTotal > 0 && (
						<ItemRow
							title={"Vacation Pay"}
							rate={data.vacationPay}
							totalHours={data.totalVacationHoursWorked}
							currentTotal={data.currentVacationPayTotal}
							YTDTotal={data.YTDVacationPayTotal}
						/>
					)}
					{data.currentSickPayTotal > 0 && (
						<ItemRow
							title={"Sick Pay"}
							rate={data.sickPay}
							totalHours={data.totalSickHoursWorked}
							currentTotal={data.currentSickPayTotal}
							YTDTotal={data.YTDSickPayTotal}
						/>
					)}
					{data.commission > 0 && (
						<ItemRow
							title={"Commission"}
							rate={0}
							totalHours={0}
							currentTotal={data.commission}
							YTDTotal={data.YTDCommission}
						/>
					)}
					{data.retroactive > 0 && (
						<ItemRow
							title={"Retroactive"}
							rate={0}
							totalHours={0}
							currentTotal={data.retroactive}
							YTDTotal={data.YTDRetroactive}
						/>
					)}
					{data.vacationPayout > 0 && (
						<ItemRow
							title={"Vacation Payout"}
							rate={0}
							totalHours={0}
							currentTotal={data.vacationPayout}
							YTDTotal={data.YTDVacationPayout}
						/>
					)}
					{data.bonus > 0 && (
						<ItemRow
							title={"Bonus"}
							rate={0}
							totalHours={0}
							currentTotal={data.bonus}
							YTDTotal={data.YTDBonus}
						/>
					)}
					{data.terminationPayout > 0 && (
						<ItemRow
							title={"Termination Payout"}
							rate={0}
							totalHours={0}
							currentTotal={data.terminationPayout}
							YTDTotal={data.YTDTerminationPayout}
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
			<TextTitle title={"Gross Pay"} size={"xl"} />
			<TableLayout cols={BLANK_COLS} size="md" inVisible>
				<Tbody>
					<ItemRow
						title={"Gross"}
						rate={0}
						totalHours={0}
						currentTotal={data.currentGrossPay}
						YTDTotal={data.YTDGrossPay}
					/>
				</Tbody>
			</TableLayout>
			<TextTitle title={"Deductions"} size={"xl"} />
			<TableLayout cols={BLANK_COLS} size="md" inVisible>
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
						title={"CPP"}
						rate={0}
						totalHours={0}
						currentTotal={data.currentCPPDeductions}
						YTDTotal={data.YTD_CPPDeductions}
					/>
					<ItemRow
						w="0"
						title={"EI"}
						rate={0}
						totalHours={0}
						currentTotal={data.currentEIDeductions}
						YTDTotal={data.YTD_EIDeductions}
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
							<TextTitle title={`$0.00`} weight="normal" />
						</Td>
						<Td w={"10em"}>
							<TextTitle title={`$0.00`} weight="normal" />
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
			<TableLayout cols={NET_PAY_COLS} size="md">
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
