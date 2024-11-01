import {
	HStack,
	Step,
	StepIcon,
	StepIndicator,
	StepSeparator,
	StepStatus,
	StepTitle,
	Stepper,
	VStack,
} from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { CircularProgressBarCell } from "utils";
import CancelButton from "./button/CancelButton";
import PrimaryButton from "./button/PrimaryButton";
import NormalTextTitle from "./NormalTextTitle";

const VerticalStepper = ({
	currentStep,
	handleClick,
	steps,
	hideProgress,
	height,
	isOnboarding,
	handlePrev,
	handleNext,
	handleClose,
	id,
	handleLinkClick,
	handleNextEnabled,
}) => {
	const handleSubmitClick = () => {
		if (handleNext) {
			handleNext(id);
		} else {
			handleClose();
		}
	};

	const handleStepClick = (step, index) => {
		if (handleClick) {
			handleClick(index);
		}
	};

	return (
		<VStack
			alignItems={"start"}
			justifyContent={"space-between"}
			h={"100%"}
			w={"100%"}
		>
			<Stepper
				index={currentStep}
				orientation="vertical"
				gap="0"
				height={height || "350px"}
				colorScheme="green"
				w={"100%"}
				cursor={"pointer"}
			>
				{steps.map((step, index) => (
					<Step
						key={index}
						w={"100%"}
						onClick={() => handleStepClick(step, index)}
					>
						<StepIndicator>
							<StepStatus
								complete={<StepIcon />}
								incomplete={<FaCheck />}
								active={<FaCheck />}
							/>
						</StepIndicator>
						<StepTitle w={"100%"}>{step.title}</StepTitle>
						{!hideProgress && (
							<CircularProgressBarCell
								completionPercentage={step.description ?? 0}
								color="var(--primary_button_bg)"
								top={"25%"}
							/>
						)}

						{isOnboarding && <StepSeparator />}
						{step?.linkTo && (
							<NormalTextTitle
								onClick={() => handleLinkClick(step?.linkTo?.path)}
								color="var(--primary_button_bg)"
								title={step?.linkTo?.title}
								size="sm"
								align="right"
								textDecoration="underline"
							/>
						)}
					</Step>
				))}
			</Stepper>
			{isOnboarding && (
				<HStack>
					<CancelButton
						name={
							<HStack>
								<FaArrowLeft />
								<NormalTextTitle title={"Prev"} size="sm" />
							</HStack>
						}
						isDisabled={!handlePrev && true}
						onClick={() => handlePrev(id)}
						size={"sm"}
					/>
					<PrimaryButton
						size={"sm"}
						isDisabled={!handleNextEnabled && true}
						name={handleNext ? "Next" : "Submit"}
						onOpen={handleSubmitClick}
					/>
				</HStack>
			)}
		</VStack>
	);
};

export default VerticalStepper;
