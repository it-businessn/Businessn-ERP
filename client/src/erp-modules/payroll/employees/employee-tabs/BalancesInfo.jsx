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
import Record from "../Record";
import StepContent from "../StepContent";

const BalancesInfo = ({ company, empId }) => {
	const balanceInfo = useEmployeeBalanceInfo(company, empId);
	const setBalanceInfo = () => getInitialBalanceInfo(empId, company);
	const [formData, setFormData] = useState(setBalanceInfo);

	useEffect(() => {
		if (balanceInfo) {
			setFormData(balanceInfo);
		}
	}, [balanceInfo]);

	const handleConfirm = async (e) => {
		const { name } = e.target;
		try {
			if (formData[name]) {
				await PayrollService.addEmployeeBalanceInfo(formData);
			}
		} catch (error) {}
	};
	const steps = [
		{
			title: "Vacation ",
			content: (
				<Record
					handleConfirm={handleConfirm}
					formData={formData}
					setFormData={setFormData}
					data={balanceInfo}
					title="Vacation "
					config={EMP_VACATION_BALANCE_CONFIG}
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
					data={balanceInfo}
					title="YTD Earnings"
					config={EMP_YTD_EARNINGS_CONFIG}
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
					data={balanceInfo}
					title="YTD Deductions"
					config={EMP_YTD_DEDUCTIONS_CONFIG}
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
