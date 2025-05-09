import { SimpleGrid, useToast } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import TextTitle from "components/ui/text/TextTitle";
import VerticalStepper from "components/ui/VerticalStepper";
import { getInitialPayInfo } from "config/payroll/employees/payInfo";
import useEmployeePayInfo from "hooks/useEmployeePayInfo";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import StepContent from "../../step-content";
import EarningsInfo from "./EarningsInfo";

const AddPayInfo = ({ company, id, handleNext, handlePrev }) => {
	const toast = useToast();
	const onboardingEmpId = LocalStorageService.getItem("onboardingEmpId");
	const payInfo = useEmployeePayInfo(company, false, onboardingEmpId);
	const setPayInfo = () => getInitialPayInfo(onboardingEmpId, company);
	const [formData, setFormData] = useState(setPayInfo);
	const [currentStep, setCurrentStep] = useState(0);

	useEffect(() => {
		if (payInfo) {
			payInfo.roles = payInfo?.roles?.filter((_) => _.title);
			setFormData(payInfo);
		} else {
			setFormData(setPayInfo);
		}
	}, [payInfo]);

	const handleSubmit = async (data) => {
		try {
			if (data) {
				const existingEarnings = formData?.roles;
				const positionIndex = existingEarnings?.findIndex(({ title }) => title === data.title);
				formData.roles[positionIndex] = data;
			}
			formData.companyName = company;
			await PayrollService.addEmployeePayInfo(formData);

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
					{!formData?.roles?.length && (
						<TextTitle
							color="var(--pending)"
							title="** Please add roles/positions under employment section."
							size="sm"
						/>
					)}
					{formData?.roles?.map((role, index) => (
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
					isOnboarding={true}
					id={id}
					handleNext={handleNext}
					handlePrev={handlePrev}
					handleNextEnabled={true}
				/>
			</BoxCard>
			<StepContent currentStep={currentStep} steps={steps} isOnboarding={true} />
		</SimpleGrid>
	);
};

export default AddPayInfo;
