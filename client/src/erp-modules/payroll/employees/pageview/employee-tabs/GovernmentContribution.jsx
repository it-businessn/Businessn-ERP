import { SimpleGrid, useToast } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import VerticalStepper from "components/ui/VerticalStepper";
import {
	EMP_CPP_EXEMPT,
	EMP_FED_GOVT_CONFIG,
	EMP_INCOME_TAX_CONFIG,
	EMP_REGN_GOVT_CONFIG,
	getInitialGovernmentInfo,
} from "config/payroll/employees/governmentInfo";
import useEmployeeGovernment from "hooks/useEmployeeGovernment";
import useSelectedEmp from "hooks/useSelectedEmp";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import StepContent from "../step-content";
import Record from "../step-content/Record";

const GovernmentContribution = ({ company, isOnboarding, handleNext, handlePrev, id }) => {
	const { empId } = useSelectedEmp(LocalStorageService.getItem("empId"));
	const onboardingEmpId = LocalStorageService.getItem("onboardingEmpId");
	const [refresh, setIsRefresh] = useState(true);
	const governmentInfo = useEmployeeGovernment(
		company,
		onboardingEmpId || empId,
		isOnboarding,
		refresh,
	);
	const setGovernmentInfo = () => getInitialGovernmentInfo(onboardingEmpId ?? empId, company);
	const [formData, setFormData] = useState(setGovernmentInfo);
	const [isDisabled, setIsDisabled] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [isCPPExempt, setIsCPPExempt] = useState(false);
	const [isEIExempt, setIsEIExempt] = useState(false);

	const toast = useToast();

	useEffect(() => {
		if (governmentInfo) {
			setFormData(governmentInfo);
			setIsCPPExempt(governmentInfo?.isCPPExempt);
			setIsEIExempt(governmentInfo?.isEIExempt);
		} else {
			setFormData(setGovernmentInfo);
		}
	}, [governmentInfo, empId]);

	const handleConfirm = () => {
		setIsDisabled(false);
	};

	const handleSubmit = async () => {
		formData.isCPPExempt = isCPPExempt !== undefined ? !isCPPExempt : false;
		setIsLoading(true);
		try {
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
			title: "CPP Exemption",
			content: (
				<Record
					handleConfirm={() => ""}
					formData={formData}
					setFormData={setFormData}
					title="CPP Exemption"
					config={EMP_CPP_EXEMPT}
					handleSubmit={handleSubmit}
					isCPPExempt={isCPPExempt}
					setIsCPPExempt={setIsCPPExempt}
					isEIExempt={isEIExempt}
					setIsEIExempt={setIsEIExempt}
					readOnly
				/>
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
					isLoading={isLoading}
					handleSubmit={handleSubmit}
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
					isLoading={isLoading}
					handleSubmit={handleSubmit}
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
					isLoading={isLoading}
					handleSubmit={handleSubmit}
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
					isOnboarding={isOnboarding}
					handleNext={handleNext}
					handlePrev={handlePrev}
					id={id}
					handleNextEnabled={true}
				/>
			</BoxCard>
			<StepContent currentStep={currentStep} steps={steps} isOnboarding={isOnboarding} />
		</SimpleGrid>
	);
};

export default GovernmentContribution;
