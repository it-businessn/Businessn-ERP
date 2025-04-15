import { HStack, Stack } from "@chakra-ui/react";
import Loader from "components/Loader";
import ModalLayout from "components/ui/modal/ModalLayout";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";

const TotalsReportModal = ({
	isOpen,
	onClose,
	reportData,
	size = "5xl",
	title = "Funding Totals Report",
}) => {
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
				<Stack padding={0}>
					<Stack mt={2} spacing={0}>
						<TextTitle title="Totals withdrawn to remit to the CRA" />
						<HStack borderBottom="1px solid var(--main_color_black)" mt={5}>
							<NormalTextTitle title="Total Income Tax Contribution" />
							<NormalTextTitle align="right" title={totalIncomeTaxContr} />
						</HStack>
						<HStack borderBottom="1px solid var(--main_color_black)">
							<NormalTextTitle title="Total Income Tax Contribution" fontStyle="italic" />
							<NormalTextTitle align="right" title={totalIncomeTaxContr} fontStyle="italic" />
						</HStack>
						<HStack mt={5}>
							<NormalTextTitle title="Total CPP - Employee Contribution" />
							<NormalTextTitle align="right" title={totalCPP_EE_Contr} />
						</HStack>
						<HStack borderBottom="1px solid var(--main_color_black)">
							<NormalTextTitle title="Total CPP - Employer Contribution" />
							<NormalTextTitle align="right" title={totalCPP_ER_Contr} />
						</HStack>
						<HStack borderBottom="1px solid var(--main_color_black)">
							<NormalTextTitle title="Total CPP Contribution" fontStyle="italic" />
							<NormalTextTitle align="right" title={totalCPP_Contr} fontStyle="italic" />
						</HStack>

						<HStack mt={5}>
							<NormalTextTitle title="Total EI - Employee Contribution" />
							<NormalTextTitle align="right" title={totalEI_EE_Contr} />
						</HStack>
						<HStack borderBottom="1px solid var(--main_color_black)">
							<NormalTextTitle title="Total EI - Employer Contribution" />
							<NormalTextTitle align="right" title={totalEI_ER_Contr} />
						</HStack>
						<HStack borderBottom="1px solid var(--main_color_black)">
							<NormalTextTitle title="Total EI Contribution" fontStyle="italic" />
							<NormalTextTitle align="right" title={totalEI_Contr} fontStyle="italic" />
						</HStack>
					</Stack>

					<HStack mt={5}>
						<TextTitle title="ALL GOVERNMENT CONTRIBUTIONS TO REMIT" whiteSpace="wrap" />
						<TextTitle title={totalGovtContr} align="right" />
					</HStack>

					<Stack mt={3} size="xs" spacing={0}>
						<TextTitle title="Totals withdrawn to remit to Employees" />
						<HStack borderBottom="1px solid var(--main_color_black)" mt={5}>
							<NormalTextTitle title="All Employees Net Pay" />
							<NormalTextTitle align="right" title={totalNetPay} />
						</HStack>
						<HStack borderBottom="1px solid var(--main_color_black)">
							<NormalTextTitle title="Total Net Pay" fontStyle="italic" />
							<NormalTextTitle align="right" title={totalNetPay} fontStyle="italic" />
						</HStack>
					</Stack>

					<Stack mt={5} size="xs">
						<HStack>
							<TextTitle title="ALL EMPLOYEE PAYMENTS TO REMIT" />
							<TextTitle align="right" title={totalEmpPaymentRemitCost} />
						</HStack>
					</Stack>

					<Stack mt={3} size="xs" spacing={0}>
						<TextTitle title="Totals withdrawn for services" />
						<HStack mt={5}>
							<NormalTextTitle title="Core Payroll - Batch" />
							<NormalTextTitle align="right" title={totalBatchCharges} />
						</HStack>
						<HStack borderBottom="1px solid var(--main_color_black)">
							<NormalTextTitle title="Core Payroll - Employees" />
							<NormalTextTitle align="right" title={totalEmpPayrollCost} />
						</HStack>
						<HStack borderBottom="1px solid var(--main_color_black)">
							<NormalTextTitle title="Total Core Payroll" fontStyle="italic" />
							<NormalTextTitle align="right" title={totalCorePayrollCost} fontStyle="italic" />
						</HStack>

						<HStack mt={5}>
							<NormalTextTitle title="Time Clock Device Maintenance" />
							<NormalTextTitle align="right" title={timeClockMaintenanceCost} />
						</HStack>
						<HStack borderBottom="1px solid var(--main_color_black)">
							<NormalTextTitle title="Time Management" />
							<NormalTextTitle align="right" title={totalTimeManagementEmpCost} />
						</HStack>
						<HStack borderBottom="1px solid var(--main_color_black)">
							<NormalTextTitle title="Total Time Management" fontStyle="italic" />
							<NormalTextTitle
								align="right"
								title={totalTimeManagementPayrollCost}
								fontStyle="italic"
							/>
						</HStack>
					</Stack>

					<Stack mt={5} size="xs" spacing={2}>
						<HStack>
							<TextTitle title="ALL SERVICE CHARGES" />
							<TextTitle align="right" title={totalServiceCharges} />
						</HStack>
						<HStack mt={2} borderTop="1px solid var(--main_color_black)">
							<TextTitle title="ALL FUNDING WITHDRAWALS" />
							<TextTitle align="right" title={totalFundingWithDrawals} />
						</HStack>
					</Stack>
				</Stack>
			)}
		</ModalLayout>
	);
};

export default TotalsReportModal;
