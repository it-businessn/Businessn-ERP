import { Stack, Tbody, Td, Tr } from "@chakra-ui/react";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";

const EmployeePayDetails = ({ employee: data, currentTotal, regHours }) => {
	const EARNINGS_COLS = [
		"",
		"Rate",
		"Hours",
		"Current Total",
		"YTD (Year to Date)",
	];
	const NET_PAY_COLS = ["", "Current Total", "YTD (Year to Date)"];
	const YTDTotal = data.YTDPayDetails.regPayDollarsYTD;
	const YTDNetPay = YTDTotal - (12 + 10 + 40 + 15 + 12 + 89);
	return (
		<Stack w={"60%"} spacing={0}>
			<TextTitle title={"Earnings"} size={"xl"} />
			<TableLayout cols={EARNINGS_COLS} isSmall>
				<Tbody>
					<Tr>
						<Td>
							<TextTitle title={"Regular"} />
						</Td>
						<Td>
							<TextTitle
								title={`$${data.currentPayDetails.regPay}`}
								weight="normal"
							/>
						</Td>
						<Td>
							<TextTitle title={regHours} weight="normal" />
						</Td>
						<Td>
							<TextTitle title={`$${currentTotal}`} weight="normal" />
						</Td>
						<Td>
							<TextTitle title={`$${YTDTotal}`} weight="normal" />
						</Td>
					</Tr>
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
			<TableLayout cols={null} isSmall>
				<Tbody>
					<Tr>
						<Td w={"52%"}>
							<TextTitle title={"Gross"} />
						</Td>
						<Td>
							<TextTitle title={`$${data.inputsTotal.gross}`} weight="normal" />
						</Td>
						<Td>
							<TextTitle title={`$${YTDTotal}`} weight="normal" />
						</Td>
					</Tr>
				</Tbody>
			</TableLayout>
			<TextTitle title={"Deductions"} size={"xl"} />
			<TableLayout cols={null} isSmall>
				<Tbody>
					<Tr>
						<Td>
							<TextTitle title={"Federal Tax"} />
						</Td>
						<Td>
							<TextTitle title={"$12"} weight="normal" />
						</Td>
						<Td>
							<TextTitle title={"$96"} weight="normal" />
						</Td>
					</Tr>
					<Tr>
						<Td>
							<TextTitle title={"State Tax"} />
						</Td>
						<Td>
							<TextTitle title={"$10"} weight="normal" />
						</Td>
						<Td>
							<TextTitle title={"$80"} weight="normal" />
						</Td>
					</Tr>
					<Tr>
						<Td>
							<TextTitle title={"CPP"} />
						</Td>
						<Td>
							<TextTitle title={"$40"} weight="normal" />
						</Td>
						<Td>
							<TextTitle title={"$320"} weight="normal" />
						</Td>
					</Tr>
					<Tr>
						<Td>
							<TextTitle title={"EI"} />
						</Td>
						<Td>
							<TextTitle title={"$15"} weight="normal" />
						</Td>
						<Td>
							<TextTitle title={"$120"} weight="normal" />
						</Td>
					</Tr>
					<Tr>
						<Td>
							<TextTitle title={"Other"} />
						</Td>
						<Td>
							<TextTitle title={"$12"} weight="normal" />
						</Td>
						<Td>
							<TextTitle title={"$96"} weight="normal" />
						</Td>
					</Tr>
					<Tr>
						<Td>
							<TextTitle title={"Total Deductions"} />
						</Td>
						<Td>
							<TextTitle
								title={`$${data.inputsTotal.totalDeductions}`}
								weight="normal"
							/>
						</Td>
						<Td>
							<TextTitle title={"$712"} weight="normal" />
						</Td>
					</Tr>
				</Tbody>
			</TableLayout>
			<TextTitle title={"Net Pay"} size={"xl"} />
			<TableLayout cols={NET_PAY_COLS} isSmall>
				<Tbody>
					<Tr>
						<Td w={"53%"}>
							<TextTitle title={"Net Pay"} />
						</Td>
						<Td>
							<TextTitle
								title={`$${data.inputsTotal.currentNetPay}`}
								weight="normal"
							/>
						</Td>
						<Td>
							<TextTitle title={`$${YTDNetPay}`} weight="normal" />
						</Td>
					</Tr>
				</Tbody>
			</TableLayout>
		</Stack>
	);
};

export default EmployeePayDetails;
