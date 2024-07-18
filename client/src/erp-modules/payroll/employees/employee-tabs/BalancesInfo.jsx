import { SimpleGrid } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import VerticalStepper from "components/ui/VerticalStepper";
import { useState } from "react";
import Record from "../Record";
import StepContent from "../StepContent";

const BalancesInfo = () => {
	const steps = [
		{
			title: "Vacation ",
			content: (
				<Record
					title="Vacation "
					data={[
						{
							type: "",
							params: [
								{ name: "Available Balance", param_key: "" },
								{ name: "Available at the Start of the Year", param_key: "" },
							],
						},
						{
							type: "",
							params: [
								{ name: "ss", param_key: "" },
								{ name: "Accrued This Year", param_key: "" },
							],
						},

						{
							type: "",
							params: [
								{ name: "ss", param_key: "" },
								{ name: "Used this year", param_key: "" },
							],
						},
					]}
				/>
			),
		},
		{
			title: "YTD Earnings",
			content: (
				<Record
					title="YTD Earnings"
					data={[
						{
							type: "Hours",
							params: [
								{ name: "Regular Pay ", param_key: "" },
								{ name: "Overtime Pay ", param_key: "" },
								{ name: "Double Overtime Pay ", param_key: "" },
								{ name: "Statutory Worked Pay", param_key: "" },
								{ name: "Statutory Pay", param_key: "" },
								{ name: "Sick Pay ", param_key: "" },
								{ name: "Vacation Pay", param_key: "" },
							],
						},
						{
							type: "Dollars",
							params: [
								{ name: "Regular Pay ", param_key: "" },
								{ name: "Overtime Pay ", param_key: "" },
								{ name: "Double Overtime Pay ", param_key: "" },
								{ name: "Statutory Worked Pay", param_key: "" },
								{ name: "Statutory Pay", param_key: "" },
								{ name: "Sick Pay ", param_key: "" },
								{ name: "Vacation Pay", param_key: "" },
							],
						},
					]}
				/>
			),
		},
		{
			title: "YTD Deductions",
			content: (
				<Record
					title="YTD Deductions"
					data={[
						{
							type: "Dollars",
							params: [
								{ name: "Long Term Disability - EE", param_key: "" },
								{ name: "Dental - EE", param_key: "" },
								{ name: "Extended Health - EE ", param_key: "" },
								{ name: "Union Dues", param_key: "" },
							],
						},
						{
							type: "Dollars",
							params: [
								{ name: "Long Term Disability - ER", param_key: "" },
								{ name: "Dental - ER", param_key: "" },
								{ name: "Extended Health - ER", param_key: "" },
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

export default BalancesInfo;
