import { SimpleGrid } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import VerticalStepper from "components/ui/VerticalStepper";
import { useState } from "react";
import Record from "../Record";
import StepContent from "../StepContent";

const PersonalInfo = () => {
	const steps = [
		{
			title: "Identification and Status",
			content: (
				<Record
					title="Identification and Status"
					data={[
						{
							type: "",
							params: [{ name: "Status", param_key: "" }],
						},
						{
							type: "",
							params: [{ name: "Employee Number", param_key: "" }],
						},
						{
							type: "",
							params: [{ name: "Time Management Badge ID", param_key: "" }],
						},
					]}
				/>
			),
		},
		{
			title: "Personal Information",
			content: (
				<Record
					title="Personal Information"
					data={[
						{
							type: "",
							params: [
								{ name: "First Name", param_key: "" },
								{ name: "Birthday", param_key: "" },
								{ name: "Social Insurance Number", param_key: "" },
								{ name: "Marital Status", param_key: "" },
								{ name: "Citizenship", param_key: "" },
								{ name: "Work Permit Number", param_key: "" },
							],
						},
						{
							type: "",
							params: [
								{ name: "Last Name", param_key: "" },
								{ name: "ss", param_key: "" },
								{ name: "ss", param_key: "" },
								{ name: "ss", param_key: "" },
								{ name: "ss", param_key: "" },
								{ name: "Work Permit Expiry", param_key: "" },
							],
						},
					]}
				/>
			),
		},
		{
			title: "Contact",
			content: (
				<Record
					title="Contact"
					data={[
						{
							type: "",
							params: [
								{ name: "Personal Email ", param_key: "" },
								{ name: "Personal Phone", param_key: "" },
								{ name: "Address", param_key: "" },
								{ name: "Street Address", param_key: "" },
								{ name: "City ", param_key: "" },
								{ name: "Province/State", param_key: "" },
								{ name: "Country ", param_key: "" },
								{ name: "Postal Code ", param_key: "" },
							],
						},
						{
							type: "",
							params: [
								{ name: "Work Email", param_key: "" },
								{ name: "Work Phone", param_key: "" },
							],
						},
					]}
				/>
			),
		},
		{
			title: "Emergency Contact",
			content: (
				<Record
					title="Emergency Contact"
					data={[
						{
							type: "",
							params: [
								{ name: "First Name ", param_key: "" },
								{ name: "Personal Email ", param_key: "" },
								{ name: "Personal Phone", param_key: "" },
							],
						},
						{
							type: "",
							params: [{ name: "Last Name", param_key: "" }],
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

export default PersonalInfo;
