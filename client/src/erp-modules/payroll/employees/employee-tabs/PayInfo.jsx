import { SimpleGrid } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import VerticalStepper from "components/ui/VerticalStepper";
import useEmployeePayInfo from "hooks/useEmployeePayInfo";
import { useState } from "react";
import Record from "../Record";
import StepContent from "../StepContent";

const PayInfo = ({ company, empId }) => {
	const payInfo = useEmployeePayInfo(company, empId);
	console.log(payInfo);
	const steps = [
		{
			title: "Earnings",
			content: (
				<Record
					formData={payInfo}
					title="Earnings"
					data={[
						{
							type: "Hourly",
							params: [
								{ name: "Regular Pay", param_key: "regPay" },
								{ name: "Overtime Pay ", param_key: "overTimePay" },
								{ name: "Double Overtime Pay ", param_key: "dblOverTimePay" },
								{ name: "Statutory Worked Pay ", param_key: "statWorkPay" },
								{ name: "Statutory Pay", param_key: "statPay" },
								{ name: "Sick Pay  ", param_key: "sickPay" },
							],
						},
						{
							type: "Salary",
							params: [
								{ name: "Salary Rate", param_key: "salaryRate" },
								{ name: "Hours per Pay", param_key: "dailyHours" },
							],
						},
					]}
				/>
			),
		},
		{
			title: "Deductions",
			content: (
				<Record
					title="Deductions"
					data={[
						{
							type: "",
							params: [
								{
									name: "Long Term Disability - EE",
									param_key: "longTermDisabilityEE",
								},
								{ name: "Dental - EE", param_key: "dentalEE" },
								{
									name: "Extended Health - EE ",
									param_key: "extendedHealthEE",
								},
								{ name: "Union Dues", param_key: "unionDues" },
							],
						},
						{
							type: "",
							params: [
								{
									name: "Long Term Disability - ER",
									param_key: "longTermDisabilityER",
								},
								{ name: "Dental - ER", param_key: "dentalER" },
								{ name: "Extended Health - ER", param_key: "extendedHealthER" },
							],
						},
					]}
				/>
			),
		},
		{
			title: "Accruals",
			content: (
				<Record
					title="Accruals"
					data={[
						{
							type: "",
							params: [{ name: "Vacation ", param_key: "vacationPay" }],
						},
					]}
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
