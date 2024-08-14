import { Collapse, HStack, Icon, useDisclosure } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useState } from "react";
import { FaSortDown, FaSortUp } from "react-icons/fa6";
import AlertsViolation from "./AlertsViolation";
import Finalize from "./Finalize";
import InputsReview from "./InputsReview";
// import PayrollComplete from "./PayrollComplete";
import BoxCard from "components/ui/card";
import PayrunSetup from "./PayrunSetup";
import ReportsPreview from "./ReportsPreview";

const PayrollStageContent = ({ currentStep, steps, handleConfirm }) => {
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
			<BoxCard>
				<HStack spacing={2} align={"center"} onClick={onPayrollStepupToggle}>
					{isPayrollStepupOpen ? (
						<Icon
							as={FaSortDown}
							// onClick={() => handleChangeDate("prev")}
							boxSize="5"
							color="fg.muted"
						/>
					) : (
						<Icon
							as={FaSortUp}
							// onClick={() => handleChangeDate("prev")}
							boxSize="5"
							color="fg.muted"
						/>
					)}

					<TextTitle mt={1} weight="normal" title={"Payrun Setup"} />
				</HStack>
				<Collapse in={isPayrollStepupOpen}>
					<PayrunSetup
						handleClick={() => {
							handleConfirm(1);
							onPayrollStepupToggle();
						}}
					/>
				</Collapse>
			</BoxCard>

			<BoxCard>
				<HStack spacing={2} align={"center"} onClick={onInputsReviewToggle}>
					{isInputsReviewOpen ? (
						<Icon
							as={FaSortDown}
							// onClick={() => handleChangeDate("prev")}
							boxSize="5"
							color="fg.muted"
						/>
					) : (
						<Icon
							as={FaSortUp}
							// onClick={() => handleChangeDate("prev")}
							boxSize="5"
							color="fg.muted"
						/>
					)}

					<TextTitle mt={1} weight="normal" title={"Inputs Review"} />
				</HStack>
				<Collapse in={isInputsReviewOpen}>
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
					/>
				</Collapse>
			</BoxCard>
			<BoxCard>
				<HStack spacing={2} align={"center"} onClick={onAlertsOpenToggle}>
					{isAlertsOpen ? (
						<Icon
							as={FaSortDown}
							// onClick={() => handleChangeDate("prev")}
							boxSize="5"
							color="fg.muted"
						/>
					) : (
						<Icon
							as={FaSortUp}
							// onClick={() => handleChangeDate("prev")}
							boxSize="5"
							color="fg.muted"
						/>
					)}

					<TextTitle mt={1} weight="normal" title={"Alerts and Violations"} />
				</HStack>
				<Collapse in={isAlertsOpen}>
					<AlertsViolation
						currentStep={currentStep}
						isAlertsOpen={isAlertsOpen}
						handleClick={() => {
							handleConfirm(3);
							onAlertsOpenToggle();
						}}
					/>
				</Collapse>
			</BoxCard>
			<BoxCard>
				<HStack spacing={2} align={"center"} onClick={onReportsToggle}>
					{isReportsOpen ? (
						<Icon
							as={FaSortDown}
							// onClick={() => handleChangeDate("prev")}
							boxSize="5"
							color="fg.muted"
						/>
					) : (
						<Icon
							as={FaSortUp}
							// onClick={() => handleChangeDate("prev")}
							boxSize="5"
							color="fg.muted"
						/>
					)}

					<TextTitle mt={1} weight="normal" title={"Review Reports"} />
				</HStack>
				<Collapse in={isReportsOpen}>
					<ReportsPreview
						reportData={reportData}
						handleClick={() => {
							handleConfirm(4);
							onReportsToggle();
						}}
					/>
				</Collapse>
			</BoxCard>
			<BoxCard>
				<HStack spacing={2} align={"center"} onClick={onFinalizeToggle}>
					{isFinalizeOpen ? (
						<Icon
							as={FaSortDown}
							// onClick={() => handleChangeDate("prev")}
							boxSize="5"
							color="fg.muted"
						/>
					) : (
						<Icon
							as={FaSortUp}
							// onClick={() => handleChangeDate("prev")}
							boxSize="5"
							color="fg.muted"
						/>
					)}

					<TextTitle mt={1} weight="normal" title={"Finalize"} />
				</HStack>
				<Collapse in={isFinalizeOpen}>
					<>
						<Finalize
							handleClick={() => {
								handleConfirm(5);
								onFinalizeToggle();
							}}
						/>
						{/* <PayrollComplete /> */}
					</>
				</Collapse>
			</BoxCard>
		</BoxCard>
	);
};

export default PayrollStageContent;
