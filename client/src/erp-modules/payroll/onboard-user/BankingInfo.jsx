import {
	Box,
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Select,
	Stack,
	Step,
	StepDescription,
	StepIcon,
	StepIndicator,
	StepNumber,
	Stepper,
	StepSeparator,
	StepStatus,
	StepTitle,
} from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import { useState } from "react";
import { BankingFormSchema } from "validation/BankDetails";
import { bankingSubSteps, tabPanelStyleCss, tabScrollCss } from "./customInfo";

const BankingInfo = ({ bankingSubStep, setBankingSubStep, formData, handleChange }) => {
	// State for form validation errors
	const [bankingErrors, setBankingErrors] = useState({
		bankNum: "",
		transitNum: "",
		accountNum: "",
	});

	// State for form touched fields
	const [bankingTouched, setBankingTouched] = useState({
		bankNum: false,
		transitNum: false,
		accountNum: false,
	});

	// Validate all banking fields
	const validateBankingForm = () => {
		try {
			BankingFormSchema.validateSync(
				{
					bankNum: formData.bankingInfo.bankNum,
					transitNum: formData.bankingInfo.transitNum,
					accountNum: formData.bankingInfo.accountNum,
				},
				{ abortEarly: false },
			);
			return true;
		} catch (error) {
			const errors = {};
			error.inner.forEach((e) => {
				errors[e.path] = e.message;
			});
			setBankingErrors(errors);

			// Mark all fields as touched
			setBankingTouched({
				bankNum: true,
				transitNum: true,
				accountNum: true,
			});

			return false;
		}
	};

	// Validate banking form fields
	const validateBankingField = (field, value) => {
		try {
			const schema = BankingFormSchema.pick([field]);
			schema.validateSync({ [field]: value });
			setBankingErrors({
				...bankingErrors,
				[field]: "",
			});
			return true;
		} catch (error) {
			setBankingErrors({
				...bankingErrors,
				[field]: error.message,
			});
			return false;
		}
	};

	const handleBankInfoChange = (section, field, value) => {
		handleChange(section, field, value);
		if (bankingTouched[field]) validateBankingField(field, value);
	};

	// Handle banking form field blur for validation
	const handleBankingBlur = (field) => {
		setBankingTouched({
			...bankingTouched,
			[field]: true,
		});

		validateBankingField(field, formData.bankingInfo[field]);
	};

	// Handle banking form submission
	const handleBankingSubmit = () => {
		if (formData.bankingInfo.directDeposit === "No" || validateBankingForm()) {
			// toast({
			// 	title: "Banking information saved",
			// 	status: "success",
			// 	duration: 3000,
			// 	isClosable: true,
			// });
		}
	};
	return (
		<Flex height="100%">
			<Box
				p={6}
				width="280px"
				borderRight="1px solid"
				borderColor="gray.200"
				flexShrink={0}
				bg="gray.50"
			>
				<Stepper index={bankingSubStep} orientation="vertical" gap={8} sx={tabPanelStyleCss}>
					{bankingSubSteps.map((step, index) => (
						<Step key={index} onClick={() => setBankingSubStep(index)} cursor="pointer" py={2}>
							<StepIndicator>
								<StepStatus
									complete={<StepIcon fontSize="1.2em" color="white" bg={"var(--banner_bg)"} />}
									incomplete={<StepNumber fontSize="1.1em" color={"var(--banner_bg)"} />}
									active={<StepNumber fontSize="1.1em" color="white" bg={"var(--banner_bg)"} />}
								/>
							</StepIndicator>
							<Box flexShrink="0" ml={3}>
								<StepTitle fontWeight={bankingSubStep === index ? "bold" : "normal"} mb={1}>
									{step.title}
								</StepTitle>
								<StepDescription fontSize="sm" color="gray.600">
									{step.description}
								</StepDescription>
							</Box>
							<StepSeparator />
						</Step>
					))}
				</Stepper>
			</Box>

			<Box flex={1} overflowY="auto" css={tabScrollCss}>
				{/* Payment Notification Sub-step */}
				{bankingSubStep === 0 && (
					<Stack spacing={4} p={5}>
						<TextTitle size="xl" title="Payment Notification" />

						<FormControl>
							<FormLabel size="sm">Send Paystub by Email on Pay Day</FormLabel>
							<Select
								size="sm"
								value={formData.bankingInfo.payStubSendByEmail}
								onChange={(e) =>
									handleBankInfoChange("bankingInfo", "payStubSendByEmail", e.target.value)
								}
							>
								<option value="Yes">Yes</option>
								<option value="No">No</option>
							</Select>
						</FormControl>

						{formData.bankingInfo.payStubSendByEmail === "Yes" && (
							<FormControl>
								<FormLabel size="sm">Email for Paystub Delivery</FormLabel>
								<Input
									size="sm"
									type="email"
									value={formData.bankingInfo.paymentEmail}
									onChange={(e) =>
										handleBankInfoChange("bankingInfo", "paymentEmail", e.target.value)
									}
									placeholder="Enter email address"
								/>
							</FormControl>
						)}

						<Button
							mt={4}
							bg={"var(--banner_bg)"}
							color="white"
							_hover={{ bg: "#4a2b4a" }}
							onClick={() => {
								// toast({
								// 	title: "Payment notification settings saved",
								// 	status: "success",
								// 	duration: 3000,
								// 	isClosable: true,
								// });
							}}
						>
							Save Notification Settings
						</Button>
					</Stack>
				)}

				{/* Banking Info Sub-step */}
				{bankingSubStep === 1 && (
					<Stack spacing={4} p={5}>
						<TextTitle size="xl" title="Banking Information" />

						<FormControl>
							<FormLabel size="sm">Deposit Paycheque via Direct Deposit</FormLabel>
							<Select
								size="sm"
								value={formData.bankingInfo.directDeposit}
								onChange={(e) =>
									handleBankInfoChange("bankingInfo", "directDeposit", e.target.value)
								}
							>
								<option value="Yes">Yes</option>
								<option value="No">No</option>
							</Select>
						</FormControl>

						{formData.bankingInfo.directDeposit === "Yes" && (
							<>
								<FormControl isRequired isInvalid={bankingTouched.bankNum && bankingErrors.bankNum}>
									<FormLabel size="sm">Bank Number</FormLabel>
									<Input
										size="sm"
										value={formData.bankingInfo.bankNum}
										onChange={(e) => handleBankInfoChange("bankingInfo", "bankNum", e.target.value)}
										onBlur={() => handleBankingBlur("bankNum")}
										placeholder="Enter bank number (3 digits)"
									/>
									<FormErrorMessage>{bankingErrors.bankNum}</FormErrorMessage>
								</FormControl>

								<FormControl
									isRequired
									isInvalid={bankingTouched.transitNum && bankingErrors.transitNum}
								>
									<FormLabel size="sm">Transit Number</FormLabel>
									<Input
										size="sm"
										value={formData.bankingInfo.transitNum}
										onChange={(e) =>
											handleBankInfoChange("bankingInfo", "transitNum", e.target.value)
										}
										onBlur={() => handleBankingBlur("transitNum")}
										placeholder="Enter transit number (5 digits)"
									/>
									<FormErrorMessage>{bankingErrors.transitNum}</FormErrorMessage>
								</FormControl>

								<FormControl
									isRequired
									isInvalid={bankingTouched.accountNum && bankingErrors.accountNum}
								>
									<FormLabel size="sm">Account Number</FormLabel>
									<Input
										size="sm"
										value={formData.bankingInfo.accountNum}
										onChange={(e) =>
											handleBankInfoChange("bankingInfo", "accountNum", e.target.value)
										}
										onBlur={() => handleBankingBlur("accountNum")}
										placeholder="Enter account number (7-16 digits)"
									/>
									<FormErrorMessage>{bankingErrors.accountNum}</FormErrorMessage>
								</FormControl>
							</>
						)}

						<Button
							mt={4}
							bg={"var(--banner_bg)"}
							color="white"
							_hover={{ bg: "#4a2b4a" }}
							onClick={handleBankingSubmit}
						>
							Save Banking Information
						</Button>
					</Stack>
				)}
			</Box>
		</Flex>
	);
};
export default BankingInfo;
