import {
	Box,
	Button,
	Divider,
	Flex,
	FormControl,
	FormLabel,
	HStack,
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
	benefitsSubSteps,
	tabPanelStyleCss,
	tabScrollCss,
} from "erp-modules/payroll/onboard-user/customInfo";
import useEmployeeBalanceInfo from "hooks/useEmployeeBalanceInfo";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import PayrollService from "services/PayrollService";

const BenefitInfo = ({ company, userId }) => {
	const toast = useToast();
	const [benefitsSubStep, setBenefitsSubStep] = useState(0);
	const balanceInfo = useEmployeeBalanceInfo(company, userId);
	const [moreDetails, setMoreDetails] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		benefitsInfo: {
			// Vacation
			typeOfVacationTreatment: "Accrued",
			vacationPayPercent: "",
			YTDVacationAccrued: "0.00",
			YTDVacationUsed: "0.00",
			vacationAdjustment: "",

			// Employer Contributions
			typeOfPensionERTreatment: "No Pension Contributions",
			pensionERContribution: "",
			typeOfDentalERTreatment: "No Dental Contributions",
			dentalERContribution: "",
			typeOfExtendedHealthERTreatment: "No Extended Health Contributions",
			extendedHealthERContribution: "",

			// Employee Contributions
			typeOfPensionEETreatment: "No Pension Contributions",
			pensionEEContribution: "",
			typeOfDentalEETreatment: "No Dental Contributions",
			dentalEEContribution: "",
			typeOfExtendedHealthEETreatment: "No Extended Health Contributions",
			extendedHealthEEContribution: "",
			typeOfUnionDuesTreatment: "No Union Contributions",
			unionDuesContribution: "",
		},
	});

	useEffect(() => {
		if (balanceInfo) {
			const {
				typeOfVacationTreatment,
				vacationPayPercent,
				empPayStub,
				vacationAdjustment,
				typeOfPensionERTreatment,
				pensionERContribution,
				typeOfDentalERTreatment,
				dentalERContribution,
				typeOfExtendedHealthERTreatment,
				extendedHealthERContribution,
				typeOfPensionEETreatment,
				pensionEEContribution,
				typeOfDentalEETreatment,
				dentalEEContribution,
				typeOfExtendedHealthEETreatment,
				extendedHealthEEContribution,
				typeOfUnionDuesTreatment,
				unionDuesContribution,
				empId,
				_id,
			} = balanceInfo;

			setFormData({
				benefitsInfo: {
					typeOfVacationTreatment,
					vacationPayPercent,
					YTDVacationAccrued: empPayStub?.YTDVacationAccrued.toFixed(2),
					YTDVacationUsed: empPayStub?.YTDVacationUsed.toFixed(2),
					vacationAdjustment,
					typeOfPensionERTreatment,
					pensionERContribution: typeOfPensionERTreatment?.includes("%")
						? pensionERContribution * 100
						: pensionERContribution,
					typeOfDentalERTreatment,
					dentalERContribution: typeOfDentalERTreatment?.includes("%")
						? dentalERContribution * 100
						: dentalERContribution,
					typeOfExtendedHealthERTreatment,
					extendedHealthERContribution: typeOfExtendedHealthERTreatment?.includes("%")
						? extendedHealthERContribution * 100
						: extendedHealthERContribution,
					typeOfPensionEETreatment,
					pensionEEContribution: typeOfPensionEETreatment?.includes("%")
						? pensionEEContribution * 100
						: pensionEEContribution,
					typeOfDentalEETreatment,
					dentalEEContribution: typeOfDentalEETreatment?.includes("%")
						? dentalEEContribution * 100
						: dentalEEContribution,
					typeOfExtendedHealthEETreatment,
					extendedHealthEEContribution: typeOfExtendedHealthEETreatment?.includes("%")
						? extendedHealthEEContribution * 100
						: extendedHealthEEContribution,
					typeOfUnionDuesTreatment,
					unionDuesContribution: typeOfUnionDuesTreatment?.includes("%")
						? unionDuesContribution * 100
						: unionDuesContribution,
				},
			});
			setMoreDetails({ empId, _id });
		}
	}, [balanceInfo]);

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
			const {
				typeOfVacationTreatment,
				vacationPayPercent,
				YTDVacationAccrued,
				YTDVacationUsed,
				vacationAdjustment,
				typeOfPensionERTreatment,
				pensionERContribution,
				typeOfDentalERTreatment,
				dentalERContribution,
				typeOfExtendedHealthERTreatment,
				extendedHealthERContribution,
				typeOfPensionEETreatment,
				pensionEEContribution,
				typeOfDentalEETreatment,
				dentalEEContribution,
				typeOfExtendedHealthEETreatment,
				extendedHealthEEContribution,
				typeOfUnionDuesTreatment,
				unionDuesContribution,
			} = formData.benefitsInfo;

			const benefitData = {
				empId: moreDetails?.empId || userId,
				companyName: company,
				typeOfVacationTreatment,
				vacationPayPercent,
				YTDVacationAccrued,
				YTDVacationUsed,
				vacationAdjustment,
				typeOfPensionERTreatment,
				pensionERContribution,
				typeOfDentalERTreatment,
				dentalERContribution,
				typeOfExtendedHealthERTreatment,
				extendedHealthERContribution,
				typeOfPensionEETreatment,
				pensionEEContribution,
				typeOfDentalEETreatment,
				dentalEEContribution,
				typeOfExtendedHealthEETreatment,
				extendedHealthEEContribution,
				typeOfUnionDuesTreatment,
				unionDuesContribution,
			};
			// updatedBenefit.carryFwd = carryFwd !== undefined ? !carryFwd : false;
			const { data } = moreDetails?._id
				? await PayrollService.updateEmployeeBalanceInfo(benefitData, moreDetails?._id)
				: await PayrollService.addEmployeeBalanceInfo(benefitData);
			setIsLoading(false);
			toast({
				title: "Benefits info updated successfully.",
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
				<Stepper index={benefitsSubStep} orientation="vertical" gap={8} sx={tabPanelStyleCss}>
					{benefitsSubSteps.map((step, index) => (
						<Step key={index} onClick={() => setBenefitsSubStep(index)} cursor="pointer" py={2}>
							<StepIndicator>
								<StepStatus
									complete={<StepIcon fontSize="1.2em" color="white" bg={"var(--banner_bg)"} />}
									incomplete={<StepNumber fontSize="1.1em" color={"var(--banner_bg)"} />}
									active={<StepNumber fontSize="1.1em" color="white" bg={"var(--banner_bg)"} />}
								/>
							</StepIndicator>
							<Box flexShrink="0" ml={3}>
								<StepTitle fontWeight={benefitsSubStep === index ? "bold" : "normal"} mb={1}>
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

			<Box flex={0.7} overflowY="auto" css={tabScrollCss} height={"84%"}>
				{/* Vacation Sub-step */}
				{benefitsSubStep === 0 && (
					<Stack spacing={2} p={5}>
						<TextTitle size="xl" title="Vacation" />

						<FormControl isRequired>
							<FormLabel size="sm">Vacation Treatment</FormLabel>
							<HStack spacing={4}>
								<label>
									<input
										type="radio"
										checked={formData.benefitsInfo.typeOfVacationTreatment === "Payout"}
										onChange={() =>
											handleChange("benefitsInfo", "typeOfVacationTreatment", "Payout")
										}
										style={{ marginRight: "8px" }}
									/>
									Payout
								</label>
								<label>
									<input
										type="radio"
										checked={formData.benefitsInfo.typeOfVacationTreatment === "Accrued"}
										onChange={() =>
											handleChange("benefitsInfo", "typeOfVacationTreatment", "Accrued")
										}
										style={{ marginRight: "8px" }}
									/>
									Accrued
								</label>
							</HStack>
						</FormControl>

						<FormControl isRequired>
							<FormLabel size="sm">Vacation Pay Percentage (%)</FormLabel>
							<Input
								size="sm"
								type="number"
								value={formData.benefitsInfo.vacationPayPercent || ""}
								onChange={(e) => handleChange("benefitsInfo", "vacationPayPercent", e.target.value)}
								placeholder="Enter percentage"
							/>
						</FormControl>

						<Divider />

						<TextTitle title="Vacation Balances" />

						<FormControl>
							<FormLabel size="sm">Accrued This Year</FormLabel>
							<Input
								size="sm"
								type="number"
								value={formData.benefitsInfo?.YTDVacationAccrued || ""}
								onChange={(e) => handleChange("benefitsInfo", "YTDVacationAccrued", e.target.value)}
								placeholder="0.00"
								readOnly
							/>
						</FormControl>

						<FormControl>
							<FormLabel size="sm">Used This Year</FormLabel>
							<Input
								size="sm"
								type="number"
								value={formData.benefitsInfo?.YTDVacationUsed || ""}
								onChange={(e) => handleChange("benefitsInfo", "YTDVacationUsed", e.target.value)}
								placeholder="0.00"
								readOnly
							/>
						</FormControl>

						<HStack display="none" justifyContent="start" mt={2}>
							<Button
								size="sm"
								leftIcon={<FaPlus />}
								bg={"var(--banner_bg)"}
								color="white"
								_hover={{ bg: "#4a2b4a" }}
								onClick={() => {
									// This would typically call an API to add the adjustment
									console.log("Adding adjustment:", formData.benefitsInfo.vacationAdjustment);
									// Reset the adjustment value after submission
									handleChange("benefitsInfo", "vacationAdjustment", "");
									// toast({
									// 	title: "Adjustment Added",
									// 	description: "Vacation balance adjustment has been recorded",
									// 	status: "success",
									// 	duration: 3000,
									// 	isClosable: true,
									// });
								}}
							>
								Add Adjustment
							</Button>
							<FormControl maxWidth="250px">
								<Input
									size="sm"
									type="number"
									placeholder="Enter amount to adjust"
									value={formData.benefitsInfo.vacationAdjustment || ""}
									onChange={(e) =>
										handleChange("benefitsInfo", "vacationAdjustment", e.target.value)
									}
								/>
							</FormControl>
						</HStack>
					</Stack>
				)}
				{/* Employer Contributions Sub-step */}
				{benefitsSubStep === 1 && (
					<Stack spacing={4} p={5}>
						<TextTitle size="xl" title="Employer Contributions" />

						<FormControl>
							<FormLabel size="sm">Pension Contribution Treatment</FormLabel>
							<Select
								size="sm"
								value={formData.benefitsInfo.typeOfPensionERTreatment || ""}
								onChange={(e) => {
									if (e.target.value)
										handleChange("benefitsInfo", "typeOfPensionERTreatment", e.target.value);
								}}
							>
								<option value="No Pension Contributions">No Pension Contributions</option>
								<option value="Pension Contributions (%)">Pension Contributions (%)</option>
								<option value="Amount Pension Contributions">Amount Pension Contributions</option>
								<option value="Amount per Hour Pension Contributions">
									Amount per Hour Pension Contributions
								</option>
							</Select>
						</FormControl>
						{formData.benefitsInfo.typeOfPensionERTreatment &&
							formData.benefitsInfo.typeOfPensionERTreatment !== "No Pension Contributions" && (
								<FormControl>
									<FormLabel size="sm">Pension - ER</FormLabel>
									<Input
										size="sm"
										value={formData.benefitsInfo.pensionERContribution || ""}
										onChange={(e) =>
											handleChange("benefitsInfo", "pensionERContribution", e.target.value)
										}
										placeholder="Enter value"
									/>
								</FormControl>
							)}

						<FormControl>
							<FormLabel size="sm">Dental - ER Treatment</FormLabel>
							<Select
								size="sm"
								value={formData.benefitsInfo.typeOfDentalERTreatment}
								onChange={(e) => {
									if (e.target.value)
										handleChange("benefitsInfo", "typeOfDentalERTreatment", e.target.value);
								}}
							>
								<option value="No Dental Contributions">No Dental Contributions</option>
								<option value="Dental Contributions (%)">Dental Contributions (%)</option>
								<option value="Amount Dental Contributions">Amount Dental Contributions</option>
								<option value="Amount per Hour Dental Contributions">
									Amount per Hour Dental Contributions
								</option>
							</Select>
						</FormControl>
						{formData.benefitsInfo.typeOfDentalERTreatment &&
							formData.benefitsInfo.typeOfDentalERTreatment !== "No Dental Contributions" && (
								<FormControl>
									<FormLabel size="sm">Dental - ER</FormLabel>
									<Input
										size="sm"
										value={formData.benefitsInfo.dentalERContribution || ""}
										onChange={(e) =>
											handleChange("benefitsInfo", "dentalERContribution", e.target.value)
										}
										placeholder="Enter value"
									/>
								</FormControl>
							)}

						<FormControl>
							<FormLabel size="sm">Extended Health - ER Treatment</FormLabel>
							<Select
								size="sm"
								value={formData.benefitsInfo.typeOfExtendedHealthERTreatment || ""}
								onChange={(e) => {
									if (e.target.value) {
										handleChange("benefitsInfo", "typeOfExtendedHealthERTreatment", e.target.value);
									}
								}}
							>
								<option value="No Extended Health Contributions">
									No Extended Health Contributions
								</option>
								<option value="Extended Health Contributions (%)">
									Extended Health Contributions (%)
								</option>
								<option value="Amount Extended Health Contributions">
									Amount Extended Health Contributions
								</option>
								<option value="Amount per Hour Extended Health Contributions">
									Amount per Hour Extended Health Contributions
								</option>
							</Select>
						</FormControl>
						{formData.benefitsInfo.typeOfExtendedHealthERTreatment &&
							formData.benefitsInfo.typeOfExtendedHealthERTreatment !==
								"No Extended Health Contributions" && (
								<FormControl>
									<FormLabel size="sm">Extended Health - ER</FormLabel>
									<Input
										size="sm"
										value={formData.benefitsInfo.extendedHealthERContribution || ""}
										onChange={(e) =>
											handleChange("benefitsInfo", "extendedHealthERContribution", e.target.value)
										}
										placeholder="Enter value"
									/>
								</FormControl>
							)}
					</Stack>
				)}
				{/* Employee Contributions Sub-step */}
				{benefitsSubStep === 2 && (
					<Stack spacing={4} p={5}>
						<TextTitle size="xl" title="Employee Contributions" />

						<FormControl>
							<FormLabel size="sm">Pension Contribution Treatment</FormLabel>
							<Select
								size="sm"
								value={formData.benefitsInfo.typeOfPensionEETreatment || ""}
								onChange={(e) => {
									if (e.target.value) {
										handleChange("benefitsInfo", "typeOfPensionEETreatment", e.target.value);
									}
								}}
							>
								<option value="No Pension Contributions">No Pension Contributions</option>
								<option value="Pension Contributions (%)">Pension Contributions (%)</option>
								<option value="Amount Pension Contributions">Amount Pension Contributions</option>
								<option value="Amount per Hour Pension Contributions">
									Amount per Hour Pension Contributions
								</option>
							</Select>
						</FormControl>

						{formData.benefitsInfo.typeOfPensionEETreatment &&
							formData.benefitsInfo.typeOfPensionEETreatment !== "No Pension Contributions" && (
								<FormControl>
									<FormLabel size="sm">Pension - EE</FormLabel>
									<Input
										size="sm"
										value={formData.benefitsInfo.pensionEEContribution || ""}
										onChange={(e) =>
											handleChange("benefitsInfo", "pensionEEContribution", e.target.value)
										}
										placeholder="Enter value"
									/>
								</FormControl>
							)}

						<FormControl>
							<FormLabel size="sm">Dental - EE Treatment</FormLabel>
							<Select
								size="sm"
								value={formData.benefitsInfo.typeOfDentalEETreatment || ""}
								onChange={(e) => {
									if (e.target.value) {
										handleChange("benefitsInfo", "typeOfDentalEETreatment", e.target.value);
									}
								}}
							>
								<option value="No Dental Contributions">No Dental Contributions</option>
								<option value="Dental Contributions (%)">Dental Contributions (%)</option>
								<option value="Amount Dental Contributions">Amount Dental Contributions</option>
								<option value="Amount per Hour Dental Contributions">
									Amount per Hour Dental Contributions
								</option>
							</Select>
						</FormControl>

						{formData.benefitsInfo.typeOfDentalEETreatment &&
							formData.benefitsInfo.typeOfDentalEETreatment !== "No Dental Contributions" && (
								<FormControl>
									<FormLabel size="sm">Dental - EE</FormLabel>
									<Input
										size="sm"
										value={formData.benefitsInfo.dentalEEContribution || ""}
										onChange={(e) =>
											handleChange("benefitsInfo", "dentalEEContribution", e.target.value)
										}
										placeholder="Enter value"
									/>
								</FormControl>
							)}

						<FormControl>
							<FormLabel size="sm">Extended Health - EE Treatment</FormLabel>
							<Select
								size="sm"
								value={formData.benefitsInfo.typeOfExtendedHealthEETreatment || ""}
								onChange={(e) => {
									if (e.target.value) {
										handleChange("benefitsInfo", "typeOfExtendedHealthEETreatment", e.target.value);
									}
								}}
							>
								<option value="No Extended Health Contributions">
									No Extended Health Contributions
								</option>
								<option value="Extended Health Contributions (%)">
									Extended Health Contributions (%)
								</option>
								<option value="Amount Extended Health Contributions">
									Amount Extended Health Contributions
								</option>
								<option value="Amount per Hour Extended Health Contributions">
									Amount per Hour Extended Health Contributions
								</option>
							</Select>
						</FormControl>

						{formData.benefitsInfo.typeOfExtendedHealthEETreatment &&
							formData.benefitsInfo.typeOfExtendedHealthEETreatment !==
								"No Extended Health Contributions" && (
								<FormControl>
									<FormLabel size="sm">Extended Health - EE</FormLabel>
									<Input
										size="sm"
										value={formData.benefitsInfo.extendedHealthEEContribution || ""}
										onChange={(e) =>
											handleChange("benefitsInfo", "extendedHealthEEContribution", e.target.value)
										}
										placeholder="Enter value"
									/>
								</FormControl>
							)}

						<FormControl>
							<FormLabel size="sm">Union Dues Treatment</FormLabel>
							<Select
								size="sm"
								value={formData.benefitsInfo.typeOfUnionDuesTreatment || ""}
								onChange={(e) => {
									if (e.target.value) {
										handleChange("benefitsInfo", "typeOfUnionDuesTreatment", e.target.value);
									}
								}}
							>
								<option value="No Union Contributions">No Union Contributions</option>
								<option value="Union Contributions (%)">Union Contributions (%)</option>
								<option value="Amount Union Contributions">Amount Union Contributions</option>
								<option value="Amount per Hour Union Contributions">
									Amount per Hour Union Contributions
								</option>
							</Select>
						</FormControl>

						{formData.benefitsInfo.typeOfUnionDuesTreatment &&
							formData.benefitsInfo.typeOfUnionDuesTreatment !== "No Union Contributions" && (
								<FormControl>
									<FormLabel size="sm">Union Dues</FormLabel>
									<Input
										size="sm"
										value={formData.benefitsInfo.unionDuesContribution || ""}
										onChange={(e) =>
											handleChange("benefitsInfo", "unionDuesContribution", e.target.value)
										}
										placeholder="Enter value"
									/>
								</FormControl>
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
export default BenefitInfo;
