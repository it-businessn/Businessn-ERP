import { FormControl, HStack, Input, SimpleGrid } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import VerticalStepper from "components/ui/VerticalStepper";
import {
	EE_PAID_BENEFITS_CONFIG,
	EMP_PAY_INFO_ACCRUALS_CONFIG,
	EMP_VACATION_BALANCE_CONFIG,
	ER_PAID_BENEFITS_CONFIG,
	getInitialBalanceInfo,
} from "config/payroll/employees/balanceInfo";
import useEmployeeBalanceInfo from "hooks/useEmployeeBalanceInfo";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import StepContent from "../../step-content";
import Record from "../../step-content/Record";

const AddBenefitsInfo = ({ company, id, handleNext }) => {
	const onboardingEmpId = LocalStorageService.getItem("onboardingEmpId");
	const balanceInfo = useEmployeeBalanceInfo(company, onboardingEmpId);
	const initialBalanceInfo = getInitialBalanceInfo(onboardingEmpId, company);
	const [formData, setFormData] = useState(initialBalanceInfo);
	const [isDisabled, setIsDisabled] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [carryFwd, setCarryFwd] = useState(false);
	const [currentStep, setCurrentStep] = useState(0);

	useEffect(() => {
		if (balanceInfo) {
			setFormData(balanceInfo);
			setCarryFwd(balanceInfo?.carryFwd);
		} else {
			setFormData(initialBalanceInfo);
		}
	}, [balanceInfo]);

	useEffect(() => {
		if (formData?.typeOfVacationTreatment && formData?.vacationPayPercent) setIsDisabled(false);
		else setIsDisabled(true);
	}, [formData?.typeOfVacationTreatment, formData?.vacationPayPercent, onboardingEmpId]);

	const handleSubmit = async () => {
		setIsLoading(true);
		const updatedBenefit = formData;

		updatedBenefit.carryFwd = carryFwd !== undefined ? !carryFwd : false;
		updatedBenefit.empId = onboardingEmpId;
		updatedBenefit.companyName = company;

		try {
			await PayrollService.addEmployeeBalanceInfo(updatedBenefit);
			setIsLoading(false);
			setIsDisabled(true);
		} catch (error) {}
	};

	const steps = [
		{
			title: "Vacation",
			content: (
				<Record
					handleConfirm={() => ""}
					formData={formData}
					setFormData={setFormData}
					title="Vacation"
					config={EMP_PAY_INFO_ACCRUALS_CONFIG}
				/>
			),
		},
		{
			title: "Vacation Balances",
			content: (
				<>
					<Record
						carryFwd={carryFwd}
						setCarryFwd={setCarryFwd}
						formData={formData}
						setFormData={setFormData}
						title="Vacation Balances"
						config={EMP_VACATION_BALANCE_CONFIG}
						readOnly={true}
					/>
					<HStack justifyContent="space-between">
						<PrimaryButton
							size="xs"
							name="Add Adjustment"
							isLoading={isLoading}
							loadingText="Loading"
							onOpen={handleSubmit}
						/>
						<FormControl>
							<Input size="sm" w="20%" placeholder="Enter amount to adjust" value="" readOnly />
						</FormControl>
					</HStack>
				</>
			),
		},
		{
			title: "Employer Contributions",
			content: (
				<Record
					handleConfirm={() => ""}
					formData={formData}
					setFormData={setFormData}
					title="Employer Contributions"
					config={ER_PAID_BENEFITS_CONFIG}
					isContribution
				/>
			),
		},
		{
			title: "Employee Contributions",
			content: (
				<Record
					handleConfirm={() => ""}
					formData={formData}
					setFormData={setFormData}
					title="Employee Contributions"
					config={EE_PAID_BENEFITS_CONFIG}
					isContribution
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
					id={id}
					isOnboarding={true}
					currentStep={currentStep}
					handleClick={goToNextStep}
					handleNextEnabled={true}
					handleNext={handleNext}
					isLoading={isLoading}
					isDisabled={isDisabled}
					handleSubmit={handleSubmit}
				/>
			</BoxCard>
			<StepContent currentStep={currentStep} steps={steps} />
		</SimpleGrid>
	);
};

export default AddBenefitsInfo;
