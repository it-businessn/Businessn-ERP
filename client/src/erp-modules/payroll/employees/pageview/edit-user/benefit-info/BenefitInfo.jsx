import {
	Box,
	Flex,
	FormControl,
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
	benefitsSubSteps,
	tabPanelStyleCss,
	tabScrollCss,
} from "erp-modules/payroll/onboard-user/customInfo";
import useEmployeeBalanceInfo from "hooks/useEmployeeBalanceInfo";
import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";
import { VacationBenefit } from "./VacationBenefit";

const defaultBenefitInfo = {
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
};
const BenefitInfo = ({ company, userId, payPeriodPayDate }) => {
	const toast = useToast();
	const [benefitsSubStep, setBenefitsSubStep] = useState(0);
	const balanceInfo = useEmployeeBalanceInfo(company, userId, payPeriodPayDate);
	const [moreDetails, setMoreDetails] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isDisabled, setIsDisabled] = useState(false);
	const [formData, setFormData] = useState(defaultBenefitInfo);

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
				},
			});
			setMoreDetails({ empId, _id });
		}
	}, [balanceInfo]);

	useEffect(() => {
		if (
			!formData?.benefitsInfo?.typeOfVacationTreatment ||
			!formData?.benefitsInfo?.vacationPayPercent
		) {
			setIsDisabled(true);
		} else {
			setIsDisabled(false);
		}
	}, [formData?.benefitsInfo?.typeOfVacationTreatment, formData?.benefitsInfo?.vacationPayPercent]);

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
					<VacationBenefit
						formData={formData}
						handleChange={handleChange}
						setIsDisabled={setIsDisabled}
					/>
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
					isDisabled={isDisabled}
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
