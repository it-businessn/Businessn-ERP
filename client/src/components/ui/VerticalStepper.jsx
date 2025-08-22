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
import { CircularProgressBarCell } from "components/CircularProgressBarCell";
import { FaArrowLeft } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
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
	indicatorStyle,
	circleSize,
	top = "25%",
	handleSubmit,
	isDisabled,
	isLoading,
}) => {
	const handleSubmitClick = () => {
		if (handleNext) {
			if (handleSubmit) handleSubmit();
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
		<VStack alignItems={"start"} justifyContent={"space-between"} h={"100%"} w={"100%"}>
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
					<Step key={index} w={"100%"} onClick={() => handleStepClick(step, index)}>
						<StepIndicator sx={indicatorStyle}>
							<StepStatus complete={<StepIcon />} incomplete={<FaCheck />} active={<FaCheck />} />
						</StepIndicator>
						<StepTitle w={"100%"} sx={indicatorStyle}>
							{step.title}
						</StepTitle>
						{!hideProgress && (
							<CircularProgressBarCell
								completionPercentage={step.description ?? 0}
								color="var(--primary_button_bg)"
								top={top}
								size={circleSize}
							/>
						)}

						{isOnboarding && <StepSeparator />}
						{step?.linkTo && (
							<NormalTextTitle
								size="sm"
								onClick={() => handleLinkClick(step?.linkTo?.path)}
								color="var(--primary_button_bg)"
								title={step?.linkTo?.title}
								align="right"
								textDecoration="underline"
							/>
						)}
					</Step>
				))}
			</Stepper>
			{isOnboarding ? (
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
						isDisabled={isDisabled}
						name={handleNext ? "Next" : "Submit"}
						onOpen={handleSubmitClick}
					/>
				</HStack>
			) : (
				handleSubmit && (
					<HStack justifyContent="end">
						<PrimaryButton
							isDisabled={isDisabled}
							isLoading={isLoading}
							name={"Save"}
							onOpen={handleSubmit}
							loadingText="Loading"
						/>
					</HStack>
				)
			)}
		</VStack>
	);
};

export default VerticalStepper;
