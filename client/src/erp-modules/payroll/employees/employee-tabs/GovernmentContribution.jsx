import { SimpleGrid } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import VerticalStepper from "components/ui/VerticalStepper";
import { useState } from "react";
import Record from "../Record";
import StepContent from "../StepContent";

const GovernmentContribution = () => {
	const steps = [
		{
			title: "Income Tax",
			content: (
				<Record
					title="Income Tax"
					data={[
						{
							type: "",
							params: [
								{ name: "Federal Tax ", param_key: "" },
								{ name: "Regional Tax ", param_key: "" },
							],
						},
						{
							type: "",
							params: [
								{ name: "Personal Federal Tax  Credit", param_key: "" },
								{ name: "Personal Regional Tax Credit", param_key: "" },
							],
						},
					]}
				/>
			),
		},
		{
			title: "Federal Government Contributions",
			content: (
				<Record
					title="Federal Government Contributions"
					data={[
						{
							type: "",
							params: [
								{ name: "Pension (EE) ", param_key: "" },
								{ name: "Employment Insurance (EE)", param_key: "" },
							],
						},
						{
							type: "",
							params: [
								{ name: "Pension (ER)", param_key: "" },
								{ name: "Employment Insurance (ER)", param_key: "" },
							],
						},
					]}
				/>
			),
		},

		{
			title: "Regional Government Deductions",
			content: (
				<Record
					title="Regional Government Deductions"
					data={[
						{
							type: "",
							params: [
								{ name: "Employee Injury", param_key: "" },
								{ name: "Employee Health ", param_key: "" },
							],
						},
						{
							type: "",
							params: [
								{ name: "Employer Injury", param_key: "" },
								{ name: "Employer Health", param_key: "" },
							],
						},
					]}
				/>
			),
		},
	];
	const [currentStep, setCurrentStep] = useState(0);
	const goToNextStep = (index) => {
		setCurrentStep(index);
	};
	return (
		<SimpleGrid
			columns={{ base: 1, md: 1, lg: 2 }}
			spacing="4"
			mr="4"
			templateColumns={{ lg: "20% 80%" }}
		>
			<BoxCard>
				<VerticalStepper
					hideProgress
					steps={steps}
					currentStep={currentStep}
					handleClick={goToNextStep}
				/>
			</BoxCard>
			<StepContent currentStep={currentStep} steps={steps} />
		</SimpleGrid>
	);
};

export default GovernmentContribution;
