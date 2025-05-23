import { Divider, HStack, Stack, VStack } from "@chakra-ui/react";
import Loader from "components/Loader";
import ModalLayout from "components/ui/modal/ModalLayout";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import { COMPANIES } from "constant";
import React from "react";
import { isExtraPay } from "utils";
import { getAmount } from "utils/convertAmt";

const TotalsReportModal = ({
	isOpen,
	onClose,
	reportData,
	size = "5xl",
	title = "Funding Totals Report",
	company,
}) => {
	const isCornerStone = company === COMPANIES.CORNERSTONE;
	const totalIncomeTaxContr = reportData?.totalIncomeTaxContr?.toFixed(2);
	const totalCPP_EE_Contr = reportData?.totalCPP_EE_Contr?.toFixed(2);
	const totalCPP_ER_Contr = reportData?.totalCPP_ER_Contr?.toFixed(2);
	const totalCPP_Contr = (reportData?.totalCPP_EE_Contr * 2)?.toFixed(2);
	const totalEI_EE_Contr = reportData?.totalEI_EE_Contr?.toFixed(2);
	const totalEI_ER_Contr = reportData?.totalEI_ER_Contr?.toFixed(2);
	const totalEI_Contr = (
		parseFloat(reportData?.totalEI_EE_Contr) + parseFloat(reportData?.totalEI_ER_Contr)
	)?.toFixed(2);
	const totalGovtContr = reportData?.totalGovtContr?.toFixed(2);

	const totalNetPay = reportData?.totalNetPay?.toFixed(2);
	const totalEmpPaymentRemitCost = reportData?.totalEmpPaymentRemitCost?.toFixed(2);

	const totalBatchCharges = reportData?.totalBatchCharges?.toFixed(2);
	const totalEmpPayrollCost = reportData?.totalEmpPayrollCost?.toFixed(2);
	const totalCorePayrollCost = reportData?.totalCorePayrollCost?.toFixed(2);

	const timeClockMaintenanceCost = reportData?.timeClockMaintenanceCost?.toFixed(2);
	const totalTimeManagementEmpCost = reportData?.totalTimeManagementEmpCost?.toFixed(2);
	const totalTimeManagementPayrollCost = reportData?.totalTimeManagementPayrollCost?.toFixed(2);

	const totalServiceCharges = reportData?.totalServiceCharges?.toFixed(2);
	const totalFundingWithDrawals = reportData?.totalFundingWithDrawals?.toFixed(2);
	const totalsReportDetails = [
		{
			top: 0,
			title: "Totals withdrawn to remit to the CRA",
			details: [
				{ subtitle: "Total Income Tax Contribution", value: totalIncomeTaxContr, mt: 3 },
				{
					subtitle: "Total Income Tax Contribution",
					value: totalIncomeTaxContr,
					mt: 0,
					fontStyle: "italic",
				},
				{ subtitle: "Total CPP - Employee Contribution", value: totalCPP_EE_Contr, mt: 3 },
				{
					subtitle: "Total CPP - Employer Contribution",
					value: totalCPP_ER_Contr,
					mt: 0,
				},
				{
					subtitle: "Total CPP Contribution",
					value: totalCPP_Contr,
					mt: 0,
					fontStyle: "italic",
				},
				{ subtitle: "Total EI - Employee Contribution", value: totalEI_EE_Contr, mt: 3 },
				{ subtitle: "Total EI - Employer Contribution", value: totalEI_ER_Contr, mt: 0 },
				{
					subtitle: "Total EI Contribution",
					value: totalEI_Contr,
					mt: 0,
					fontStyle: "italic",
				},
			],
			sumTotal: { title: "ALL GOVERNMENT CONTRIBUTIONS TO REMIT", value: totalGovtContr },
		},
		{
			top: 3,
			title: "Totals withdrawn to remit to Employees",
			details: [
				{ subtitle: "All Employees Net Pay", value: totalNetPay, mt: 3 },
				{
					subtitle: "Total Net Pay",
					value: totalNetPay,
					mt: 0,
					fontStyle: "italic",
				},
			],
			sumTotal: { title: "ALL EMPLOYEE PAYMENTS TO REMIT", value: totalEmpPaymentRemitCost },
		},
		{
			top: 3,
			title: "Totals withdrawn for services",
			details: [
				{ subtitle: "Core Payroll - Batch", value: totalBatchCharges, mt: 3 },
				{
					subtitle: "Core Payroll - Employees",
					value: totalEmpPayrollCost,
					mt: 0,
				},
				{
					subtitle: "Total Core Payroll",
					value: totalCorePayrollCost,
					mt: 0,
					fontStyle: "italic",
				},
				{
					subtitle: "Time Clock Device Maintenance",
					value: timeClockMaintenanceCost,
					mt: 4,
					hide: isCornerStone,
				},
				{
					subtitle: "Time Management",
					value: totalTimeManagementEmpCost,
					mt: 0,
					hide: isCornerStone,
				},
				{
					subtitle: "Total Time Management",
					value: totalTimeManagementPayrollCost,
					mt: 0,
					fontStyle: "italic",
					hide: isCornerStone,
				},
			],
			sumTotal: { title: "ALL SERVICE CHARGES", value: totalServiceCharges },
		},
	];

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
			{!reportData && <Loader />}Company Name: Acme Corporation Prepared By: Jane Doe Date Prepared:
			<Stack mt={3}>
				<HStack justifyContent="start">
					<VStack spacing={0}>
						<TextTitle size="sm" title="Pay Period#:" />
						<TextTitle size="sm" title="Total Government Remittance:" />
						<TextTitle size="sm" title="Total Employee Remittance:" />
						<TextTitle size="sm" title="Total Withdrawals:" />
					</VStack>
					<VStack spacing={0}>
						<NormalTextTitle
							size="sm"
							title={isExtraPay(reportData?.payPeriodNum, reportData?.isExtraRun)}
						/>
						<NormalTextTitle size="sm" title={getAmount(reportData?.totalGovtContr)} />
						<NormalTextTitle size="sm" title={getAmount(reportData?.totalEmpPaymentRemitCost)} />
						<NormalTextTitle size="sm" title={getAmount(reportData?.totalFundingWithDrawals)} />
					</VStack>
				</HStack>
				<Divider />
			</Stack>
			{reportData && (
				<Stack padding={0}>
					{totalsReportDetails?.map(({ top, title, details, sumTotal }, i) => (
						<React.Fragment key={`${title}_${i}`}>
							<Stack mt={top} spacing={0}>
								<TextTitle title={title} />
								{details?.map(
									({ subtitle, value, mt, fontStyle, hide }, idx) =>
										!hide && (
											<HStack
												key={`${subtitle}_${idx}`}
												borderBottom="1px solid var(--main_color_black)"
												mt={mt}
											>
												<NormalTextTitle size="sm" title={subtitle} fontStyle={fontStyle} />
												<NormalTextTitle
													size="sm"
													align="right"
													title={value}
													fontStyle={fontStyle}
												/>
											</HStack>
										),
								)}
							</Stack>
							<Stack mt={1} size="xs">
								<HStack>
									<TextTitle title={sumTotal.title} whiteSpace="wrap" />
									<TextTitle title={sumTotal.value} align="right" />
								</HStack>
							</Stack>
						</React.Fragment>
					))}
					<HStack mt={2} borderTop="1px solid var(--main_color_black)">
						<TextTitle title="ALL FUNDING WITHDRAWALS" />
						<TextTitle align="right" title={totalFundingWithDrawals} />
					</HStack>
				</Stack>
			)}
		</ModalLayout>
	);
};

export default TotalsReportModal;
