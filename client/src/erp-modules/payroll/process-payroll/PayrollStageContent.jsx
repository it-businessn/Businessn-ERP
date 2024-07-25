import { Collapse, HStack, Icon, useDisclosure } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect } from "react";
import { FaSortDown, FaSortUp } from "react-icons/fa6";
import AlertsViolation from "./AlertsViolation";
import InputsReview from "./InputsReview";
import Finalize from "./Finalize";
// import PayrollComplete from "./PayrollComplete";
import BoxCard from "components/ui/card";
import PayrunSetup from "./PayrunSetup";
import ReportsPreview from "./ReportsPreview";

const PayrollStageContent = ({ currentStep, steps }) => {
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
					<PayrunSetup />
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
					<InputsReview />
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
					<AlertsViolation />
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
					<ReportsPreview />
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
						<Finalize />
						{/* <PayrollComplete /> */}
					</>
				</Collapse>
			</BoxCard>
		</BoxCard>
	);
};

export default PayrollStageContent;
