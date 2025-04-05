import { SimpleGrid, Stack } from "@chakra-ui/react";
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
				<Stack>
					<SimpleGrid mb={"1em"} columns={{ base: 6 }} spacing="1em">
						<TextTitle title="" />
						<TextTitle title="Client Account Code" />
						<TextTitle title="Code Name" />
						<TextTitle title="Description" />
						<TextTitle title="Debit" />
						<TextTitle title="Credit" />
						{/* 
						<TextTitle title="" />
						<TextTitle title="Client Account Code" />
						<TextTitle title="Code Name" />
						<TextTitle title="Description" />
						<TextTitle title="Debit" />
						<TextTitle title="Credit" /> */}

						<TextTitle title="" />
						<TextTitle title="1000" />
						<TextTitle title="Bank" />
						<TextTitle title="Funding Withdrawal " />
						<TextTitle title="" />
						<TextTitle title={reportData?.netFundingWithdrawals?.toFixed(2)} />

						<TextTitle title="" />
						<TextTitle title="" />
						<TextTitle title="" />
						<TextTitle title="Net Payroll Payable" />
						<TextTitle title="" />
						<TextTitle title="" />

						<TextTitle title="" />
						<TextTitle title="2105" />
						<TextTitle title="EI Payable" />
						<TextTitle title="EI Payable" />
						<TextTitle title={reportData?.totalEIPayable} />
						<TextTitle title="" />

						<TextTitle title="" />
						<TextTitle title="2106" />
						<TextTitle title="CPP Payable" />
						<TextTitle title="CPP Payable" />
						<TextTitle title={reportData?.totalCPPPayable} />
						<TextTitle title="" />
						<TextTitle title="" />
						<TextTitle title="2110" />
						<TextTitle title="Income Tax Payable" />
						<TextTitle title="Income Tax Payable " />
						<TextTitle title={reportData?.totalIncomeTaxPayable} />
						<TextTitle title="" />

						<TextTitle title="" />
						<TextTitle title="5321" />
						<TextTitle title="Payroll Expense" />
						<TextTitle title="Service Charges" />
						<TextTitle title="0" />
						<TextTitle title="" />
						{reportData?.departmentBreakDown?.map((dept) => (
							<React.Fragment key={dept.department}>
								<TextTitle title="" />
								<TextTitle title="" />
								<TextTitle title="" />
								<TextTitle title="" />
								<TextTitle title="" />
								<TextTitle title="" />
								<TextTitle title={dept.department} />
								<TextTitle title="5314" />
								<TextTitle title={`${dept.department} Wages`} />
								<TextTitle title="Gross Wage Expense" />
								<TextTitle title={dept?.grossWageExpense} />
								<TextTitle title="" />
								{/* CPPPayable,EIPayable,department,employeeCPPContribution,employeeEIContribution,employerCPPBenefitExpense,employerEIBenefitExpense,grossWageExpense,incomeTaxContribution */}
							</React.Fragment>
						))}
						{/* totalCredit,totalDebit,totalFundingWithDrawals,totalServiceCharges */}
					</SimpleGrid>
				</Stack>
			)}
		</ModalLayout>
	);
};

export default JournalsReportModal;
