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
import StepContent from "../../step-content";
import EarningsInfo from "./EarningsInfo";

const PayInfo = ({ company, id, handleNext, handlePrev }) => {
	const toast = useToast();
	const { empId } = useSelectedEmp(LocalStorageService.getItem("empId"));
	const payInfo = useEmployeePayInfo(company, false, empId);
	const setPayInfo = () => getInitialPayInfo(empId, company);
	const [currentStep, setCurrentStep] = useState(0);

	const [formData, setFormData] = useState(setPayInfo);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (payInfo) {
			payInfo.roles = payInfo?.roles?.filter((_) => _.title);
			setFormData(payInfo);
		} else {
			setFormData(setPayInfo);
		}
	}, [payInfo, empId]);

	const handleSubmit = async (data) => {
		setIsLoading(true);
		try {
			if (data) {
				const existingEarnings = formData?.roles;
				const positionIndex = existingEarnings?.findIndex(({ title }) => title === data.title);
				formData.roles[positionIndex] = data;
			}
			formData.companyName = company;
			await PayrollService.updateEmployeePayInfo(formData, formData?._id);
			setIsLoading(false);
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
					{formData ? (
						formData?.roles?.map((role, index) => (
							<BoxCard
								mt={2}
								border="1px solid var(--lead_cards_border)"
								key={`${role.title}_${index}`}
							>
								<TextTitle title={`Position ${index + 1}: ${role.title}`} />
								<EarningsInfo role={role} handleSubmit={handleSubmit} />
							</BoxCard>
						))
					) : formData?.roles?.length === 0 ? (
						<TextTitle
							color="var(--pending)"
							title="** Please add roles/positions under employment section."
							size="sm"
						/>
					) : (
						<></>
					)}
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
					id={id}
					handleNext={handleNext}
					handlePrev={handlePrev}
				/>
			</BoxCard>
			<StepContent currentStep={currentStep} steps={steps} />
		</SimpleGrid>
	);
};

export default PayInfo;
