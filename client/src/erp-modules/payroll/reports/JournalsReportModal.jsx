import { Divider, HStack, Image, Table, Tbody, Td, Th, Thead, Tr, VStack } from "@chakra-ui/react";
import Loader from "components/Loader";
import ModalLayout from "components/ui/modal/ModalLayout";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import React from "react";
import { dayMonthYear, formatDateBar } from "utils/convertDate";
import payStubLogo from "../../../assets/logos/BusinessN_lightLogo.jpg";

const JournalsReportModal = ({
	isOpen,
	onClose,
	reportData,
	size = "6xl",
	title = "Journal Entry Report",
	isReport,
	companyDetails,
}) => {
	const JOURNAL_TABLE_COLS = [
		{ name: "Client Account Code" },
		{ name: "Code Name" },
		{ name: "Description" },
		{ name: "Debit", isNumeric: true },
		{ name: "Credit", isNumeric: true },
	];

	const JOURNAL_TABLE_ROW_DATA = [
		// ["", "", "Employee Disbursements", "-6107.89", ""],
		// ["", "", "Government Remittances", "-3035.56", ""],
		["", "00000", "Bank", "Funding Withdrawal", "", reportData?.netFundingWithdrawals.toFixed(2)],
		["", "", "", "Net Payroll Payable", "", ""],
		["", "00000", "EI Payable", "EI Payable", reportData?.totalEIPayable?.toFixed(2), ""],
		["", "00000", "CPP Payable", "CPP Payable", reportData?.totalCPPPayable?.toFixed(2), ""],
		[
			"",
			"00000",
			"Income Tax Payable",
			"Income Tax Payable",
			reportData?.totalIncomeTaxPayable?.toFixed(2),
			"",
		],
		["", "00000", "Payroll Expense", "Service Charges", "0", ""],
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
			isReport={isReport}
			fileName={`${formatDateBar(reportData?.payPeriodEndDate)} PayPeriod#${
				reportData?.payPeriodNum
			} Journal Entry Report`}
			w="95%"
			mx="auto"
		>
			{!reportData && <Loader />}
			<Image
				objectFit="cover"
				height={"50px"}
				w={"450px"}
				mx="auto"
				src={payStubLogo}
				alt="Company logo"
			/>

			<HStack justifyContent="start" w="60%">
				<VStack flex={0.4} spacing={0}>
					<TextTitle title="Company Name:" />
					<TextTitle title="Company#:" />
					<TextTitle title="Date Pulled:" />
				</VStack>
				<VStack flex={0.6} spacing={0}>
					<NormalTextTitle title={companyDetails.name} />
					<NormalTextTitle title={companyDetails.registration_number} />
					<NormalTextTitle title={dayMonthYear(reportData?.updatedOn)} />
				</VStack>
			</HStack>
			<Divider />
			{reportData && (
				<Table variant="simple" size="small">
					<Thead>
						<Tr>
							<Th />
							{JOURNAL_TABLE_COLS.map((col) => (
								<Th py={3} key={col.name} isNumeric={col?.isNumeric}>
									<TextTitle size="sm" title={col.name} />
								</Th>
							))}
						</Tr>
					</Thead>
					<Tbody>
						{JOURNAL_TABLE_ROW_DATA.map((row, idx) => (
							<Tr key={`row_${idx}`}>
								{row.map((cell, cellIdx) => (
									<Td key={cellIdx} isNumeric={cellIdx > 3}>
										{cellIdx > 3 ? (
											<TextTitle size="sm" title={cell} />
										) : (
											<NormalTextTitle size="sm" title={cell} />
										)}
									</Td>
								))}
							</Tr>
						))}
						{reportData?.departmentBreakDown?.map((dept, index) => (
							<React.Fragment key={dept.department}>
								<Tr>
									<Td>
										<TextTitle size="sm" title="Department:" />
									</Td>
									<Td />
									<Td />
									<Td />
									<Td />
									<Td />
								</Tr>
								<Tr>
									<Td>
										<NormalTextTitle size="sm" title={dept.department} />
									</Td>
									<Td>
										<NormalTextTitle size="sm" title="00000" />
									</Td>
									<Td>
										<NormalTextTitle size="sm" title={`${dept.department} Wages`} />
									</Td>
									<Td>
										<NormalTextTitle size="sm" title={"Gross Wage Expense"} />
									</Td>
									<Td isNumeric>
										<TextTitle size="sm" title={dept.grossWageExpense?.toFixed(2)} />
									</Td>
									<Td isNumeric />
								</Tr>
								<Tr>
									<Td />
									<Td>
										<NormalTextTitle size="sm" title="00000" />
									</Td>
									<Td>
										<NormalTextTitle size="sm" title={`${dept.department} Benefits`} />
									</Td>
									<Td>
										<NormalTextTitle size="sm" title={"CPP Benefits Expense"} />
									</Td>
									<Td isNumeric>
										<TextTitle size="sm" title={dept.employerCPPBenefitExpense?.toFixed(2)} />
									</Td>
									<Td isNumeric />
								</Tr>
								<Tr>
									<Td />
									<Td>
										<NormalTextTitle size="sm" title="00000" />
									</Td>
									<Td>
										<NormalTextTitle size="sm" title={`${dept.department} Benefits`} />
									</Td>
									<Td>
										<NormalTextTitle size="sm" title={"EI Benefits Expense"} />
									</Td>
									<Td isNumeric>
										<TextTitle size="sm" title={dept.employerEIBenefitExpense?.toFixed(2)} />
									</Td>
									<Td isNumeric />
								</Tr>
								<Tr>
									<Td />
									<Td>
										<NormalTextTitle size="sm" title="00000" />
									</Td>
									<Td>
										<NormalTextTitle size="sm" title={"CPP Payable"} />
									</Td>
									<Td>
										<NormalTextTitle size="sm" title={"CPP Payable"} />
									</Td>
									<Td isNumeric />
									<Td isNumeric>
										<TextTitle size="sm" title={dept.CPPPayable?.toFixed(2)} />
									</Td>
								</Tr>
								<Tr>
									<Td />
									<Td>
										<NormalTextTitle size="sm" title="00000" />
									</Td>
									<Td>
										<NormalTextTitle size="sm" title={"EI Payable"} />
									</Td>
									<Td>
										<NormalTextTitle size="sm" title={"EI Payable"} />
									</Td>
									<Td isNumeric />
									<Td isNumeric>
										<TextTitle size="sm" title={dept.EIPayable?.toFixed(2)} />
									</Td>
								</Tr>
								<Tr>
									<Td />
									<Td>
										<NormalTextTitle size="sm" title="00000" />
									</Td>
									<Td>
										<NormalTextTitle size="sm" title={"EI Payable"} />
									</Td>
									<Td>
										<NormalTextTitle size="sm" title={"EI Employee Contribution"} />
									</Td>
									<Td isNumeric />
									<Td isNumeric>
										<TextTitle size="sm" title={dept.employeeEIContribution?.toFixed(2)} />
									</Td>
								</Tr>
								<Tr>
									<Td />
									<Td>
										<NormalTextTitle size="sm" title="00000" />
									</Td>
									<Td>
										<NormalTextTitle size="sm" title={"CPP Payable"} />
									</Td>
									<Td>
										<NormalTextTitle size="sm" title={"CPP Employee Contribution"} />
									</Td>
									<Td isNumeric />
									<Td isNumeric>
										<TextTitle size="sm" title={dept.employeeCPPContribution?.toFixed(2)} />
									</Td>
								</Tr>
								<Tr>
									<Td />
									<Td>
										<NormalTextTitle size="sm" title="00000" />
									</Td>
									<Td>
										<NormalTextTitle size="sm" title={"Income Tax  Payable"} />
									</Td>
									<Td>
										<NormalTextTitle size="sm" title={"Income Tax  Contribution"} />
									</Td>
									<Td isNumeric />
									<Td isNumeric>
										<TextTitle size="sm" title={dept.incomeTaxContribution?.toFixed(2)} />
									</Td>
								</Tr>
							</React.Fragment>
						))}

						<Tr>
							<Td colSpan={4}>
								<TextTitle p={3} borderTop="1px solid var(--main_color_black)" title="IN BALANCE" />
							</Td>
							<Td isNumeric>
								<TextTitle
									p={3}
									borderTop="1px solid var(--main_color_black)"
									align="right"
									title={reportData.totalDebit?.toFixed(2)}
								/>
							</Td>
							<Td isNumeric>
								<TextTitle
									p={3}
									borderTop="1px solid var(--main_color_black)"
									align="right"
									title={reportData.totalCredit?.toFixed(2)}
								/>
							</Td>
						</Tr>
					</Tbody>
				</Table>
			)}
		</ModalLayout>
	);
};

export default JournalsReportModal;
