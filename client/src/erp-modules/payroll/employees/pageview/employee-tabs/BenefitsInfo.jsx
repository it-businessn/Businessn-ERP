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
import useSelectedEmp from "hooks/useSelectedEmp";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import StepContent from "../step-content";
import Record from "../step-content/Record";

const BenefitsInfo = ({ company, id, isOnboarding, handleNext }) => {
	const { empId } = useSelectedEmp(LocalStorageService.getItem("empId"));
	const balanceInfo = useEmployeeBalanceInfo(company, empId);
	const initialBalanceInfo = getInitialBalanceInfo(empId, company);
	const [formData, setFormData] = useState(initialBalanceInfo);
	const [isDisabled, setIsDisabled] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [carryFwd, setCarryFwd] = useState(false);

	useEffect(() => {
		if (balanceInfo) {
			setFormData(balanceInfo);
			setCarryFwd(balanceInfo?.carryFwd);
		} else {
			setFormData(initialBalanceInfo);
		}
	}, [balanceInfo]);

	useEffect(() => {
		if (formData.typeOfVacationTreatment && formData.vacationPayPercent) setIsDisabled(false);
		else setIsDisabled(true);
	}, [formData.typeOfVacationTreatment, formData.vacationPayPercent, empId]);

	const handleSubmit = async () => {
		setIsLoading(true);
		const updatedBenefit = formData;

		updatedBenefit.carryFwd = carryFwd !== undefined ? !carryFwd : false;
		updatedBenefit.empId = empId;
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
					isLoading={isLoading}
					handleSubmit={handleSubmit}
					isDisabled={isDisabled}
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
						isLoading={isLoading}
						isDisabled={isDisabled}
						handleSubmit={handleSubmit}
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
					isLoading={isLoading}
					handleSubmit={handleSubmit}
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
					isLoading={isLoading}
					handleSubmit={handleSubmit}
					isContribution
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
					id={id}
					isOnboarding={isOnboarding}
					currentStep={currentStep}
					handleClick={goToNextStep}
					handleNextEnabled={true}
					handleNext={handleNext}
				/>
			</BoxCard>
			<StepContent currentStep={currentStep} steps={steps} />
		</SimpleGrid>
	);
};

export default BenefitsInfo;
