import {
	Box,
	FormLabel,
	HStack,
	Icon,
	SimpleGrid,
	VStack,
} from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import ModalLayout from "components/ui/modal/ModalLayout";
import TextTitle from "components/ui/text/TextTitle";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import { MdOutlineChevronRight } from "react-icons/md";
import VerticalStepper from "../../../components/ui/VerticalStepper";
import AlertsViolation from "./AlertsViolation";
import DetailsReview from "./DetailsReview";
import Finalize from "./Finalize";
import PayrollComplete from "./PayrollComplete";
import PayrollStageContent from "./PayrollStageContent";
import PayrunSetup from "./PayrunSetup";
import ReportsPreview from "./ReportsPreview";

const ProcessPayroll = () => {
	const steps = [
		{ title: "Payrun Setup", content: <PayrunSetup /> },
		{ title: "Inputs Review", content: <DetailsReview /> },
		{ title: "Alerts and Violations", content: <AlertsViolation /> },
		{ title: "Review Reports", content: <ReportsPreview /> },
		{ title: "Finalize", content: <Finalize /> },
		{ title: "Payroll Complete", content: <PayrollComplete /> },
	];
	const [currentStep, setCurrentStep] = useState(0);
	const goToNextStep = (index) => {
		setCurrentStep(index);
	};
	const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);
	const handleClick = () => {
		setShowConfirmationPopUp((prev) => !prev);
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
				<Box
					color={"var(--nav_color)"}
					p="1em"
					bg={"var(--primary_bg)"}
					border="3px solid var(--main_color)"
					borderRadius="10px"
				>
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
				</Box>
				<PayrollStageContent currentStep={currentStep} steps={steps} />
			</SimpleGrid>

			{showConfirmationPopUp && (
				<ModalLayout
					title={"Submit payroll"}
					size="sm"
					isOpen={showConfirmationPopUp}
					onClose={handleClick}
				>
					<form
					// onSubmit={handleSubmit}
					>
						<FormLabel>Would you like to submit final processing?</FormLabel>
						<ActionButtonGroup
							submitBtnName={"Yes"}
							closeLabel="No"
							// isLoading={isSubmitting}
							onClose={handleClick}
						/>
					</form>
				</ModalLayout>
			)}
		</PageLayout>
	);
};

export default ProcessPayroll;
