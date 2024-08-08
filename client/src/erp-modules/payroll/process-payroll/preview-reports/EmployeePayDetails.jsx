import { Stack, Tbody, Td, Tr } from "@chakra-ui/react";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";

const EmployeePayDetails = ({ employee }) => {
	const EARNINGS_COLS = [
		"",
		"Rate",
		"Hours",
		"Current Total",
		"YTD (Year to Date)",
	];
	const NET_PAY_COLS = ["", "Current Total", "YTD (Year to Date)"];
	console.log("pay=", employee);
	return (
		<Stack w={"60%"} spacing={0}>
			<TextTitle title={"Earnings"} />
			<TableLayout cols={EARNINGS_COLS} isSmall>
				<Tbody>
					<Tr>
						<Td>
							<TextTitle title={"Regular"} />
						</Td>
						<Td>
							<TextTitle title={employee.totalRegHoursWorked} weight="normal" />
						</Td>
						<Td>
							<TextTitle title={"hrs"} weight="normal" />
						</Td>
						<Td>
							<TextTitle title={"total"} weight="normal" />
						</Td>
						<Td>
							<TextTitle title={"ytd"} weight="normal" />
						</Td>
					</Tr>
					<Tr>
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
					</Tr>
				</Tbody>
			</TableLayout>
			<TextTitle title={"Gross Pay"} />
			<TableLayout cols={null} isSmall>
				<Tbody>
					<Tr>
						<Td>
							<TextTitle title={"Gross"} />
						</Td>
						<Td>
							<TextTitle title={"employee?.gross"} weight="normal" />
						</Td>
						<Td>
							<TextTitle title={"hrs"} weight="normal" />
						</Td>
					</Tr>
				</Tbody>
			</TableLayout>
			<TextTitle title={"Deductions"} />
			<TableLayout cols={null} isSmall>
				<Tbody>
					<Tr>
						<Td>
							<TextTitle title={"Federal Tax"} />
						</Td>
						<Td>
							<TextTitle title={"employee?.gross"} weight="normal" />
						</Td>
						<Td>
							<TextTitle title={"hrs"} weight="normal" />
						</Td>
					</Tr>
					<Tr>
						<Td>
							<TextTitle title={"State Tax"} />
						</Td>
						<Td>
							<TextTitle title={"employee?.gross"} weight="normal" />
						</Td>
						<Td>
							<TextTitle title={"hrs"} weight="normal" />
						</Td>
					</Tr>
					<Tr>
						<Td>
							<TextTitle title={"CPP"} />
						</Td>
						<Td>
							<TextTitle title={"employee?.gross"} weight="normal" />
						</Td>
						<Td>
							<TextTitle title={"hrs"} weight="normal" />
						</Td>
					</Tr>
					<Tr>
						<Td>
							<TextTitle title={"EI"} />
						</Td>
						<Td>
							<TextTitle title={"employee?.gross"} weight="normal" />
						</Td>
						<Td>
							<TextTitle title={"hrs"} weight="normal" />
						</Td>
					</Tr>
					<Tr>
						<Td>
							<TextTitle title={"Other"} />
						</Td>
						<Td>
							<TextTitle title={"employee?.gross"} weight="normal" />
						</Td>
						<Td>
							<TextTitle title={"hrs"} weight="normal" />
						</Td>
					</Tr>
					<Tr>
						<Td>
							<TextTitle title={"Total Deductions"} />
						</Td>
						<Td>
							<TextTitle title={"employee?.gross"} weight="normal" />
						</Td>
						<Td>
							<TextTitle title={"hrs"} weight="normal" />
						</Td>
					</Tr>
				</Tbody>
			</TableLayout>
			<TextTitle title={"Net Pay"} />
			<TableLayout cols={NET_PAY_COLS} isSmall>
				<Tbody>
					<Tr>
						<Td>
							<TextTitle title={"Net Pay"} />
						</Td>
						<Td>
							<TextTitle title={"employee?.gross"} weight="normal" />
						</Td>
						<Td>
							<TextTitle title={"hrs"} weight="normal" />
						</Td>
					</Tr>
				</Tbody>
			</TableLayout>
		</Stack>
	);
};

export default EmployeePayDetails;
