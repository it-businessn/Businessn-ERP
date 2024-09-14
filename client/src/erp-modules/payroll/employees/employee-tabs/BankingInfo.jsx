import { SimpleGrid, useToast } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import VerticalStepper from "components/ui/VerticalStepper";
import {
	EMP_BANKING_CONFIG,
	EMP_PAYMENT_NOTIFICATION_CONFIG,
	getInitialBankingInfo,
} from "config/payroll/employees/bankingInfo";
import useEmployeeBankingInfo from "hooks/useEmployeeBankingInfo";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import StepContent from "../step-content";
import Record from "../step-content/Record";

const BankingInfo = ({ company, empId, isOnboarding, handlePrev, id }) => {
	const onboardingEmpId = LocalStorageService.getItem("onboardingEmpId");
	const bankingInfo = useEmployeeBankingInfo(company, empId, isOnboarding);
	const setBankingInfo = () =>
		getInitialBankingInfo(onboardingEmpId ?? empId, company);
	const [formData, setFormData] = useState(setBankingInfo);
	const [isDisabled, setIsDisabled] = useState(true);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (bankingInfo) {
			setFormData(bankingInfo);
		} else {
			setFormData(setBankingInfo);
		}
	}, [bankingInfo, empId]);

	const handleConfirm = () => {
		if (
			formData.bankNum &&
			formData.transitNum &&
			formData.accountNum &&
			formData.paymentEmail
		) {
			setIsDisabled(false);
		}
	};

	const toast = useToast();
	const handleSubmit = async () => {
		setIsLoading(true);
		try {
			await PayrollService.addEmployeeBankingInfo(formData);
			setIsLoading(false);
			setIsDisabled(true);
			toast({
				title: "Banking info updated successfully.",
				status: "success",
				duration: 1000,
				isClosable: true,
			});
		} catch (error) {}
	};

	const steps = [
		{
			title: "Banking Info",
			content: (
				<Record
					handleConfirm={handleConfirm}
					formData={formData}
					setFormData={setFormData}
					title="Banking Info"
					config={EMP_BANKING_CONFIG}
					isLoading={isLoading}
					isDisabled={isDisabled}
					handleSubmit={handleSubmit}
				/>
			),
		},
		{
			title: "Payment Notification",
			content: (
				<Record
					handleConfirm={handleConfirm}
					formData={formData}
					setFormData={setFormData}
					title="Payment Notification"
					config={EMP_PAYMENT_NOTIFICATION_CONFIG}
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
					handlePrev={handlePrev}
					id={id}
				/>
			</BoxCard>
			<StepContent currentStep={currentStep} steps={steps} />
		</SimpleGrid>
	);
};

export default BankingInfo;
