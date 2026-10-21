import { SimpleGrid } from "@chakra-ui/react";
import StepContent from "erp-modules/payroll/employees/pageview/step-content";
import BoxCard from "./card";
import VerticalStepper from "./VerticalStepper";

const StepperBoxLayout = ({
	steps,
	currentStep,
	goToNextStep,
	isOnboarding,
	id,
	handleNext,
	handleNextEnabled,
}) => {
	return (
		<SimpleGrid
			columns={{ base: 1, md: 1, lg: 2 }}
			spacing="4"
			mr="4"
			templateColumns={{ base: "minmax(0, 1fr)", lg: "minmax(0, 20fr) minmax(0, 80fr)" }}
		>
			<BoxCard>
				<VerticalStepper
					hideProgress
					steps={steps}
					currentStep={currentStep}
					handleClick={goToNextStep}
					isOnboarding={isOnboarding}
					id={id}
					handleNext={handleNext}
					handleNextEnabled={handleNextEnabled}
				/>
			</BoxCard>
			<StepContent currentStep={currentStep} steps={steps} isOnboarding={isOnboarding} />
		</SimpleGrid>
	);
};

export default StepperBoxLayout;
