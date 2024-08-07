import {
	FormLabel,
	HStack,
	Icon,
	SimpleGrid,
	useToast,
	VStack,
} from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import ModalLayout from "components/ui/modal/ModalLayout";
import TextTitle from "components/ui/text/TextTitle";
import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import { MdOutlineChevronRight } from "react-icons/md";
import { useParams } from "react-router-dom";
import LocalStorageService from "services/LocalStorageService";
import VerticalStepper from "../../../components/ui/VerticalStepper";
import AlertsViolation from "./AlertsViolation";
import Finalize from "./Finalize";
import InputsReview from "./InputsReview";
import PayrollComplete from "./PayrollComplete";
import PayrollStageContent from "./PayrollStageContent";
import PayrunSetup from "./PayrunSetup";
import ReportsPreview from "./ReportsPreview";

const ProcessPayroll = () => {
	const [currentStep, setCurrentStep] = useState(0);
	const goToNextStep = (index) => {
		setCurrentStep(index);
	};
	const { payNo } = useParams();
	const company = LocalStorageService.getItem("selectedCompany");
	const { payGroupSchedule, closestRecord } = usePaygroup(company);

	const selectedPayPeriod = payNo
		? payGroupSchedule?.find(({ payPeriod }) => payPeriod.toString() === payNo)
		: closestRecord;
	const steps = [
		{ title: "Payrun Setup", content: <PayrunSetup /> },
		{ title: "Inputs Review", content: <InputsReview /> },
		{ title: "Alerts and Violations", content: <AlertsViolation /> },
		{ title: "Review Reports", content: <ReportsPreview /> },
		{ title: "Finalize", content: <Finalize /> },
		{ title: "Payroll Complete", content: <PayrollComplete /> },
	];
	const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);

	const handleClick = () => {
		setShowConfirmationPopUp((prev) => !prev);
	};

	const toast = useToast();

	const handleSubmit = () => {
		selectedPayPeriod.isProcessed = true;
		console.log(selectedPayPeriod);
		handleClick();
		toast({
			title: "Payroll is processed for payrun.",
			status: "success",
			duration: 1500,
			isClosable: true,
		});
	};

	return (
		<PageLayout>
			<SimpleGrid
				columns={{ base: 1, md: 1, lg: 2 }}
				spacing="4"
				my="4"
				mr="4"
				templateColumns={{ lg: "20% 80%" }}
			>
				<BoxCard>
					<TextTitle title={"Process payroll"} mt={2} mb={"1em"} />
					<VStack spacing={3} align={"start"}>
						<HStack spacing={2}>
							<TextTitle
								weight="normal"
								color={"var(--primary_button_bg)"}
								title={"Manage all payrolls"}
								width="auto"
							/>
							<Icon
								borderRadius={"50%"}
								as={MdOutlineChevronRight}
								// onClick={() => handleChangeDate("prev")}
								boxSize="5"
								color="var(--primary_button_bg)"
							/>
						</HStack>
						<VerticalStepper
							hideProgress
							steps={steps}
							currentStep={currentStep}
							handleClick={goToNextStep}
							height="60vh"
						/>

						<PrimaryButton
							minW={"100%"}
							isDisabled={currentStep !== 5}
							name={"Submit payroll"}
							onOpen={handleClick}
							// isLoading={isLoading}
							loadingText="Loading"
						/>
					</VStack>
				</BoxCard>
				<PayrollStageContent
					currentStep={currentStep}
					steps={steps}
					handleConfirm={goToNextStep}
				/>
			</SimpleGrid>

			{showConfirmationPopUp && (
				<ModalLayout
					title={"Submit payroll"}
					size="sm"
					isOpen={showConfirmationPopUp}
					onClose={handleClick}
				>
					<FormLabel>Would you like to submit final processing?</FormLabel>
					<ActionButtonGroup
						submitBtnName={"Yes"}
						closeLabel="No"
						// isLoading={isSubmitting}
						onClose={handleClick}
						onOpen={handleSubmit}
					/>
				</ModalLayout>
			)}
		</PageLayout>
	);
};

export default ProcessPayroll;
