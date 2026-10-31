import { FormLabel, HStack, Icon, SimpleGrid, useToast, VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import ModalLayout from "components/ui/modal/ModalLayout";
import NormalTextTitle from "components/ui/NormalTextTitle";
import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import { MdOutlineChevronRight } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { workViewPath } from "routes";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import { getDeptName, hasPayrollSubmitAccess } from "utils";
import VerticalStepper from "../../../components/ui/VerticalStepper";
import { getClosestRecord } from "../workview/data";
import AlertsViolation from "./AlertsViolation";
import Finalize from "./Finalize";
import InputsReview from "./InputsReview";
import PayrollComplete from "./PayrollComplete";
import PayrollStageContent from "./PayrollStageContent";
import PayrunSetup from "./PayrunSetup";
import ReportsPreview from "./ReportsPreview";

/** The VoPay fund transfer result shown after a payroll is processed. */
export const getFundTransferToast = (fundTransfer, fundTotals) => {
	const amount = Number(fundTotals?.totalEmpPaymentRemitCost || 0).toFixed(2);
	switch (fundTransfer?.status) {
		case "sent":
			return {
				title: "VoPay transfer sent.",
				description: `$${amount} was sent to employees through VoPay.`,
				status: "success",
				duration: 8000,
			};
		case "failed":
			return {
				title: "Payroll saved, but the VoPay fund transfer failed.",
				description: `Employees have not been paid through VoPay${
					fundTransfer.error ? `: ${fundTransfer.error}` : "."
				} Submit the payroll again to retry, or contact support.`,
				status: "error",
				duration: null, // stays until closed
			};
		case "skipped":
			return (
				{
					ALREADY_SENT: {
						title: "VoPay transfer already sent.",
						description: "Funds for this payroll were sent earlier; nothing was sent again.",
						status: "info",
					},
					IN_PROGRESS: {
						title: "VoPay transfer in progress.",
						description:
							"The transfer for this payroll is already being sent; nothing was sent again.",
						status: "info",
					},
					COMPANY_NOT_ENABLED: {
						title: "No VoPay transfer.",
						description:
							"VoPay payments are not enabled for this company. Pay employees another way.",
						status: "info",
					},
					NO_AMOUNT: {
						title: "No VoPay transfer.",
						description: "There is no net pay to send for this payroll.",
						status: "info",
					},
					NO_FUND_TOTALS: {
						title: "No VoPay transfer.",
						description:
							"The funding totals for this payroll were not found, so nothing was sent. Contact support.",
						status: "warning",
						duration: null,
					},
				}[fundTransfer.reason] || null
			);
		default:
			return null;
	}
};

const ProcessPayroll = () => {
	// result of the final submission: { transfer } (see getFundTransferToast)
	const [submitResult, setSubmitResult] = useState(null);
	const steps = [
		{ title: "Payrun Setup", content: <PayrunSetup /> },
		{ title: "Inputs Review", content: <InputsReview /> },
		{ title: "Alerts and Violations", content: <AlertsViolation /> },
		{ title: "Review Reports", content: <ReportsPreview /> },
		{ title: "Finalize", content: <Finalize /> },
		{ title: "Payroll Complete", content: <PayrollComplete result={submitResult} /> },
	];
	const loggedInUser = LocalStorageService.getItem("user");
	const deptName = getDeptName(loggedInUser);
	const company = LocalStorageService.getItem("selectedCompany");
	const { payNo, year, stepNum } = useParams();
	const activeStep = stepNum ? parseInt(stepNum) : 0;
	const [currentStep, setCurrentStep] = useState(activeStep);
	const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [reportData, setReportData] = useState(null);
	const toast = useToast();
	const navigate = useNavigate();
	const isExtra = payNo?.includes("E");
	const {
		hasMultiPaygroups,
		selectedPayGroupOption,
		setSelectedPayGroupOption,
		payGroupSchedule,
		closestRecord,
		payGroups,
		selectedPayGroup,
	} = usePaygroup(company, false, year);

	const selectedPayPeriod = getClosestRecord(payNo, isExtra, payGroupSchedule, closestRecord);
	const isPayPeriodInactive = selectedPayPeriod?.isDisabledAction;
	const isPayrollSubmitDisabled =
		currentStep !== 5 || selectedPayPeriod?.isProcessed || isPayPeriodInactive;

	const handleChange = (value) => {
		if (value !== "") {
			setSelectedPayGroupOption(value);
		}
	};

	const goToNextStep = (index) => {
		setCurrentStep(index);
	};

	const handleClick = () => {
		setShowConfirmationPopUp((prev) => !prev);
	};

	const handleSubmit = async () => {
		selectedPayPeriod.isProcessed = true;
		setIsSubmitting(true);
		// selectedPayGroup?.yearSchedules[1].payPeriods.map((_) => (_.isProcessed = false));
		// console.log(selectedPayGroup?.yearSchedules[1].payPeriods, selectedPayGroup?.yearSchedules);
		try {
			const payrollProcessed = await PayrollService.updatePayrollProcess(
				{
					companyName: company,
					currentPayPeriod: closestRecord,
					yearSchedules: selectedPayGroup?.yearSchedules,
				},
				selectedPayGroup?._id,
			);
			if (payrollProcessed) {
				handleClick();
				toast({
					title: "Payroll is processed for payrun.",
					status: "success",
					duration: 5000,
					isClosable: true,
				});
				// Show whether the VoPay fund transfer went through (server: fundTransfer).
				const transferToast = getFundTransferToast(
					payrollProcessed.data?.fundTransfer,
					payrollProcessed.data?.fundTotalsReport,
				);
				if (transferToast) toast({ isClosable: true, ...transferToast });
				setSubmitResult({ transfer: transferToast });
				// stay on the result when the transfer needs attention
				const needsAttention = ["error", "warning"].includes(transferToast?.status);
				if (!needsAttention) {
					setTimeout(() => {
						navigate(workViewPath);
					}, 4000);
				}
			}
		} catch (error) {
			selectedPayPeriod.isProcessed = false;
			toast({
				title: "Payroll was not processed.",
				description: error?.response?.data?.message || "Please try again.",
				status: "error",
				duration: null,
				isClosable: true,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<PageLayout
			handleChange={handleChange}
			hasMultiPaygroups={hasMultiPaygroups}
			width={"35%"}
			title={"Process payroll"}
			showPayGroup={true}
			selectedValue={selectedPayGroupOption}
			data={payGroups}
			selectPlaceholder="Select Paygroup"
			selectAttr="name"
		>
			<SimpleGrid
				columns={{ base: 1, md: 1, lg: 2 }}
				spacing="4"
				my="4"
				mr="4"
				templateColumns={{ base: "minmax(0, 1fr)", lg: "minmax(0, 20fr) minmax(0, 80fr)" }}
			>
				<BoxCard>
					<VStack spacing={3} align={"start"}>
						<HStack spacing={2}>
							<NormalTextTitle
								color={"var(--primary_button_bg)"}
								title={"Manage all payrolls"}
								width="auto"
							/>
							<Icon
								borderRadius={"50%"}
								as={MdOutlineChevronRight}
								// onClick={() => handleChangeDate("prev")}
								boxSize="5"
								color="var(--primary_button_bg)"
							/>
						</HStack>
						<VerticalStepper
							hideProgress
							steps={steps}
							currentStep={currentStep}
							handleClick={goToNextStep}
							height="60vh"
						/>
						{hasPayrollSubmitAccess(loggedInUser?.role) && (
							<PrimaryButton
								minW={"100%"}
								isDisabled={isPayrollSubmitDisabled}
								name={"Submit payroll"}
								onOpen={handleClick}
								// isLoading={isLoading}
								loadingText="Loading"
							/>
						)}
					</VStack>
				</BoxCard>
				<PayrollStageContent
					currentStep={currentStep}
					steps={steps}
					handleConfirm={goToNextStep}
					payGroupSchedule={payGroupSchedule}
					closestRecord={selectedPayPeriod}
					selectedPayGroup={selectedPayGroup}
					payGroups={payGroups}
					isPayPeriodInactive={isPayPeriodInactive}
					setReportData={setReportData}
					reportData={reportData}
					company={company}
					deptName={deptName}
				/>
			</SimpleGrid>

			{showConfirmationPopUp && (
				<ModalLayout
					title={"Submit payroll"}
					size="sm"
					isOpen={showConfirmationPopUp}
					onClose={handleClick}
				>
					<FormLabel>Would you like to submit final processing?</FormLabel>
					<ActionButtonGroup
						submitBtnName={"Yes"}
						closeLabel="No"
						isLoading={isSubmitting}
						onClose={handleClick}
						onOpen={handleSubmit}
					/>
				</ModalLayout>
			)}
		</PageLayout>
	);
};

export default ProcessPayroll;
