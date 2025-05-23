import {
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	HStack,
	Input,
	SimpleGrid,
	useToast,
	VStack,
} from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import MandatoryField from "components/ui/form/MandatoryField";
import TextTitle from "components/ui/text/TextTitle";
import VerticalStepper from "components/ui/VerticalStepper";
import {
	EMP_BANKING_CONFIG,
	EMP_PAYMENT_NOTIFICATION_CONFIG,
	getInitialBankingInfo,
} from "config/payroll/employees/bankingInfo";
import { Field, Form, Formik } from "formik";
import useEmployeeBankingInfo from "hooks/useEmployeeBankingInfo";
import React, { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import { BankingFormSchema } from "validation/BankDetails";
import StepContent from "../../step-content";
import RadioTypeRecord from "../../step-content/radio";
import Record from "../../step-content/Record";

const AddBankingInfo = ({ company, handlePrev, id, handleClose }) => {
	const toast = useToast();
	const onboardingEmpId = LocalStorageService.getItem("onboardingEmpId");
	const bankingInfo = useEmployeeBankingInfo(company, onboardingEmpId);
	const setBankingInfo = () => getInitialBankingInfo(onboardingEmpId, company);
	const [formData, setFormData] = useState(setBankingInfo);
	const [isDisabled, setIsDisabled] = useState(true);
	const [currentStep, setCurrentStep] = useState(0);

	useEffect(() => {
		if (bankingInfo) {
			setFormData(bankingInfo);
		} else {
			setFormData(setBankingInfo);
		}
	}, [bankingInfo]);

	const handleSubmit = async (values) => {
		try {
			if (values) {
				formData.bankDetails = values;
			}
			formData.empId = onboardingEmpId;
			formData.companyName = company;
			await PayrollService.addEmployeeBankingInfo(formData);
			toast({
				title: "Banking info updated successfully.",
				status: "success",
				duration: 1000,
				isClosable: true,
			});
			setIsDisabled(false);
		} catch (error) {
			console.error("Error:", error);
			alert("Failed to submit banking information.");
		}
	};

	const goToNextStep = (index) => {
		setCurrentStep(index);
	};

	const steps = [
		{
			title: "Payment Notification",
			content: (
				<Record
					handleConfirm={() => ""}
					formData={formData}
					setFormData={setFormData}
					title="Payment Notification"
					config={EMP_PAYMENT_NOTIFICATION_CONFIG}
				/>
			),
		},
		{
			title: "Banking Info",
			content: (
				<>
					<TextTitle title={"Banking Info"} />

					<Formik
						initialValues={formData}
						validationSchema={BankingFormSchema}
						onSubmit={handleSubmit}
						enableReinitialize
					>
						{({ isSubmitting, values, errors, touched }) => (
							<Form autoComplete="off">
								<HStack align={"start"} justify={"start"} mb={2}>
									{EMP_BANKING_CONFIG.map((field, index) => (
										<VStack align={"start"} key={`bank_${field.type}**${index * 2}`}>
											{field.params.map((param) =>
												param?.control === "radio" ? (
													<RadioTypeRecord
														key={param.name}
														formData={formData}
														param={param}
														setFormData={setFormData}
														handleConfirm={() => ""}
														isOnboarding={true}
													/>
												) : (
													<React.Fragment key={param.name}>
														<FormControl
															isInvalid={
																!!errors[param.param_key] &&
																touched[param.param_key] &&
																!values[param.param_key]?.includes("*")
															}
															mb={4}
														>
															<FormLabel htmlFor={param.param_key}>
																{param.name}
																{param.mandatory && <MandatoryField color={"red"} />}
															</FormLabel>
															<Field
																as={Input}
																id={param.param_key}
																name={param.param_key}
																type="text"
																variant="outline"
																autoComplete="off"
															/>
															<FormErrorMessage>{errors[param.param_key]}</FormErrorMessage>
														</FormControl>
													</React.Fragment>
												),
											)}
										</VStack>
									))}
								</HStack>
								<Button
									isLoading={isSubmitting}
									size="xs"
									type="submit"
									px={"2em"}
									borderRadius={"10px"}
									loadingText="Loading"
									bg="var(--primary_button_bg)"
									color="var(--primary_bg)"
									hover={{
										color: "var(--main_color_black)",
										bg: "transparent",
										border: "1px solid var(--primary_button_bg)",
									}}
								>
									Save
								</Button>
							</Form>
						)}
					</Formik>
				</>
			),
		},
	];
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
					handlePrev={handlePrev}
					id={id}
					handleClose={() => {
						LocalStorageService.removeItem("onboardingEmpId");
						handleClose();
					}}
				/>
			</BoxCard>
			<StepContent currentStep={currentStep} steps={steps} />
		</SimpleGrid>
	);
};

export default AddBankingInfo;
