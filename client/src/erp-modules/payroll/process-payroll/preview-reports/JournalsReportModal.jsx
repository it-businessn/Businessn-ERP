import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import Loader from "components/Loader";
import ModalLayout from "components/ui/modal/ModalLayout";
import TextTitle from "components/ui/text/TextTitle";
import React from "react";

const JournalsReportModal = ({
	isOpen,
	onClose,
	reportData,
	size = "6xl",
	title = "Journal Entry Report",
}) => {
	const rowData = [
		// ["", "", "Employee Disbursements", "-6107.89", ""],
		// ["", "", "Government Remittances", "-3035.56", ""],
		["", "1001", "Bank", "Funding Withdrawal", "", reportData?.netFundingWithdrawals.toFixed(2)],
		["", "", "", "Net Payroll Payable", "", ""],
		["", "2105", "EI Payable", "EI Payable", reportData?.totalEIPayable?.toFixed(2), ""],
		["", "2106", "CPP Payable", "CPP Payable", reportData?.totalCPPPayable?.toFixed(2), ""],
		[
			"",
			"2110",
			"Income Tax Payable",
			"Income Tax Payable",
			reportData?.totalIncomeTaxPayable?.toFixed(2),
			"",
		],
		["", "5321", "Payroll Expense", "Service Charges", "0", ""],
	];
	let counter = 10;
	reportData.totalCredit = reportData?.netFundingWithdrawals;
	reportData.totalDebit =
		reportData?.totalEIPayable + reportData?.totalCPPPayable + reportData.totalIncomeTaxPayable;
	reportData?.departmentBreakDown?.map((dept, index) => {
		dept.code = `${index + 1 * counter}${counter++}`;
		reportData.totalCredit +=
			dept?.CPPPayable +
			dept.EIPayable +
			dept.employeeCPPContribution +
			dept.employeeEIContribution +
			dept.incomeTaxContribution;
		reportData.totalDebit +=
			dept?.grossWageExpense + dept.employerCPPBenefitExpense + dept.employerEIBenefitExpense;
		return dept;
	});
	return (
		<ModalLayout
			title={<TextTitle title={title} />}
			size={size}
			isOpen={isOpen}
			onClose={onClose}
			textAlign={"center"}
			fontSize="2xl"
			isReport={true}
		>
			{!reportData && <Loader />}
			{reportData && (
				<Table variant="simple" size="small">
					<Thead>
						<Tr>
							<Th></Th>
							<Th>Client Account Code </Th>
							<Th>Code Name</Th>
							<Th>Description</Th>
							<Th isNumeric>Debit</Th>
							<Th isNumeric>Credit</Th>
						</Tr>
					</Thead>
					<Tbody>
						{rowData.map((row, idx) => (
							<Tr key={idx}>
								{row.map((cell, cellIdx) => (
									<Td key={cellIdx} isNumeric={cellIdx > 3}>
										{cell}
									</Td>
								))}
							</Tr>
						))}
						{reportData?.departmentBreakDown?.map((dept, index) => (
							<React.Fragment key={dept.department}>
								<Tr>
									<Td>Department:</Td>
									<Td />
									<Td />
									<Td />
									<Td />
									<Td />
								</Tr>
								<Tr>
									<Td>{dept.department}</Td>
									<Td>{`${dept.code}${index + 1}`}</Td>
									<Td>{`${dept.department} Wages`}</Td>
									<Td>Gross Wage Expense</Td>
									<Td isNumeric>{dept.grossWageExpense?.toFixed(2)}</Td>
									<Td isNumeric></Td>
								</Tr>
								<Tr>
									<Td></Td>
									<Td>{`${dept.code}${index + 2}`}</Td>
									<Td>{`${dept.department} Benefits`}</Td>
									<Td> CPP Benefits Expense</Td>
									<Td isNumeric>{dept.employerCPPBenefitExpense?.toFixed(2)}</Td>
									<Td isNumeric></Td>
								</Tr>
								<Tr>
									<Td></Td>
									<Td>{`${dept.code}${index + 3}`}</Td>
									<Td>{`${dept.department} Benefits`}</Td>
									<Td> EI Benefits Expense</Td>
									<Td isNumeric>{dept.employerEIBenefitExpense?.toFixed(2)}</Td>
									<Td isNumeric></Td>
								</Tr>
								<Tr>
									<Td></Td>
									<Td>{`${dept.code}${index + 4}`}</Td>
									<Td>CPP Payable</Td>
									<Td>CPP Payable</Td>
									<Td isNumeric></Td>
									<Td isNumeric>{dept.CPPPayable?.toFixed(2)}</Td>
								</Tr>
								<Tr>
									<Td></Td>
									<Td>{`${dept.code}${index + 5}`}</Td>
									<Td>EI Payable</Td>
									<Td>EI Payable</Td>
									<Td isNumeric></Td>
									<Td isNumeric>{dept.EIPayable?.toFixed(2)}</Td>
								</Tr>
								<Tr>
									<Td />
									<Td /> <Td /> <Td /> <Td /> <Td />
								</Tr>
								<Tr>
									<Td></Td>
									<Td>{`${dept.code}${index + 6}`}</Td>
									<Td>EI Payable</Td>
									<Td> EI Employee Contribution</Td>
									<Td isNumeric></Td>
									<Td isNumeric>{dept.employeeEIContribution?.toFixed(2)}</Td>
								</Tr>
								<Tr>
									<Td></Td>
									<Td>{`${dept.code}${index + 7}`}</Td>
									<Td>CPP Payable</Td>
									<Td> CPP Employee Contribution</Td>
									<Td isNumeric></Td>
									<Td isNumeric>{dept.employeeCPPContribution?.toFixed(2)}</Td>
								</Tr>
								<Tr>
									<Td></Td>
									<Td>{`${dept.code}${index + 7}`}</Td>
									<Td>Income Tax Payable</Td>
									<Td> Income Tax Contribution</Td>
									<Td isNumeric></Td>
									<Td isNumeric>{dept.incomeTaxContribution?.toFixed(2)}</Td>
								</Tr>
							</React.Fragment>
						))}

						<Tr mt={3}>
							<Td>IN BALANCE</Td>
							<Td /> <Td /> <Td />
							<Td isNumeric>{reportData.totalDebit?.toFixed(2)}</Td>
							<Td isNumeric>{reportData.totalCredit?.toFixed(2)}</Td>
						</Tr>
					</Tbody>
				</Table>
			)}
		</ModalLayout>
	);
};

export default JournalsReportModal;
