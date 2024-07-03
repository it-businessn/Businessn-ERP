import {
	Step,
	StepIcon,
	StepIndicator,
	StepSeparator,
	StepStatus,
	StepTitle,
	Stepper,
	useSteps,
} from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa6";
import { CircularProgressBarCell } from "utils";

const VerticalStepper = ({ currentStep, steps, hideProgress, height }) => {
	const { activeStep } = useSteps({
		index: 1,
		count: steps.length,
	});

	return (
		<Stepper
			index={activeStep}
			orientation="vertical"
			gap="0"
			height={height || "350px"}
			colorScheme="green"
			w={"100%"}
		>
			{steps.map((step, index) => (
				<Step key={index} w={"100%"}>
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

					<StepSeparator />
				</Step>
			))}
		</Stepper>
	);
};

export default VerticalStepper;
