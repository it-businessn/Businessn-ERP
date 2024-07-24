import { SimpleGrid } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import VerticalStepper from "components/ui/VerticalStepper";
import {
	EMP_COMPANY_CONFIG,
	EMP_ROLE_CONFIG,
	getInitialCorporateInfo,
} from "config/payroll/employees/employmentInfo";
import useEmployeeEmploymentInfo from "hooks/useEmployeeEmploymentInfo";
import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";
import StepContent from "../step-content";
import Record from "../step-content/Record";

const CorporateInfo = ({ company, empId }) => {
	const employmentInfo = useEmployeeEmploymentInfo(company, empId);
	const setCorporateInfo = () => getInitialCorporateInfo(empId, company);
	const [formData, setFormData] = useState(setCorporateInfo);

	useEffect(() => {
		if (employmentInfo) {
			setFormData(employmentInfo);
		} else {
			setFormData(setCorporateInfo);
		}
	}, [employmentInfo, empId]);

	const handleConfirm = async (e) => {
		const { name } = e.target;
		try {
			if (formData[name]) {
				await PayrollService.addEmployeeEmploymentInfo(formData);
			}
		} catch (error) {}
	};
	const steps = [
		{
			title: "Role",
			content: (
				<Record
					title="Role"
					handleConfirm={handleConfirm}
					formData={formData}
					setFormData={setFormData}
					data={employmentInfo}
					config={EMP_ROLE_CONFIG}
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
					data={employmentInfo}
					title="Company"
					config={EMP_COMPANY_CONFIG}
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

export default CorporateInfo;
