import { Collapse, HStack, Icon, useDisclosure } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect } from "react";
import { FaSortDown, FaSortUp } from "react-icons/fa6";
import AlertsViolation from "./AlertsViolation";
import Finalize from "./Finalize";
import InputsReview from "./InputsReview";
// import PayrollComplete from "./PayrollComplete";
import BoxCard from "components/ui/card";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "routes";
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
	const navigate = useNavigate();
	const handleReview = () =>
		navigate(`${ROUTE_PATH.PAYROLL}${ROUTE_PATH.WORKVIEW}`);
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
							handleConfirm(currentStep + 1);
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
						handleReview={handleReview}
						handleClick={() => {
							handleConfirm(currentStep + 1);
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
						handleReview={handleReview}
						handleClick={() => {
							handleConfirm(currentStep + 1);
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
						handleReview={handleReview}
						handleClick={() => {
							handleConfirm(currentStep + 1);
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
								handleConfirm(currentStep + 1);
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
