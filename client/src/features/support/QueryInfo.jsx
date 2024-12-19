import { SimpleGrid, useToast } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import VerticalStepper from "components/ui/VerticalStepper";
import StepContent from "erp-modules/payroll/employees/pageview/step-content";
import Record from "erp-modules/payroll/employees/pageview/step-content/Record";
import { useEffect, useState } from "react";

const QueryInfo = ({ id, handleNext, handlePrev }) => {
	const INQUIRIES = [
		{ name: "Price related inquiry", id: "price" },
		{ name: "Client Experience or Support Inquiry", id: "support" },
		{ name: "Product Experience/Concern", id: "product_experience" },
		{ name: "Delivery", id: "delivery" },
		{ name: "New Client or product onboarding", id: "onboard" },
		{ name: "Tax inquiry", id: "tax" },
	];

	const QUERY_INFO = [
		{
			type: "sfsgdsgdsgdsg26",
			params: [
				{
					name: "Type of Inquiry",
					param_key: "inquiryType",
					mandatory: true,
					control: "select",
					options: INQUIRIES,
				},
				{
					name: "Describe the issue",
					control: "textarea",
					param_key: "issue",
					mandatory: true,
				},
			],
		},
	];
	const [formData, setFormData] = useState({
		inquiryType: "",
		issue: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [isSaveDisabled, setIsSaveDisabled] = useState(true);

	useEffect(() => {
		if (formData.inquiryType !== "" && formData.issue !== "") {
			setIsSaveDisabled(false);
		}
	}, [formData]);

	const toast = useToast();

	const handleSubmit = async () => {
		// setIsLoading(true);
		// try {
		// 	const result = await PayrollService.addEmployeeProfileInfo(formData);
		// 	setIsLoading(false);
		// 	toast({
		// 		title: "Personal info added successfully.",
		// 		status: "success",
		// 		duration: 1000,
		// 		isClosable: true,
		// 	});
		// } catch (error) {}
	};

	const steps = [
		{
			title: "Your Query",
			content: (
				<Record
					handleConfirm={() => ""}
					formData={formData}
					setFormData={setFormData}
					title="Your Query"
					config={QUERY_INFO}
					isLoading={isLoading}
					handleSubmit={handleSubmit}
					isDisabled={isSaveDisabled}
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
					id={id}
					handleNext={handleNext}
					handlePrev={handlePrev}
				/>
			</BoxCard>
			<StepContent currentStep={currentStep} steps={steps} />
		</SimpleGrid>
	);
};

export default QueryInfo;