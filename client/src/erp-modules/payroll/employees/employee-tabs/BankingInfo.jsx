import { SimpleGrid } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import VerticalStepper from "components/ui/VerticalStepper";
import { useState } from "react";
import Record from "../Record";
import StepContent from "../StepContent";

const BankingInfo = () => {
	const steps = [
		{
			title: "Banking Info",
			content: (
				<Record
					title="Banking Info"
					data={[
						{
							type: "Deposit paycheque via direct deposit ",
							params: [
								{ name: "", param_key: "", control: "radio" }, //Yes and No
								{ name: "Bank", param_key: "" },
							],
						},
						{
							type: "",
							params: [
								{ name: "ss", param_key: "" },
								{ name: "Transit Number", param_key: "" },
							],
						},
						{
							type: "",
							params: [
								{ name: "ss", param_key: "" },
								{ name: "Account Number", param_key: "" },
							],
						},
					]}
				/>
			),
		},
		{
			title: "Payment Notification ",
			content: (
				<Record
					title="Payment Notification "
					data={[
						{
							type: "Send Paystub by email on pay day ",
							params: [
								{ name: "", param_key: "", control: "radio" },
								{ name: "Email ", param_key: "" },
							], //Yes and No
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

export default BankingInfo;
