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

const VerticalStepper = ({ currentStep }) => {
	const steps = [
		{ title: "Approvals", description: "Contact Info" },
		{ title: "Leave Adjustment", description: "Date & Time" },
		{ title: "New Employees", description: "Select Employees" },
		{ title: "Termination", description: "" },
		{ title: "Alerts and Violations", description: "" },
		{ title: "Review Reports", description: "" },
		{ title: "Submit", description: "" },
	];
	const { activeStep } = useSteps({
		index: 1,
		count: steps.length,
	});

	return (
		<Stepper
			index={activeStep}
			orientation="vertical"
			gap="0"
			height={"350px"}
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
					<CircularProgressBarCell completionPercentage={45} />

					<StepSeparator />
				</Step>
			))}
		</Stepper>
	);
};

export default VerticalStepper;
