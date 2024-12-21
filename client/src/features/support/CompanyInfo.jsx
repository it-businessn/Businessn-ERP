import { SimpleGrid, useToast } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import VerticalStepper from "components/ui/VerticalStepper";
import StepContent from "erp-modules/payroll/employees/pageview/step-content";
import Record from "erp-modules/payroll/employees/pageview/step-content/Record";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import TicketService from "services/TicketService";

const CompanyInfo = ({ id, handleNext }) => {
	const COMPANY_INFO = [
		{
			type: "sfsgdsgdsgdsg26",
			params: [
				{ name: "Company Name", param_key: "companyName", mandatory: true },
				{ name: "Client ID", param_key: "clientId", mandatory: true },
			],
		},
	];
	const [formData, setFormData] = useState({
		companyName: "",
		clientId: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [isSaveDisabled, setIsSaveDisabled] = useState(true);

	useEffect(() => {
		if (formData.companyName !== "" && formData.clientId !== "") {
			setIsSaveDisabled(false);
		}
	}, [formData]);

	const toast = useToast();

	const handleSubmit = async () => {
		setIsLoading(true);
		try {
			const { data } = await TicketService.addInfo(formData);
			LocalStorageService.setItem("ticketId", data._id);
			setIsLoading(false);
			toast({
				title: "Company info added successfully.",
				status: "success",
				duration: 1000,
				isClosable: true,
			});
		} catch (error) {}
	};

	const steps = [
		{
			title: "Company Information",
			content: (
				<Record
					handleConfirm={() => ""}
					formData={formData}
					setFormData={setFormData}
					title="Company Information"
					config={COMPANY_INFO}
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
				/>
			</BoxCard>
			<StepContent currentStep={currentStep} steps={steps} />
		</SimpleGrid>
	);
};

export default CompanyInfo;
