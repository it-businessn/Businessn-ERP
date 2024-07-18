import {
	Step,
	StepIcon,
	StepIndicator,
	StepSeparator,
	StepStatus,
	StepTitle,
	Stepper,
} from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa6";
import { CircularProgressBarCell } from "utils";

const VerticalStepper = ({
	currentStep,
	handleClick,
	steps,
	hideProgress,
	height,
	hideLine,
}) => {
	return (
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
	);
};

export default VerticalStepper;
