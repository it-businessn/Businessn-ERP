import { SimpleGrid, useToast } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import TextTitle from "components/ui/text/TextTitle";
import VerticalStepper from "components/ui/VerticalStepper";
import { getInitialPayInfo } from "config/payroll/employees/payInfo";
import useEmployeePayInfo from "hooks/useEmployeePayInfo";
import useSelectedEmp from "hooks/useSelectedEmp";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import StepContent from "../step-content";
import EarningsInfo from "./EarningsInfo";

const PayInfo = ({ company, isOnboarding, id, handleNext, handlePrev }) => {
	const { empId } = useSelectedEmp(LocalStorageService.getItem("empId"));
	const onboardingEmpId = LocalStorageService.getItem("onboardingEmpId");
	const payInfo = useEmployeePayInfo(
		company,
		false,
		onboardingEmpId || empId,
		null,
		null,
		isOnboarding,
	);
	const setPayInfo = () => getInitialPayInfo(onboardingEmpId ?? empId, company);

	const [formData, setFormData] = useState(setPayInfo);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (payInfo) {
			setFormData(payInfo);
		} else {
			setFormData(setPayInfo);
		}
	}, [payInfo, empId]);

	const toast = useToast();
	const handleSubmit = async (data) => {
		setIsLoading(true);
		try {
			if (data) {
				const existingEarnings = formData.roles;
				const positionIndex = existingEarnings?.findIndex(({ title }) => title === data.title);
				formData.roles[positionIndex] = data;
			}
			await PayrollService.addEmployeePayInfo(formData);
			setIsLoading(false);
			// setIsDisabled(true);
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
				<>
					<TextTitle title="Earnings" />
					{formData.roles?.map((role, index) => (
						<BoxCard
							mt={2}
							border="1px solid var(--lead_cards_border)"
							key={`${role.title}_${index}`}
						>
							<TextTitle title={`Position ${index + 1}: ${role.title}`} />
							<EarningsInfo role={role} handleSubmit={handleSubmit} />
						</BoxCard>
					))}
				</>
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
					id={id}
					handleNext={handleNext}
					handlePrev={handlePrev}
					handleNextEnabled={true}
				/>
			</BoxCard>
			<StepContent currentStep={currentStep} steps={steps} isOnboarding={isOnboarding} />
		</SimpleGrid>
	);
};

export default PayInfo;
