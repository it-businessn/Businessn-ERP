import { SimpleGrid, useToast } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import VerticalStepper from "components/ui/VerticalStepper";
import {
	EMP_COMPANY_CONFIG,
	EMP_REGION_CONFIG,
	EMP_ROLE_CONFIG,
	getInitialCorporateInfo,
} from "config/payroll/employees/employmentInfo";
import useEmployeeEmploymentInfo from "hooks/useEmployeeEmploymentInfo";
import usePaygroup from "hooks/usePaygroup";
import useSelectedEmp from "hooks/useSelectedEmp";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import StepContent from "../step-content";
import Record from "../step-content/Record";

const CorporateInfo = ({
	company,
	isOnboarding,
	selectedPayGroupName,
	id,
	handleNext,
	handlePrev,
}) => {
	const { empId } = useSelectedEmp();
	const employmentInfo = useEmployeeEmploymentInfo(
		company,
		empId,
		true,
		false,
		false,
		isOnboarding,
	);
	const onboardingEmpId = LocalStorageService.getItem("onboardingEmpId");
	const setCorporateInfo = getInitialCorporateInfo(
		onboardingEmpId ?? empId,
		company,
		selectedPayGroupName,
	);
	const [formData, setFormData] = useState(setCorporateInfo);
	const [isDisabled, setIsDisabled] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const { payGroups } = usePaygroup(company, false);

	useEffect(() => {
		if (payGroups) {
			EMP_COMPANY_CONFIG.find(
				(_) =>
					(_.params.find((param) => param.name === "Pay Group").options =
						payGroups),
			);
		}
	}, [payGroups]);

	useEffect(() => {
		if (employmentInfo) {
			setFormData(employmentInfo);
		} else {
			setFormData(setCorporateInfo);
		}
	}, [employmentInfo, empId]);

	const handleConfirm = () => {
		setIsDisabled(false);
	};

	const toast = useToast();
	const handleSubmit = async () => {
		setIsLoading(true);
		try {
			await PayrollService.addEmployeeEmploymentInfo(formData);
			setIsLoading(false);
			// setIsDisabled(true);
			toast({
				title: "Employment info updated successfully.",
				status: "success",
				duration: 1000,
				isClosable: true,
			});
		} catch (error) {}
	};

	const steps = [
		{
			title: "Role",
			content: (
				<Record
					isOnboarding={isOnboarding}
					handleConfirm={handleConfirm}
					formData={formData}
					setFormData={setFormData}
					title="Role"
					config={EMP_ROLE_CONFIG}
					isLoading={isLoading}
					isDisabled={isDisabled}
					handleSubmit={handleSubmit}
				/>
			),
		},
		{
			title: "Company",
			content: (
				<Record
					handleConfirm={handleConfirm}
					formData={formData}
					setFormData={setFormData}
					title="Company"
					config={EMP_COMPANY_CONFIG}
					isLoading={isLoading}
					isDisabled={isDisabled}
					handleSubmit={handleSubmit}
				/>
			),
		},
		{
			title: "Region",
			content: (
				<Record
					handleConfirm={handleConfirm}
					formData={formData}
					setFormData={setFormData}
					title="Region"
					config={EMP_REGION_CONFIG}
					isLoading={isLoading}
					isDisabled={isDisabled}
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
					id={id}
					handleNext={handleNext}
					handlePrev={handlePrev}
					handleNextEnabled={!isDisabled}
				/>
			</BoxCard>
			<StepContent currentStep={currentStep} steps={steps} />
		</SimpleGrid>
	);
};

export default CorporateInfo;
