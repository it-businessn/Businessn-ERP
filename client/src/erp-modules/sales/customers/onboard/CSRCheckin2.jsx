import StepperBoxLayout from "components/ui/StepperBoxLayout";
import TextTitle from "components/ui/text/TextTitle";
import { useState } from "react";

const CSRCheckin2 = ({ id, handleNext }) => {
	const steps = [
		{
			title: "Personal Information",
			content: <TextTitle title="Welcome Call" />,
		},
		{
			title: "Contact",
			content: <TextTitle title="Welcome Call" />,
		},
		{
			title: "Emergency Contact",
			content: <TextTitle title="Welcome Call" />,
		},
	];
	const [currentStep, setCurrentStep] = useState(0);
	const goToNextStep = (index) => {
		setCurrentStep(index);
	};
	return (
		<StepperBoxLayout
			steps={steps}
			currentStep={currentStep}
			goToNextStep={goToNextStep}
			isOnboarding={true}
			id={id}
			handleNext={handleNext}
			handleNextEnabled={true}
		/>
	);
};

export default CSRCheckin2;
