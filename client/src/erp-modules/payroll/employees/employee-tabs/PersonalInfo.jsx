import { SimpleGrid } from "@chakra-ui/react";
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
import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";
import Record from "../Record";
import StepContent from "../StepContent";

const PersonalInfo = ({ company, empId }) => {
	const profileInfo = useEmployeeProfileInfo(company, empId);

	const setProfileInfo = () => getInitialProfileInfo(empId, company);
	const [formData, setFormData] = useState(setProfileInfo);

	useEffect(() => {
		if (profileInfo) {
			setFormData(profileInfo);
		}
	}, [profileInfo]);

	const handleConfirm = async (e) => {
		const { name } = e.target;
		try {
			if (formData[name]) {
				await PayrollService.addEmployeeProfileInfo(formData);
			}
		} catch (error) {}
	};

	const steps = [
		{
			title: "Identification and Status",
			content: (
				<Record
					handleConfirm={handleConfirm}
					formData={formData}
					setFormData={setFormData}
					data={profileInfo}
					title="Identification and Status"
					config={EMP_IDENTIFICATION_STATUS_CONFIG}
				/>
			),
		},
		{
			title: "Personal Information",
			content: (
				<Record
					handleConfirm={handleConfirm}
					formData={formData}
					setFormData={setFormData}
					data={profileInfo}
					title="Personal Information"
					config={EMP_PERSONAL_INFO_CONFIG}
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
					data={profileInfo}
					title="Contact"
					config={EMP_CONTACT_CONFIG}
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
					data={profileInfo}
					title="Emergency Contact"
					config={EMP_EMERGENCY_CONTACT_CONFIG}
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
				/>
			</BoxCard>
			<StepContent currentStep={currentStep} steps={steps} />
		</SimpleGrid>
	);
};

export default PersonalInfo;
