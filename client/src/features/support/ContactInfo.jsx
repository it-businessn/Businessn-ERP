import { SimpleGrid, useToast } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import VerticalStepper from "components/ui/VerticalStepper";
import StepContent from "erp-modules/payroll/employees/pageview/step-content";
import Record from "erp-modules/payroll/employees/pageview/step-content/Record";
import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const ContactInfo = ({ id, handleNext, handlePrev }) => {
	const CONTACT_INFO = [
		{
			type: "sfsgdsgdsgdsg26",
			params: [
				{ name: "Your First Name", param_key: "clientFirstName", mandatory: true },
				{ name: "Your Last Name", param_key: "clientLastName", mandatory: true },
				{ name: "Email", param_key: "clientEmail", mandatory: true },
				{ name: "Phone Number", param_key: "clientPhoneNumber", mandatory: true },
				{
					name: "Preferred method of contact",
					param_key: "clientModeOfContact",
					control: "radio",
					options: ["Email", "Phone Number"],
					mandatory: true,
				},
			],
		},
	];
	const [formData, setFormData] = useState({
		clientFirstName: "",
		clientLastName: "",
		clientEmail: "",
		clientPhoneNumber: "",
		clientModeOfContact: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [isSaveDisabled, setIsSaveDisabled] = useState(true);

	useEffect(() => {
		if (
			formData.clientFirstName !== "" &&
			formData.clientLastName !== "" &&
			formData.clientEmail !== "" &&
			formData.clientPhoneNumber !== "" &&
			formData.clientModeOfContact !== ""
		) {
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
			title: "Contact Information",
			content: (
				<Record
					handleConfirm={() => ""}
					formData={formData}
					setFormData={setFormData}
					title="Contact Information"
					config={CONTACT_INFO}
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

export default ContactInfo;
