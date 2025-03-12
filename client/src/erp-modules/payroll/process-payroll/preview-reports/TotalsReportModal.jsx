import { HStack, Stack } from "@chakra-ui/react";
import Loader from "components/Loader";
import ModalLayout from "components/ui/modal/ModalLayout";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import {} from "utils/convertAmt";

const TotalsReportModal = ({
	isOpen,
	onClose,
	reportData,
	size = "7xl",
	title = "Payroll Register",
}) => {
	let {
		totalIncomeTaxContr,
		totalCPP_EE_Contr,
		totalCPP_ER_Contr,
		totalCPP_Contr,
		totalBatchCharges,
		timeClockMaintenanceCost,
		totalCorePayrollCost,
		totalEI_Contr,
		totalEI_EE_Contr,
		totalEI_ER_Contr,
		totalEmpPaymentRemitCost,
		totalEmpPayrollCost,
		totalFundingWithDrawals,
		totalGovtContr,
		totalNetPay,
		totalServiceCharges,
		totalTimeManagementEmpCost,
		totalTimeManagementPayrollCost,
	} = reportData;

	totalIncomeTaxContr = totalIncomeTaxContr.toFixed(2);
	totalCPP_EE_Contr = totalCPP_EE_Contr.toFixed(2);
	totalCPP_ER_Contr = totalCPP_ER_Contr.toFixed(2);
	totalCPP_Contr = (totalCPP_EE_Contr * 2).toFixed(2);
	totalEI_EE_Contr = totalEI_EE_Contr.toFixed(2);
	totalEI_ER_Contr = totalEI_ER_Contr.toFixed(2);
	totalEI_Contr = (parseFloat(totalEI_EE_Contr) + parseFloat(totalEI_ER_Contr)).toFixed(2);
	totalGovtContr = totalGovtContr.toFixed(2);

	totalNetPay = totalNetPay.toFixed(2);
	totalEmpPaymentRemitCost = totalEmpPaymentRemitCost.toFixed(2);

	totalBatchCharges = totalBatchCharges.toFixed(2);
	totalEmpPayrollCost = totalEmpPayrollCost.toFixed(2);
	totalCorePayrollCost = totalCorePayrollCost.toFixed(2);

	timeClockMaintenanceCost = timeClockMaintenanceCost.toFixed(2);
	totalTimeManagementEmpCost = totalTimeManagementEmpCost.toFixed(2);
	totalTimeManagementPayrollCost = totalTimeManagementPayrollCost.toFixed(2);

	totalServiceCharges = totalServiceCharges.toFixed(2);
	totalFundingWithDrawals = totalFundingWithDrawals.toFixed(2);

	return (
		<ModalLayout
			title={<TextTitle title={title} />}
			size={size}
			isOpen={isOpen}
			onClose={onClose}
			textAlign={"center"}
			fontSize="2xl"
			overflow={"hidden"}
			isReport={true}
		>
			{!reportData && <Loader />}
			<Stack padding="1em">
				<Stack mt={2} spacing={0}>
					<TextTitle size="sm" title="Totals withdrawn to remit to the CRA" />
					<HStack borderBottom="1px solid var(--main_color_black)" mt={6}>
						<NormalTextTitle title="Total Income Tax Contribution" />
						<NormalTextTitle align="right" title={totalIncomeTaxContr} />
					</HStack>
					<HStack borderBottom="1px solid var(--main_color_black)">
						<NormalTextTitle title="Total Income Tax Contribution" fontStyle="italic" />
						<NormalTextTitle align="right" title={totalIncomeTaxContr} fontStyle="italic" />
					</HStack>
					<HStack mt={6}>
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

					<HStack mt={6}>
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

				<HStack mt={6}>
					<TextTitle title="ALL GOVERNMENT CONTRIBUTIONS TO REMIT" whiteSpace="wrap" />
					<TextTitle title={totalGovtContr} align="right" />
				</HStack>

				<Stack mt={3} size="xs" spacing={0}>
					<TextTitle size="sm" title="Totals withdrawn to remit to Employees" />
					<HStack borderBottom="1px solid var(--main_color_black)" mt={6}>
						<NormalTextTitle title="All Employees Net Pay" />
						<NormalTextTitle align="right" title={totalNetPay} />
					</HStack>
					<HStack borderBottom="1px solid var(--main_color_black)">
						<NormalTextTitle title="Total Net Pay" fontStyle="italic" />
						<NormalTextTitle align="right" title={totalNetPay} fontStyle="italic" />
					</HStack>
				</Stack>

				<Stack mt={6} size="xs">
					<HStack>
						<TextTitle title="ALL EMPLOYEE PAYMENTS TO REMIT" />
						<TextTitle align="right" title={totalEmpPaymentRemitCost} />
					</HStack>
				</Stack>

				<Stack mt={3} size="xs" spacing={0}>
					<TextTitle size="sm" title="Totals withdrawn for services" />
					<HStack mt={6}>
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

					<HStack mt={6}>
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

				<Stack mt={6} size="xs" spacing={2}>
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
		</ModalLayout>
	);
};

export default TotalsReportModal;
