import { Stack, Tbody, Td, Tr } from "@chakra-ui/react";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";

const EmployeePayDetails = ({ data }) => {
	const EARNINGS_COLS = [
		"",
		"Rate",
		"Hours",
		"Current Total",
		"YTD (Year to Date)",
	];

	const NET_PAY_COLS = ["", "", "", "Current Total", "YTD (Year to Date)"];

	return (
		<Stack w={"60%"} spacing={0}>
			<TextTitle title={"Earnings"} size={"xl"} />
			<TableLayout variant="striped" cols={EARNINGS_COLS} isSmall>
				<Tbody>
					<Tr>
						<Td w={"10em"}>
							<TextTitle title={"Regular"} />
						</Td>
						<Td w={"3em"}>
							<TextTitle title={`$${data.regPay}`} weight="normal" />
						</Td>
						<Td w={"3em"}>
							<TextTitle title={data.totalRegHoursWorked} weight="normal" />
						</Td>
						<Td w={"10em"}>
							<TextTitle
								title={`$${data.currentRegPayTotal.toFixed(2)}`}
								weight="normal"
							/>
						</Td>
						<Td w={"10em"}>
							<TextTitle
								title={`$${data.YTDRegPayTotal.toFixed(2)}`}
								weight="normal"
							/>
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
			<TableLayout variant="striped" cols={null} isSmall>
				<Tbody>
					<Tr>
						<Td w={"10em"}>
							<TextTitle title={"Gross"} />
						</Td>
						<Td w={"3em"}>
							<TextTitle
								visibility="hidden"
								title={`$${data.regPay}`}
								weight="normal"
							/>
						</Td>
						<Td w={"3em"}>
							<TextTitle
								visibility="hidden"
								title={data.totalRegHoursWorked}
								weight="normal"
							/>
						</Td>
						<Td w={"10em"}>
							<TextTitle
								title={`$${data.currentGrossPay.toFixed(2)}`}
								weight="normal"
							/>
						</Td>
						<Td w={"10em"}>
							<TextTitle
								title={`$${data.YTDGrossPay.toFixed(2)}`}
								weight="normal"
							/>
						</Td>
					</Tr>
				</Tbody>
			</TableLayout>
			<TextTitle title={"Deductions"} size={"xl"} />
			<TableLayout variant="striped" cols={null} isSmall>
				<Tbody>
					<Tr>
						<Td w={"10em"}>
							<TextTitle title={"Federal Tax"} />
						</Td>
						<Td w={"3em"}>
							<TextTitle visibility="hidden" />
						</Td>
						<Td w={"3em"}>
							<TextTitle visibility="hidden" />
						</Td>
						<Td w={"10em"}>
							<TextTitle
								title={`$${data.currentFDTaxDeductions.toFixed(2)}`}
								weight="normal"
							/>
						</Td>
						<Td w={"10em"}>
							<TextTitle
								title={`$${data.YTD_FDTaxDeductions.toFixed(2)}`}
								weight="normal"
							/>
						</Td>
					</Tr>
					<Tr>
						<Td w={"10em"}>
							<TextTitle title={"State Tax"} />
						</Td>
						<Td w={"3em"}>
							<TextTitle visibility="hidden" />
						</Td>
						<Td w={"3em"}>
							<TextTitle visibility="hidden" />
						</Td>
						<Td w={"10em"}>
							<TextTitle
								title={`$${data.currentStateTaxDeductions.toFixed(2)}`}
								weight="normal"
							/>
						</Td>
						<Td w={"10em"}>
							<TextTitle
								title={`$${data.YTDStateTaxDeductions.toFixed(2)}`}
								weight="normal"
							/>
						</Td>
					</Tr>
					<Tr>
						<Td w={"10em"}>
							<TextTitle title={"CPP"} />
						</Td>
						<Td w={"3em"}>
							<TextTitle visibility="hidden" />
						</Td>
						<Td w={"3em"}>
							<TextTitle visibility="hidden" />
						</Td>
						<Td w={"10em"}>
							<TextTitle
								title={`$${data.currentCPPDeductions.toFixed(2)}`}
								weight="normal"
							/>
						</Td>
						<Td w={"10em"}>
							<TextTitle
								title={`$${data.YTD_CPPDeductions.toFixed(2)}`}
								weight="normal"
							/>
						</Td>
					</Tr>
					<Tr>
						<Td w={"10em"}>
							<TextTitle title={"EI"} />
						</Td>
						<Td w={"3em"}>
							<TextTitle visibility="hidden" />
						</Td>
						<Td w={"3em"}>
							<TextTitle visibility="hidden" />
						</Td>
						<Td w={"10em"}>
							<TextTitle
								title={`$${data.currentEIDeductions.toFixed(2)}`}
								weight="normal"
							/>
						</Td>
						<Td w={"10em"}>
							<TextTitle
								title={`$${data.YTD_EIDeductions.toFixed(2)}`}
								weight="normal"
							/>
						</Td>
					</Tr>

					<Tr>
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
					</Tr>
					<Tr>
						<Td w={"10em"}>
							<TextTitle title={"Total Deductions"} />
						</Td>
						<Td w={"3em"}>
							<TextTitle visibility="hidden" />
						</Td>
						<Td w={"3em"}>
							<TextTitle visibility="hidden" />
						</Td>
						<Td w={"10em"}>
							<TextTitle
								title={`$${data.currentDeductionsTotal.toFixed(2)}`}
								weight="normal"
							/>
						</Td>
						<Td w={"10em"}>
							<TextTitle
								title={`$${data.YTDDeductionsTotal.toFixed(2)}`}
								weight="normal"
							/>
						</Td>
					</Tr>
				</Tbody>
			</TableLayout>
			<TextTitle title={"Net Pay"} size={"xl"} />
			<TableLayout variant="striped" cols={NET_PAY_COLS} isSmall>
				<Tbody>
					<Tr>
						<Td w={"10em"}>
							<TextTitle title={"Net Pay"} />
						</Td>
						<Td w={"3em"}>
							<TextTitle visibility="hidden" />
						</Td>
						<Td w={"3em"}>
							<TextTitle visibility="hidden" />
						</Td>
						<Td w={"10em"}>
							<TextTitle
								title={`$${data.currentNetPay.toFixed(2)}`}
								weight="normal"
							/>
						</Td>
						<Td w={"10em"}>
							<TextTitle
								title={`$${data.YTDNetPay.toFixed(2)}`}
								weight="normal"
							/>
						</Td>
					</Tr>
				</Tbody>
			</TableLayout>
		</Stack>
	);
};

export default EmployeePayDetails;
