import { useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import AlertsViolation from "./AlertsViolation";
import Finalize from "./Finalize";
import InputsReview from "./InputsReview";
// import PayrollComplete from "./PayrollComplete";
import BoxCard from "components/ui/card";
import PayrollStageStep from "./PayrollStageStep";
import PayrunSetup from "./PayrunSetup";
import ReportsPreview from "./ReportsPreview";

const PayrollStageContent = ({
	currentStep,
	handleConfirm,
	payGroupSchedule,
	closestRecord,
	selectedPayGroup,
	payGroups,
}) => {
	const { isOpen: isPayrollStepupOpen, onToggle: onPayrollStepupToggle } =
		useDisclosure({
			defaultIsOpen: false,
		});
	const { isOpen: isInputsReviewOpen, onToggle: onInputsReviewToggle } =
		useDisclosure({
			defaultIsOpen: false,
		});
	const { isOpen: isAlertsOpen, onToggle: onAlertsOpenToggle } = useDisclosure({
		defaultIsOpen: false,
	});
	const { isOpen: isReportsOpen, onToggle: onReportsToggle } = useDisclosure({
		defaultIsOpen: false,
	});
	const { isOpen: isFinalizeOpen, onToggle: onFinalizeToggle } = useDisclosure({
		defaultIsOpen: false,
	});

	const [reportData, setReportData] = useState(null);

	useEffect(() => {
		handleStepChange();
	}, [currentStep]);

	const handleStepChange = () => {
		if (currentStep === 0) {
			onPayrollStepupToggle();
		} else if (currentStep === 1) {
			onInputsReviewToggle();
		} else if (currentStep === 2) {
			onAlertsOpenToggle();
		} else if (currentStep === 3) {
			onReportsToggle();
		} else if (currentStep === 4) {
			onFinalizeToggle();
		}
	};

	return (
		<BoxCard>
			<PayrollStageStep
				onClick={() => {
					if (currentStep === 0) {
						onPayrollStepupToggle();
					}
				}}
				isOpen={isPayrollStepupOpen}
				title={"Payrun Setup"}
				content={
					<PayrunSetup
						handleClick={() => {
							handleConfirm(1);
							onPayrollStepupToggle();
						}}
						payGroups={payGroups}
						selectedPayGroup={selectedPayGroup}
						payGroupSchedule={payGroupSchedule}
						closestRecord={closestRecord}
					/>
				}
			/>
			<PayrollStageStep
				onClick={() => {
					if (currentStep === 1) {
						onInputsReviewToggle();
					}
				}}
				isOpen={isInputsReviewOpen}
				title={"Inputs Review"}
				content={
					<InputsReview
						currentStep={currentStep}
						isInputsReviewOpen={isInputsReviewOpen}
						handleClick={(data) => {
							if (data) {
								setReportData(data);
							}
							handleConfirm(2);
							onInputsReviewToggle();
						}}
						payGroupSchedule={payGroupSchedule}
						closestRecord={closestRecord}
					/>
				}
			/>
			<PayrollStageStep
				onClick={() => {
					if (currentStep === 2) {
						onAlertsOpenToggle();
					}
				}}
				isOpen={isAlertsOpen}
				title={"Alerts and Violations"}
				content={
					<AlertsViolation
						currentStep={currentStep}
						isAlertsOpen={isAlertsOpen}
						handleClick={() => {
							handleConfirm(3);
							onAlertsOpenToggle();
						}}
						payGroupSchedule={payGroupSchedule}
						closestRecord={closestRecord}
					/>
				}
			/>
			<PayrollStageStep
				onClick={() => {
					if (currentStep === 3) {
						onReportsToggle();
					}
				}}
				isOpen={isReportsOpen}
				title={"Review Reports"}
				content={
					<ReportsPreview
						reportData={reportData}
						handleClick={() => {
							handleConfirm(4);
							onReportsToggle();
						}}
						payPeriodNum={closestRecord?.payPeriod}
					/>
				}
			/>
			<PayrollStageStep
				onClick={() => {
					if (currentStep === 4) {
						onFinalizeToggle();
					}
				}}
				isOpen={isFinalizeOpen}
				title={"Finalize"}
				content={
					<Finalize
						handleClick={() => {
							handleConfirm(5);
							// onFinalizeToggle();
						}}
					/>
				}
			/>
		</BoxCard>
	);
};

export default PayrollStageContent;
