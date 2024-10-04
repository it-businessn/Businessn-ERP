import { SimpleGrid } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import VerticalStepper from "components/ui/VerticalStepper";
import {
	EMP_VACATION_BALANCE_CONFIG,
	EMP_YTD_DEDUCTIONS_CONFIG,
	EMP_YTD_EARNINGS_CONFIG,
	getInitialBalanceInfo,
} from "config/payroll/employees/balanceInfo";
import useEmployeeBalanceInfo from "hooks/useEmployeeBalanceInfo";
import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";
// import { convertToNum } from"utils";
import useSelectedEmp from "hooks/useSelectedEmp";
import StepContent from "../step-content";
import Record from "../step-content/Record";

const BalancesInfo = ({ company }) => {
	const { empId } = useSelectedEmp();
	const balanceInfo = useEmployeeBalanceInfo(company, empId);
	const setBalanceInfo = () => getInitialBalanceInfo(empId, company);
	const [formData, setFormData] = useState(setBalanceInfo);
	const [isDisabled, setIsDisabled] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [carryFwd, setCarryFwd] = useState(false);

	useEffect(() => {
		if (balanceInfo) {
			setFormData(balanceInfo);
			setCarryFwd(balanceInfo?.empBalanceInfo?.carryFwd);
		} else {
			setFormData(setBalanceInfo);
		}
	}, [balanceInfo, empId]);

	const handleConfirm = () => {
		setIsDisabled(false);
	};

	const handleSubmit = async () => {
		setIsLoading(true);
		try {
			await PayrollService.addEmployeeBalanceInfo({
				carryFwd: !carryFwd,
				empId,
				companyName: company,
			});
			setIsLoading(false);
			setIsDisabled(true);
		} catch (error) {}
	};

	const steps = [
		{
			title: "Vacation",
			content: (
				<Record
					carryFwd={carryFwd}
					setCarryFwd={setCarryFwd}
					handleConfirm={handleConfirm}
					formData={formData}
					setFormData={setFormData}
					title="Vacation"
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
			title: "YTD Earnings",
			content: (
				<Record
					handleConfirm={handleConfirm}
					formData={formData}
					setFormData={setFormData}
					title="YTD Earnings"
					config={EMP_YTD_EARNINGS_CONFIG}
					isLoading={isLoading}
					isDisabled={isDisabled}
					handleSubmit={handleSubmit}
					readOnly={true}
					isBalanceInfo
				/>
			),
		},
		{
			title: "YTD Deductions",
			content: (
				<Record
					handleConfirm={handleConfirm}
					formData={formData}
					setFormData={setFormData}
					title="YTD Deductions"
					config={EMP_YTD_DEDUCTIONS_CONFIG}
					isLoading={isLoading}
					isDisabled={isDisabled}
					handleSubmit={handleSubmit}
					readOnly={true}
					isBalanceInfo
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

export default BalancesInfo;
