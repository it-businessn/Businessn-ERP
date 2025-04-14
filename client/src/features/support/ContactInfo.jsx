import { SimpleGrid, useToast } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import VerticalStepper from "components/ui/VerticalStepper";
import StepContent from "erp-modules/payroll/employees/pageview/step-content";
import Record from "erp-modules/payroll/employees/pageview/step-content/Record";
import { useEffect, useState } from "react";
import { useBreakpointValue } from "services/Breakpoint";
import LocalStorageService from "services/LocalStorageService";
import TicketService from "services/TicketService";

const ContactInfo = ({ id, handleNext, handlePrev }) => {
	const { isMobile, isIpad } = useBreakpointValue();
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
	const ticketId = LocalStorageService.getItem("ticketId");

	const [formData, setFormData] = useState({
		_id: ticketId,
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
		setIsLoading(true);
		try {
			await TicketService.updateInfo(formData, formData._id);
			setIsLoading(false);
			toast({
				title: "Contact info added successfully.",
				status: "success",
				duration: 1000,
				isClosable: true,
			});
		} catch (error) {}
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
			{isMobile || isIpad ? (
				<></>
			) : (
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
			)}
			<StepContent currentStep={currentStep} steps={steps} h={(isMobile || isIpad) && "auto"} />
		</SimpleGrid>
	);
};

export default ContactInfo;
