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
	hideLine,
	isOnboarding,
	handlePrev,
	handleNext,
	handleClose,
	id,
}) => {
	const handleSubmitClick = () => {
		if (handleNext) {
			handleNext(id);
		} else {
			handleClose();
		}
	};
	return (
		<VStack alignItems={"start"} justifyContent={"space-between"} h={"100%"}>
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
					<Step key={index} w={"100%"} onClick={() => handleClick(index)}>
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
								completionPercentage={45}
								color="var(--primary_button_bg)"
							/>
						)}

						{/* {!hideLine && <StepSeparator />} */}
						{<StepSeparator />}
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
						name={handleNext ? "Next" : "Submit"}
						onOpen={handleSubmitClick}
					/>
				</HStack>
			)}
		</VStack>
	);
};

export default VerticalStepper;
