import { SimpleGrid } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import VerticalStepper from "components/ui/VerticalStepper";
import {
	EMP_FED_GOVT_CONFIG,
	EMP_INCOME_TAX_CONFIG,
	EMP_REGN_GOVT_CONFIG,
	getInitialGovernmentInfo,
} from "config/payroll/employees/governmentInfo";
import useEmployeeGovernment from "hooks/useEmployeeGovernment";
import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";
import StepContent from "../step-content";
import Record from "../step-content/Record";

const GovernmentContribution = ({ company, empId }) => {
	const governmentInfo = useEmployeeGovernment(company, empId);
	const setGovernmentInfo = () => getInitialGovernmentInfo(empId, company);
	const [formData, setFormData] = useState(setGovernmentInfo);
	const [isDisabled, setIsDisabled] = useState(true);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (governmentInfo) {
			setFormData(governmentInfo);
		} else {
			setFormData(setGovernmentInfo);
		}
	}, [governmentInfo, empId]);

	const handleConfirm = () => {
		setIsDisabled(false);
	};

	const handleSubmit = async () => {
		setIsLoading(true);
		try {
			await PayrollService.addEmployeeGovernmentInfo(formData);
			setIsLoading(false);
			setIsDisabled(true);
		} catch (error) {}
	};

	const steps = [
		{
			title: "Income Tax",
			content: (
				<Record
					handleConfirm={handleConfirm}
					formData={formData}
					setFormData={setFormData}
					title="Income Tax"
					config={EMP_INCOME_TAX_CONFIG}
					isLoading={isLoading}
					isDisabled={isDisabled}
					handleSubmit={handleSubmit}
				/>
			),
		},
		{
			title: "Federal Government Contributions",
			content: (
				<Record
					handleConfirm={handleConfirm}
					formData={formData}
					setFormData={setFormData}
					title="Federal Government Contributions"
					config={EMP_FED_GOVT_CONFIG}
					isLoading={isLoading}
					isDisabled={isDisabled}
					handleSubmit={handleSubmit}
				/>
			),
		},

		{
			title: "Regional Government Deductions",
			content: (
				<Record
					handleConfirm={handleConfirm}
					formData={formData}
					setFormData={setFormData}
					title="Regional Government Deductions"
					config={EMP_REGN_GOVT_CONFIG}
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
				/>
			</BoxCard>
			<StepContent currentStep={currentStep} steps={steps} />
		</SimpleGrid>
	);
};

export default GovernmentContribution;
