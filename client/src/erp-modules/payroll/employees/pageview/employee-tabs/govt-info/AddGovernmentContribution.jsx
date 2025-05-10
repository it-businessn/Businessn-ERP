import { Checkbox, FormLabel, HStack, SimpleGrid, Stack, useToast } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import TextTitle from "components/ui/text/TextTitle";
import VerticalStepper from "components/ui/VerticalStepper";
import {
	EMP_FED_GOVT_CONFIG,
	EMP_INCOME_TAX_CONFIG,
	EMP_REGN_GOVT_CONFIG,
	getInitialGovernmentInfo,
} from "config/payroll/employees/governmentInfo";
import useEmployeeGovernment from "hooks/useEmployeeGovernment";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import StepContent from "../../step-content";
import Record from "../../step-content/Record";

const AddGovernmentContribution = ({ company, handleNext, handlePrev, id }) => {
	const toast = useToast();
	const onboardingEmpId = LocalStorageService.getItem("onboardingEmpId");
	const [refresh, setIsRefresh] = useState(true);
	const governmentInfo = useEmployeeGovernment(company, onboardingEmpId, refresh);
	const setGovernmentInfo = () => getInitialGovernmentInfo(onboardingEmpId, company);
	const [formData, setFormData] = useState(setGovernmentInfo);
	const [isDisabled, setIsDisabled] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isCPPExempt, setIsCPPExempt] = useState(false);
	const [isEIExempt, setIsEIExempt] = useState(false);
	const [currentStep, setCurrentStep] = useState(0);

	useEffect(() => {
		if (governmentInfo) {
			setFormData(governmentInfo);
			setIsCPPExempt(governmentInfo?.isCPPExempt);
			setIsEIExempt(governmentInfo?.isEIExempt);
		} else {
			setFormData(setGovernmentInfo);
		}
	}, [governmentInfo, onboardingEmpId]);

	useEffect(() => {
		setFormData((prev) => ({
			...prev,
			isCPPExempt,
			isEIExempt,
		}));
	}, [isCPPExempt, isEIExempt]);

	const handleSubmit = async () => {
		setIsLoading(true);
		try {
			formData.companyName = company;
			await PayrollService.addEmployeeGovernmentInfo(formData);
			setIsLoading(false);
			// setIsDisabled(true);
			toast({
				title: "Government info updated successfully.",
				status: "success",
				duration: 1000,
				isClosable: true,
			});
			setIsRefresh((prev) => !prev);
		} catch (error) {}
	};

	const steps = [
		{
			title: "Exemption",
			content: (
				<Stack>
					<TextTitle title={"Exemption"} />
					<HStack w="40%" justify="space-between">
						<Checkbox
							colorScheme="facebook"
							isChecked={isCPPExempt}
							onChange={() => setIsCPPExempt(!isCPPExempt)}
						>
							<FormLabel>Is CPP/QPP Exempt</FormLabel>
						</Checkbox>
						<Checkbox
							colorScheme="facebook"
							isChecked={isEIExempt}
							onChange={() => setIsEIExempt(!isEIExempt)}
						>
							<FormLabel>Is EI Exempt</FormLabel>
						</Checkbox>
					</HStack>
				</Stack>
			),
		},
		{
			title: "Income Tax",
			content: (
				<Record
					handleConfirm={() => ""}
					formData={formData}
					setFormData={setFormData}
					title="Income Tax"
					config={EMP_INCOME_TAX_CONFIG}
				/>
			),
		},
		{
			title: "Federal Government Contributions",
			content: (
				<Record
					handleConfirm={() => ""}
					formData={formData}
					setFormData={setFormData}
					title="Federal Government Contributions"
					config={EMP_FED_GOVT_CONFIG}
				/>
			),
		},

		{
			title: "Regional Government Deductions",
			content: (
				<Record
					handleConfirm={() => ""}
					formData={formData}
					setFormData={setFormData}
					title="Regional Government Deductions"
					config={EMP_REGN_GOVT_CONFIG}
				/>
			),
		},
	];

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
					isOnboarding={true}
					handleNext={handleNext}
					handlePrev={handlePrev}
					id={id}
					isLoading={isLoading}
					handleSubmit={handleSubmit}
					isDisabled={isDisabled}
				/>
			</BoxCard>
			<StepContent currentStep={currentStep} steps={steps} isOnboarding={true} />
		</SimpleGrid>
	);
};

export default AddGovernmentContribution;
