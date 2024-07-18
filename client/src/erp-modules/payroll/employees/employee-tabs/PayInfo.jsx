import { SimpleGrid } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import VerticalStepper from "components/ui/VerticalStepper";
import { useState } from "react";
import Record from "../Record";
import StepContent from "../StepContent";

const PayInfo = () => {
	const steps = [
		{
			title: "Earnings",
			content: (
				<Record
					title="Earnings"
					data={[
						{
							type: "Hourly",
							params: [
								{ name: "Regular Pay", param_key: "" },
								{ name: "Overtime Pay ", param_key: "" },
								{ name: "Double Overtime Pay ", param_key: "" },
								{ name: "Statutory Worked Pay ", param_key: "" },
								{ name: "Statutory Pay", param_key: "" },
								{ name: "Sick Pay  ", param_key: "" },
							],
						},
						{
							type: "Salary",
							params: [
								{ name: "Salary Rate", param_key: "" },
								{ name: "Hours per Pay", param_key: "" },
							],
						},
					]}
				/>
			),
		},
		{
			title: "Deductions",
			content: (
				<Record
					title="Deductions"
					data={[
						{
							type: "",
							params: [
								{ name: "Long Term Disability - EE", param_key: "" },
								{ name: "Dental - EE", param_key: "" },
								{ name: "Extended Health - EE ", param_key: "" },
								{ name: "Union Dues", param_key: "" },
							],
						},
						{
							type: "",
							params: [
								{ name: "Long Term Disability - ER", param_key: "" },
								{ name: "Dental - Er", param_key: "" },
								{ name: "Extended Health - ER", param_key: "" },
							],
						},
					]}
				/>
			),
		},
		{
			title: "Accruals",
			content: (
				<Record
					title="Accruals"
					data={[
						{
							type: "",
							params: [{ name: "Vacation ", param_key: "" }],
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
					hideLine
				/>
			</BoxCard>
			<StepContent currentStep={currentStep} steps={steps} />
		</SimpleGrid>
	);
};

export default PayInfo;
