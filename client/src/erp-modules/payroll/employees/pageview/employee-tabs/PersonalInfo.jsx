import { SimpleGrid, useToast } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import VerticalStepper from "components/ui/VerticalStepper";
import {
	EMP_CONTACT_CONFIG,
	EMP_EMERGENCY_CONTACT_CONFIG,
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
	const { empId } = useSelectedEmp(LocalStorageService.getItem("empId"));
	const onboardingEmpId = LocalStorageService.getItem("onboardingEmpId");
	const userId = isOnboarding ? onboardingEmpId : empId;
	const profileInfo = useEmployeeProfileInfo(company, userId, isOnboarding);

	const setProfileInfo = () => getInitialProfileInfo(isOnboarding ? null : empId, company);
	const [formData, setFormData] = useState(setProfileInfo);
	const [isSave1Disabled, setIsSave1Disabled] = useState(true);
	const [isSave2Disabled, setIsSave2Disabled] = useState(true);
	const [isSave3Disabled, setIsSave3Disabled] = useState(true);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		LocalStorageService.removeItem("onboardingEmpId");
		if (profileInfo) {
			if (profileInfo.email) {
				profileInfo.empId = profileInfo._id;
				profileInfo.personalEmail = profileInfo.email;
				profileInfo.personalPhoneNum = profileInfo.phoneNumber;
			}
			setFormData(profileInfo);
		} else {
			setFormData(setProfileInfo);
		}
	}, [profileInfo, empId]);

	useEffect(() => {
		if (formData.firstName && formData.lastName && formData.password) {
			setIsSave1Disabled(false);
		}
	}, [formData.firstName, formData.lastName, formData.password]);

	// useEffect(() => {
	// 	if (formData.employeeNo) {
	// 		setIsSave2Disabled(false);
	// 	}
	// }, [formData.employeeNo]);

	useEffect(() => {
		if (
			formData.personalEmail &&
			formData.streetAddress &&
			formData.city &&
			formData.province &&
			formData.country &&
			formData.postalCode
		) {
			setIsSave3Disabled(false);
		}
	}, [
		formData.personalEmail,
		formData.streetAddress,
		formData.city,
		formData.province,
		formData.country,
		formData.postalCode,
		formData?.password,
	]);

	const toast = useToast();

	const handleSubmit = async () => {
		setIsLoading(true);
		try {
			formData.companyName = company;
			const result = await PayrollService.addEmployeeProfileInfo(formData);
			setIsLoading(false);
			// setIsSave1Disabled(true);
			// setIsSave2Disabled(true);
			// setIsSave3Disabled(true);
			LocalStorageService.setItem("onboardingEmpId", result?.data?.empId);
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
					handleConfirm={() => ""}
					formData={formData}
					setFormData={setFormData}
					title="Personal Information"
					config={EMP_PERSONAL_INFO_CONFIG}
					isLoading={isLoading}
					isDisabled={isSave1Disabled}
					handleSubmit={handleSubmit}
					isOnboarding={isOnboarding}
				/>
			),
		},
		{
			title: "Contact",
			content: (
				<Record
					handleConfirm={() => ""}
					formData={formData}
					setFormData={setFormData}
					title="Contact"
					config={EMP_CONTACT_CONFIG}
					isLoading={isLoading}
					isDisabled={isSave3Disabled}
					handleSubmit={handleSubmit}
				/>
			),
		},
		{
			title: "Emergency Contact",
			content: (
				<Record
					formData={formData}
					setFormData={setFormData}
					title="Emergency Contact"
					config={EMP_EMERGENCY_CONTACT_CONFIG}
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
					id={id}
					handleNext={handleNext}
					// handleNextEnabled={!isSave1Disabled && !isSave2Disabled && !isSave3Disabled}
					handleNextEnabled={!isSave1Disabled && !isSave3Disabled}
				/>
			</BoxCard>
			<StepContent currentStep={currentStep} steps={steps} isOnboarding={isOnboarding} />
		</SimpleGrid>
	);
};

export default PersonalInfo;
