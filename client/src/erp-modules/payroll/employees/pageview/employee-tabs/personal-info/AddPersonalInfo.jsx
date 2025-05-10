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
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import StepContent from "../../step-content";
import Record from "../../step-content/Record";

const AddPersonalInfo = ({ company, id, handleNext }) => {
	const onboardingEmpId = LocalStorageService.getItem("onboardingEmpId");
	const profileInfo = useEmployeeProfileInfo(company, onboardingEmpId);
	const toast = useToast();

	const setProfileInfo = () => getInitialProfileInfo(null, company);
	const [formData, setFormData] = useState(setProfileInfo);
	const [isDisabled, setIsDisabled] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [currentStep, setCurrentStep] = useState(0);

	useEffect(() => {
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
	}, [profileInfo]);

	useEffect(() => {
		if (
			formData?.firstName &&
			formData?.lastName &&
			formData?.password &&
			formData?.personalEmail &&
			formData?.streetAddress &&
			formData?.city &&
			formData?.province &&
			formData?.country &&
			formData?.postalCode
		) {
			setIsDisabled(false);
		}
	}, [formData]);

	const handleSubmit = async () => {
		setIsLoading(true);
		try {
			formData.companyName = company;
			const { data } = await PayrollService.addEmployeeProfileInfo(formData);
			setIsLoading(false);
			LocalStorageService.setItem("onboardingEmpId", data?.empId);
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
					handleSubmit={handleSubmit}
					isOnboarding={true}
					hasPassword={profileInfo?.password}
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
					handleSubmit={handleSubmit}
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
					id={id}
					handleNext={handleNext}
					handleSubmit={handleSubmit}
					isLoading={isLoading}
					isDisabled={isDisabled}
				/>
			</BoxCard>
			<StepContent currentStep={currentStep} steps={steps} isOnboarding={true} />
		</SimpleGrid>
	);
};

export default AddPersonalInfo;
