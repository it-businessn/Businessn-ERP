import { SimpleGrid } from "@chakra-ui/react";
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
import PayrollService from "services/PayrollService";
import StepContent from "../step-content";
import Record from "../step-content/Record";

const PayInfo = ({ company, empId }) => {
	const payInfo = useEmployeePayInfo(company, empId);

	const setPayInfo = () => getInitialPayInfo(empId, company);

	const [formData, setFormData] = useState(setPayInfo);

	useEffect(() => {
		if (payInfo) {
			setFormData(payInfo);
		} else {
			setFormData(setPayInfo);
		}
	}, [payInfo, empId]);

	const handleConfirm = async (e) => {
		const { name } = e.target;
		try {
			if (formData[name]) {
				await PayrollService.addEmployeePayInfo(formData);
			}
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
					data={payInfo}
					title="Earnings"
					config={EMP_PAY_INFO_EARNINGS_CONFIG}
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
					data={payInfo}
					title="Deductions"
					config={EMP_PAY_INFO_DEDUCTION_CONFIG}
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
					data={payInfo}
					title="Accruals"
					config={EMP_PAY_INFO_ACCRUALS_CONFIG}
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
				/>
			</BoxCard>
			<StepContent currentStep={currentStep} steps={steps} />
		</SimpleGrid>
	);
};

export default PayInfo;
