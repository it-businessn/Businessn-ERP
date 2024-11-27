import { SimpleGrid } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import VerticalStepper from "components/ui/VerticalStepper";
import {
	EMP_PAY_INFO_ACCRUALS_CONFIG,
	EMP_PAY_INFO_DEDUCTION_CONFIG,
	EMP_VACATION_BALANCE_CONFIG,
	getInitialBalanceInfo,
} from "config/payroll/employees/balanceInfo";
import useEmployeeBalanceInfo from "hooks/useEmployeeBalanceInfo";
import useSelectedEmp from "hooks/useSelectedEmp";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import StepContent from "../step-content";
import Record from "../step-content/Record";

const BenefitsInfo = ({ company }) => {
	const { empId } = useSelectedEmp(LocalStorageService.getItem("empId"));
	const balanceInfo = useEmployeeBalanceInfo(company, empId);
	const setBalanceInfo = () => getInitialBalanceInfo(empId, company);
	const [formData, setFormData] = useState(setBalanceInfo);
	const [isDisabled, setIsDisabled] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [carryFwd, setCarryFwd] = useState(false);

	useEffect(() => {
		if (balanceInfo) {
			setFormData(balanceInfo);
			setCarryFwd(balanceInfo?.carryFwd);
		} else {
			setFormData(setBalanceInfo);
		}
	}, [balanceInfo, empId]);

	useEffect(() => {
		if (formData.typeOfVacationTreatment && formData.vacationPayPercent) {
			setIsDisabled(false);
		}
	}, [formData.typeOfVacationTreatment, formData.vacationPayPercent]);

	const handleSubmit = async () => {
		setIsLoading(true);
		const updatedBenefit = {
			carryFwd: carryFwd !== undefined ? !carryFwd : false,
			empId,
			companyName: company,
			typeOfVacationTreatment: formData?.typeOfVacationTreatment,
			vacationPayPercent: formData?.vacationPayPercent,
		};
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
					isBalanceInfo
				/>
			),
		},
		{
			title: "Contributions",
			content: (
				<Record
					formData={formData}
					setFormData={setFormData}
					title="Contributions"
					config={EMP_PAY_INFO_DEDUCTION_CONFIG}
					isLoading={isLoading}
					handleSubmit={handleSubmit}
					isBalanceInfo
					readOnly={true}
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

export default BenefitsInfo;
