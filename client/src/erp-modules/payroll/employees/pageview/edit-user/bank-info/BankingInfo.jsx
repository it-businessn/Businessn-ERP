import {
	Box,
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
	useToast,
} from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import {
	bankingSubSteps,
	tabPanelStyleCss,
	tabScrollCss,
	userInfoDetails,
} from "erp-modules/payroll/onboard-user/customInfo";
import useEmployeeBankingInfo from "hooks/useEmployeeBankingInfo";
import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";
import { BankingFormSchema } from "validation/BankDetails";

const BankingInfo = ({ company, userId }) => {
	const toast = useToast();
	const [bankingSubStep, setBankingSubStep] = useState(0);
	const bankingInfo = useEmployeeBankingInfo(company, userId);
	const [moreDetails, setMoreDetails] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState(userInfoDetails);

	useEffect(() => {
		if (bankingInfo) {
			const {
				payStubSendByEmail,
				directDeposit,
				paymentEmail,
				bankNum,
				transitNum,
				accountNum,
				empId,
				_id,
			} = bankingInfo;

			setFormData({
				bankingInfo: {
					payStubSendByEmail,
					directDeposit,
					paymentEmail,
					bankNum,
					transitNum,
					accountNum,
				},
			});
			setMoreDetails({ empId, _id });
		}
	}, [bankingInfo]);

	const [bankingErrors, setBankingErrors] = useState({
		bankNum: "",
		transitNum: "",
		accountNum: "",
	});

	const [bankingTouched, setBankingTouched] = useState({
		bankNum: false,
		transitNum: false,
		accountNum: false,
	});

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

			setBankingTouched({
				bankNum: true,
				transitNum: true,
				accountNum: true,
			});

			return false;
		}
	};

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

	const handleBankingBlur = (field) => {
		setBankingTouched({
			...bankingTouched,
			[field]: true,
		});

		validateBankingField(field, formData.bankingInfo[field]);
	};

	const handleChange = (section, field, value) => {
		setFormData({
			...formData,
			[section]: {
				...formData[section],
				[field]: value,
			},
		});
	};

	const handleSave = async () => {
		setIsLoading(true);
		try {
			const { payStubSendByEmail, directDeposit, paymentEmail, bankNum, transitNum, accountNum } =
				formData.bankingInfo;
			const bankInfoData = {
				empId: moreDetails?.empId || userId,
				companyName: company,
				payStubSendByEmail,
				directDeposit,
				paymentEmail,
				bankNum,
				transitNum,
				accountNum,
			};
			const { data } = moreDetails?._id
				? await PayrollService.updateEmployeeBankingInfo(bankInfoData, moreDetails?._id)
				: await PayrollService.addEmployeeBankingInfo(bankInfoData);
			setIsLoading(false);
			toast({
				title: "Banking info updated successfully.",
				status: "success",
				duration: 1000,
				isClosable: true,
			});
		} catch (error) {}
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

			<Box flex={0.7} overflowY="auto" css={tabScrollCss}>
				{/* Payment Notification Sub-step */}
				{bankingSubStep === 0 && (
					<Stack spacing={4} p={5}>
						<TextTitle size="xl" title="Payment Notification" />

						<FormControl>
							<FormLabel size="sm">Send Notification Email on Pay Day</FormLabel>
							<Select
								size="sm"
								value={formData.bankingInfo.payStubSendByEmail || ""}
								onChange={(e) => {
									const { value } = e.target;
									if (value) handleBankInfoChange("bankingInfo", "payStubSendByEmail", value);
								}}
								placeholder="Choose option"
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
									value={formData.bankingInfo.paymentEmail || ""}
									onChange={(e) =>
										handleBankInfoChange("bankingInfo", "paymentEmail", e.target.value)
									}
									placeholder="Enter email address"
								/>
							</FormControl>
						)}
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
								value={formData.bankingInfo.directDeposit || ""}
								onChange={(e) => {
									const { value } = e.target;
									if (value) handleBankInfoChange("bankingInfo", "directDeposit", value);
								}}
								placeholder="Choose option"
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
										value={formData.bankingInfo.bankNum || ""}
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
										value={formData.bankingInfo.transitNum || ""}
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
										value={formData.bankingInfo.accountNum || ""}
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
					</Stack>
				)}
				<PrimaryButton
					bg="var(--banner_bg)"
					size="sm"
					onOpen={handleSave}
					ml={5}
					mt={4}
					borderRadius={6}
					name="Save"
					isLoading={isLoading}
				/>
			</Box>
		</Flex>
	);
};
export default BankingInfo;
