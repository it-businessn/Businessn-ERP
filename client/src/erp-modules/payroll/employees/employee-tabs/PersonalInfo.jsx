import { SimpleGrid, useToast } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import VerticalStepper from "components/ui/VerticalStepper";
import {
	EMP_CONTACT_CONFIG,
	EMP_EMERGENCY_CONTACT_CONFIG,
	EMP_IDENTIFICATION_STATUS_CONFIG,
	EMP_PERSONAL_INFO_CONFIG,
	getInitialProfileInfo,
} from "config/payroll/employees/profileInfo";
import useEmployeeProfileInfo from "hooks/useEmployeeProfileInfo";
import useSelectedEmp from "hooks/useSelectedEmp";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import StepContent from "../step-content";
import Record from "../step-content/Record";

const PersonalInfo = ({ company, isOnboarding, id, handleNext }) => {
	const { empId } = useSelectedEmp();
	const profileInfo = useEmployeeProfileInfo(company, empId, isOnboarding);

	const setProfileInfo = () =>
		getInitialProfileInfo(isOnboarding ? null : empId, company);
	const [formData, setFormData] = useState(setProfileInfo);
	const [isDisabled, setIsDisabled] = useState(true);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (profileInfo) {
			setFormData(profileInfo);
			LocalStorageService.removeItem("onboardingEmpId");
		} else {
			setFormData(setProfileInfo);
		}
	}, [profileInfo, empId]);

	const handleConfirm = () => {
		if (
			formData.firstName &&
			formData.birthDate &&
			formData.employeeNo &&
			formData.personalEmail &&
			formData.streetAddress &&
			formData.city &&
			formData.province &&
			formData.country &&
			formData.postalCode
		) {
			setIsDisabled(false);
		}
	};
	const toast = useToast();

	const handleSubmit = async () => {
		setIsLoading(true);
		try {
			const result = await PayrollService.addEmployeeProfileInfo(formData);
			setIsLoading(false);
			setIsDisabled(true);
			LocalStorageService.setItem("onboardingEmpId", result.data._id);
			toast({
				title: "Personal info added successfully.",
				status: "success",
				duration: 1000,
				isClosable: true,
			});
		} catch (error) {}
	};

	const steps = [
		{
			title: "Personal Information",
			content: (
				<Record
					handleConfirm={handleConfirm}
					formData={formData}
					setFormData={setFormData}
					title="Personal Information"
					config={EMP_PERSONAL_INFO_CONFIG}
					isLoading={isLoading}
					isDisabled={isDisabled}
					handleSubmit={handleSubmit}
					isOnboarding={isOnboarding}
				/>
			),
		},
		{
			title: "Identification and Status",
			content: (
				<Record
					handleConfirm={handleConfirm}
					formData={formData}
					setFormData={setFormData}
					title="Identification and Status"
					config={EMP_IDENTIFICATION_STATUS_CONFIG}
					isLoading={isLoading}
					isDisabled={isDisabled}
					handleSubmit={handleSubmit}
				/>
			),
		},
		{
			title: "Contact",
			content: (
				<Record
					handleConfirm={handleConfirm}
					formData={formData}
					setFormData={setFormData}
					title="Contact"
					config={EMP_CONTACT_CONFIG}
					isLoading={isLoading}
					isDisabled={isDisabled}
					handleSubmit={handleSubmit}
				/>
			),
		},
		{
			title: "Emergency Contact",
			content: (
				<Record
					handleConfirm={handleConfirm}
					formData={formData}
					setFormData={setFormData}
					title="Emergency Contact"
					config={EMP_EMERGENCY_CONTACT_CONFIG}
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
				/>
			</BoxCard>
			<StepContent
				currentStep={currentStep}
				steps={steps}
				isOnboarding={isOnboarding}
			/>
		</SimpleGrid>
	);
};

export default PersonalInfo;
