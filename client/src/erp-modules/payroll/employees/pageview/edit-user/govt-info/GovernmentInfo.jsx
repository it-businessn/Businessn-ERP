import {
	Box,
	Flex,
	FormControl,
	FormLabel,
	Input,
	Select,
	SimpleGrid,
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
	Tooltip,
	useToast,
} from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import {
	COUNTRIES,
	tabPanelStyleCss,
	tabScrollCss,
	userInfoDetails,
} from "erp-modules/payroll/onboard-user/customInfo";
import useEmployeeGovernment from "hooks/useEmployeeGovernment";
import { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import PayrollService from "services/PayrollService";

const GovernmentInfo = ({ company, userId }) => {
	const governmentSubSteps = [
		{ title: "Exemption", description: "CPP/EI exemptions" },
		{ title: "Income Tax", description: "Tax settings" },
		{ title: "Federal Contributions", description: "Federal deductions" },
		{ title: "Regional Deductions", description: "Provincial deductions" },
	];
	const toast = useToast();
	const [governmentSubStep, setGovernmentSubStep] = useState(0);
	const [governmentProvinces, setGovernmentProvinces] = useState([]);
	const [moreDetails, setMoreDetails] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState(userInfoDetails);
	const governmentInfo = useEmployeeGovernment(company, userId);

	useEffect(() => {
		if (governmentInfo) {
			const {
				isCPPExempt,
				isEIExempt,
				federalTax,
				regionalTax,
				regionalTaxCredit,
				federalTaxCredit,
				federalPensionEE,
				federalEmploymentInsuranceEE,
				federalEmploymentInsuranceER,
				federalPensionER,
				regionalEmployeeInjury,
				regionalEmployeeHealth,
				regionalEmployerHealth,
				empId,
				_id,
			} = governmentInfo;

			setFormData({
				governmentInfo: {
					isCPPExempt,
					isEIExempt,
					federalTax,
					regionalTax,
					regionalTaxCredit,
					federalTaxCredit,
					federalPensionEE,
					federalEmploymentInsuranceEE,
					federalEmploymentInsuranceER,
					federalPensionER,
					regionalEmployeeInjury,
					regionalEmployeeHealth,
					regionalEmployerHealth,
				},
			});
			setMoreDetails({ empId, _id });
		}
	}, [governmentInfo]);

	useEffect(() => {
		const selectedCountry = COUNTRIES.find(
			({ code }) => code === formData.governmentInfo.federalTax,
		);
		if (selectedCountry) {
			setGovernmentProvinces(selectedCountry.provinces);
		}
	}, [formData.governmentInfo.federalTax]);

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
				isCPPExempt,
				isEIExempt,
				federalTax,
				regionalTax,
				regionalTaxCredit,
				federalTaxCredit,
				federalPensionEE,
				federalEmploymentInsuranceEE,
				federalEmploymentInsuranceER,
				federalPensionER,
				regionalEmployeeInjury,
				regionalEmployeeHealth,
				regionalEmployerHealth,
			} = formData.governmentInfo;

			const govtContrInfo = {
				empId: moreDetails.empId,
				companyName: company,
				isCPPExempt,
				isEIExempt,
				federalTax,
				regionalTax,
				regionalTaxCredit,
				federalTaxCredit,
				federalPensionEE,
				federalEmploymentInsuranceEE,
				federalEmploymentInsuranceER,
				federalPensionER,
				regionalEmployeeInjury,
				regionalEmployeeHealth,
				regionalEmployerHealth,
			};

			const { data } = await PayrollService.updateEmployeeGovernmentInfo(
				govtContrInfo,
				moreDetails?._id,
			);
			setIsLoading(false);
			toast({
				title: "Government info updated successfully.",
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
				<Stepper index={governmentSubStep} orientation="vertical" gap={8} sx={tabPanelStyleCss}>
					{governmentSubSteps.map((step, index) => (
						<Step key={index} onClick={() => setGovernmentSubStep(index)} cursor="pointer" py={2}>
							<StepIndicator>
								<StepStatus
									complete={<StepIcon fontSize="1.2em" color="white" bg={"var(--banner_bg)"} />}
									incomplete={<StepNumber fontSize="1.1em" color={"var(--banner_bg)"} />}
									active={<StepNumber fontSize="1.1em" color="white" bg={"var(--banner_bg)"} />}
								/>
							</StepIndicator>
							<Box flexShrink="0" ml={3}>
								<StepTitle fontWeight={governmentSubStep === index ? "bold" : "normal"} mb={1}>
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
				{governmentSubStep === 0 && (
					<Stack spacing={4} p={5}>
						<TextTitle size="xl" title="Exemption" />
						<FormControl>
							<Tooltip
								hasArrow
								label="Canada Pension Plan/Quebec Pension Plan exemption status"
								placement="top"
							>
								<FormLabel size="sm">
									CPP/QPP Exemption
									<FaInfoCircle
										size="0.8em"
										color="#718096"
										style={{ display: "inline", marginBottom: "3px" }}
									/>
								</FormLabel>
							</Tooltip>
							<Flex gap={4} mt={2}>
								<label>
									<input
										type="radio"
										checked={formData.governmentInfo.isCPPExempt}
										onChange={() => handleChange("governmentInfo", "isCPPExempt", true)}
										style={{ marginRight: "8px" }}
									/>
									Yes
								</label>
								<label>
									<input
										type="radio"
										checked={!formData.governmentInfo.isCPPExempt}
										onChange={() => handleChange("governmentInfo", "isCPPExempt", false)}
										style={{ marginRight: "8px" }}
									/>
									No
								</label>
							</Flex>
						</FormControl>

						<FormControl>
							<Tooltip hasArrow label="Employment Insurance exemption status" placement="top">
								<FormLabel size="sm">
									EI Exemption
									<FaInfoCircle
										size="0.8em"
										color="#718096"
										style={{ display: "inline", marginBottom: "3px" }}
									/>
								</FormLabel>
							</Tooltip>
							<Flex gap={4} mt={2}>
								<label>
									<input
										type="radio"
										checked={formData.governmentInfo.isEIExempt}
										onChange={() => handleChange("governmentInfo", "isEIExempt", true)}
										style={{ marginRight: "8px" }}
									/>
									Yes
								</label>
								<label>
									<input
										type="radio"
										checked={!formData.governmentInfo.isEIExempt}
										onChange={() => handleChange("governmentInfo", "isEIExempt", false)}
										style={{ marginRight: "8px" }}
									/>
									No
								</label>
							</Flex>
						</FormControl>
					</Stack>
				)}

				{/* Income Tax Sub-step */}
				{governmentSubStep === 1 && (
					<Stack spacing={4} p={5}>
						<TextTitle size="xl" title="Income Tax" />
						<FormControl>
							<FormLabel size="sm">Federal Tax</FormLabel>
							<Select
								size="sm"
								value={formData.governmentInfo.federalTax || ""}
								onChange={(e) => handleChange("governmentInfo", "federalTax", e.target.value)}
								placeholder="Select Country"
							>
								{COUNTRIES.map(({ type, code }) => (
									<option key={type} value={code}>
										{type}
									</option>
								))}
							</Select>
						</FormControl>

						<FormControl>
							<FormLabel size="sm">Regional Tax</FormLabel>
							<Select
								size="sm"
								value={formData.governmentInfo.regionalTax || ""}
								onChange={(e) => handleChange("governmentInfo", "regionalTax", e.target.value)}
								placeholder="Select Region"
							>
								{governmentProvinces.map(({ name, id }) => (
									<option key={name} value={id}>
										{name}
									</option>
								))}
							</Select>
						</FormControl>

						<SimpleGrid columns={2} spacing={6}>
							<FormControl>
								<FormLabel size="sm">Personal Federal Tax Credit</FormLabel>
								<Input
									size="sm"
									type="number"
									value={formData.governmentInfo.federalTaxCredit || ""}
									onChange={(e) =>
										handleChange("governmentInfo", "federalTaxCredit", e.target.value)
									}
									placeholder="Enter amount"
								/>
							</FormControl>

							<FormControl>
								<FormLabel size="sm">Personal Regional Tax Credit</FormLabel>
								<Input
									size="sm"
									type="number"
									value={formData.governmentInfo.regionalTaxCredit || ""}
									onChange={(e) =>
										handleChange("governmentInfo", "regionalTaxCredit", e.target.value)
									}
									placeholder="Enter amount"
								/>
							</FormControl>
						</SimpleGrid>
					</Stack>
				)}

				{/* Federal Contributions Sub-step */}
				{governmentSubStep === 2 && (
					<Stack spacing={4} p={5}>
						<TextTitle size="xl" title="Federal Government Contributions" />
						<SimpleGrid columns={2} spacing={6}>
							<FormControl>
								<Tooltip hasArrow label="Employee contribution to pension plan" placement="top">
									<FormLabel size="sm">
										Pension (EE)
										<FaInfoCircle
											size="0.8em"
											color="#718096"
											style={{ display: "inline", marginBottom: "3px" }}
										/>
									</FormLabel>
								</Tooltip>
								<Input
									size="sm"
									value={formData.governmentInfo.federalPensionEE || ""}
									onChange={(e) =>
										handleChange("governmentInfo", "federalPensionEE", e.target.value)
									}
									placeholder="Enter amount"
								/>
							</FormControl>

							<FormControl>
								<Tooltip
									hasArrow
									label="Employee contribution to employment insurance"
									placement="top"
								>
									<FormLabel size="sm">
										Employment Insurance (EE)
										<FaInfoCircle
											size="0.8em"
											color="#718096"
											style={{ display: "inline", marginBottom: "3px" }}
										/>
									</FormLabel>
								</Tooltip>
								<Input
									size="sm"
									value={formData.governmentInfo.federalEmploymentInsuranceEE || ""}
									onChange={(e) =>
										handleChange("governmentInfo", "federalEmploymentInsuranceEE", e.target.value)
									}
									placeholder="Enter amount"
								/>
							</FormControl>
						</SimpleGrid>

						<SimpleGrid columns={2} spacing={6}>
							<FormControl>
								<Tooltip hasArrow label="Employer contribution to pension plan" placement="top">
									<FormLabel size="sm">
										Pension (ER)
										<FaInfoCircle
											size="0.8em"
											color="#718096"
											style={{ display: "inline", marginBottom: "3px" }}
										/>
									</FormLabel>
								</Tooltip>
								<Input
									size="sm"
									value={formData.governmentInfo.federalPensionER || ""}
									onChange={(e) =>
										handleChange("governmentInfo", "federalPensionER", e.target.value)
									}
									placeholder="Enter amount"
								/>
							</FormControl>

							<FormControl>
								<Tooltip
									hasArrow
									label="Employer contribution to employment insurance"
									placement="top"
								>
									<FormLabel size="sm">
										Employment Insurance (ER)
										<FaInfoCircle
											size="0.8em"
											color="#718096"
											style={{ display: "inline", marginBottom: "3px" }}
										/>
									</FormLabel>
								</Tooltip>
								<Input
									size="sm"
									value={formData.governmentInfo.federalEmploymentInsuranceER || ""}
									onChange={(e) =>
										handleChange("governmentInfo", "federalEmploymentInsuranceER", e.target.value)
									}
									placeholder="Enter amount"
								/>
							</FormControl>
						</SimpleGrid>
					</Stack>
				)}

				{/* Regional Government Deductions Sub-step */}
				{governmentSubStep === 3 && (
					<Stack spacing={4} p={5}>
						<TextTitle size="xl" title="Regional Government Deductions" />
						<SimpleGrid columns={2} spacing={6}>
							<FormControl>
								<Tooltip hasArrow label="Deduction for employee injury insurance" placement="top">
									<FormLabel size="sm">
										Employee Injury
										<FaInfoCircle
											size="0.8em"
											color="#718096"
											style={{ display: "inline", marginBottom: "3px" }}
										/>
									</FormLabel>
								</Tooltip>
								<Input
									size="sm"
									value={formData.governmentInfo.regionalEmployeeInjury || ""}
									onChange={(e) =>
										handleChange("governmentInfo", "regionalEmployeeInjury", e.target.value)
									}
									placeholder="Enter amount"
								/>
							</FormControl>

							<FormControl>
								<Tooltip hasArrow label="Deduction for employee health insurance" placement="top">
									<FormLabel size="sm">
										Employee Health
										<FaInfoCircle
											size="0.8em"
											color="#718096"
											style={{ display: "inline", marginBottom: "3px" }}
										/>
									</FormLabel>
								</Tooltip>
								<Input
									size="sm"
									value={formData.governmentInfo.regionalEmployeeHealth || ""}
									onChange={(e) =>
										handleChange("governmentInfo", "regionalEmployeeHealth", e.target.value)
									}
									placeholder="Enter amount"
								/>
							</FormControl>
						</SimpleGrid>

						<SimpleGrid columns={2} spacing={6}>
							<FormControl>
								<Tooltip
									hasArrow
									label="Contribution from employer for injury insurance"
									placement="top"
								>
									<FormLabel size="sm">
										Employer Injury
										<FaInfoCircle
											size="0.8em"
											color="#718096"
											style={{ display: "inline", marginBottom: "3px" }}
										/>
									</FormLabel>
								</Tooltip>
								<Input
									size="sm"
									value={formData.governmentInfo.regionalEmployerInjury || ""}
									onChange={(e) =>
										handleChange("governmentInfo", "regionalEmployerInjury", e.target.value)
									}
									placeholder="Enter amount"
								/>
							</FormControl>

							<FormControl>
								<Tooltip
									hasArrow
									label="Contribution from employer for health insurance"
									placement="top"
								>
									<FormLabel size="sm">
										Employer Health
										<FaInfoCircle
											size="0.8em"
											color="#718096"
											style={{ display: "inline", marginBottom: "3px" }}
										/>
									</FormLabel>
								</Tooltip>
								<Input
									size="sm"
									value={formData.governmentInfo.regionalEmployerHealth || ""}
									onChange={(e) =>
										handleChange("governmentInfo", "regionalEmployerHealth", e.target.value)
									}
									placeholder="Enter amount"
								/>
							</FormControl>
						</SimpleGrid>
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
export default GovernmentInfo;
