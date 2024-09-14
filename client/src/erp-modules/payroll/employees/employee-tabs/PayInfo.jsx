import { SimpleGrid, useToast } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import VerticalStepper from "components/ui/VerticalStepper";
import {
	EMP_PAY_INFO_ACCRUALS_CONFIG,
	EMP_PAY_INFO_DEDUCTION_CONFIG,
	EMP_PAY_INFO_EARNINGS_CONFIG,
	getInitialPayInfo,
} from "config/payroll/employees/payInfo";
import useEmployeePayInfo from "hooks/useEmployeePayInfo";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import StepContent from "../step-content";
import Record from "../step-content/Record";

const PayInfo = ({
	company,
	empId,
	isOnboarding,
	id,
	handleNext,
	handlePrev,
}) => {
	const payInfo = useEmployeePayInfo(
		company,
		false,
		empId,
		null,
		null,
		isOnboarding,
	);
	const onboardingEmpId = LocalStorageService.getItem("onboardingEmpId");
	const setPayInfo = () => getInitialPayInfo(onboardingEmpId ?? empId, company);

	const [formData, setFormData] = useState(setPayInfo);
	const [isDisabled, setIsDisabled] = useState(true);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (payInfo) {
			setFormData(payInfo);
		} else {
			setFormData(setPayInfo);
		}
	}, [payInfo, empId]);

	const handleConfirm = () => {
		setIsDisabled(false);
	};

	const toast = useToast();
	const handleSubmit = async () => {
		setIsLoading(true);
		try {
			await PayrollService.addEmployeePayInfo(formData);
			setIsLoading(false);
			setIsDisabled(true);
			toast({
				title: "Payment info updated successfully.",
				status: "success",
				duration: 1000,
				isClosable: true,
			});
		} catch (error) {}
	};

	const steps = [
		{
			title: "Earnings",
			content: (
				<Record
					handleConfirm={handleConfirm}
					formData={formData}
					setFormData={setFormData}
					title="Earnings"
					config={EMP_PAY_INFO_EARNINGS_CONFIG}
					isLoading={isLoading}
					isDisabled={isDisabled}
					handleSubmit={handleSubmit}
				/>
			),
		},
		{
			title: "Deductions",
			content: (
				<Record
					handleConfirm={handleConfirm}
					formData={formData}
					setFormData={setFormData}
					title="Deductions"
					config={EMP_PAY_INFO_DEDUCTION_CONFIG}
					isLoading={isLoading}
					isDisabled={isDisabled}
					handleSubmit={handleSubmit}
				/>
			),
		},
		{
			title: "Accruals",
			content: (
				<Record
					handleConfirm={handleConfirm}
					formData={formData}
					setFormData={setFormData}
					title="Accruals"
					config={EMP_PAY_INFO_ACCRUALS_CONFIG}
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
					hideLine
					isOnboarding={isOnboarding}
					id={id}
					handleNext={handleNext}
					handlePrev={handlePrev}
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

export default PayInfo;
