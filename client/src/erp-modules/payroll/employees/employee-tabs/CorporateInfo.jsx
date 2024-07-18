import { SimpleGrid } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import VerticalStepper from "components/ui/VerticalStepper";
import { useState } from "react";
import Record from "../Record";
import StepContent from "../StepContent";

const CorporateInfo = () => {
	const ROLE_OPTIONS = [
		{
			type: "Employee",
			dependent: false,
		},
		{
			type: "Manager",
			dependent: true,
		},
		{
			type: "Enroller",
			dependent: true,
		},
		{
			type: "Administrator",
			dependent: true,
		},
	];

	const COST_CENTER_OPTIONS = [
		{
			type: "Golf Operations",
			dependent: false,
		},
		{
			type: "Restaurant",
			dependent: false,
		},
		{
			type: "Strata",
			dependent: false,
		},
		{
			type: "Management",
			dependent: false,
		},
	];

	const DEPARTMENT_OPTIONS = [
		{
			type: "Golf Maintenance",
			dependent: false,
			id: "0001-",
		},
		{
			type: "Golf Other",
			dependent: false,
			id: "0002-",
		},
		{
			type: "Restaurant Kitchen",
			dependent: false,
			id: "0003-",
		},
		{
			type: "Restaurant Front of House",
			dependent: false,
			id: "0004-",
		},
		{
			type: "Strata Maintenance",
			dependent: false,
			id: "0005-",
		},
		{
			type: "All Operations Management",
			dependent: false,
			id: "0006-",
		},
	];
	const steps = [
		{
			title: "Role ",
			content: (
				<Record
					title="Role "
					data={[
						{
							type: "",
							params: [
								{ name: "Start Date", param_key: "" },
								{ name: "Leave Date", param_key: "" },
							],
						},
						{
							type: "",
							params: [
								{
									name: "Role ",
									param_key: "",
									control: "select",
									options: ROLE_OPTIONS,
								},
							],
						},
					]}
				/>
			),
		},
		{
			title: "Company ",
			content: (
				<Record
					title="Company "
					data={[
						{
							type: "",
							params: [
								{ name: "Pay Group ", param_key: "" },
								{
									name: "Cost Center",
									param_key: "",
									control: "select",
									options: COST_CENTER_OPTIONS,
								},
								{
									name: "Department",
									param_key: "",
									control: "select",
									options: DEPARTMENT_OPTIONS,
								},
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

export default CorporateInfo;
