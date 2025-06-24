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
} from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import { FaInfoCircle } from "react-icons/fa";
import { governmentSubSteps, tabPanelStyleCss, tabScrollCss } from "./customInfo";

const GovernmentInfo = ({
	governmentSubStep,
	setGovernmentSubStep,
	formData,
	handleChange,
	governmentProvinces,
}) => {
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

			<Box flex={1} overflowY="auto" css={tabScrollCss}>
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
								value={formData.governmentInfo.federalTax}
								onChange={(e) => handleChange("governmentInfo", "federalTax", e.target.value)}
							>
								{["Canada", "US"].map((country) => (
									<option key={country} value={country}>
										{country}
									</option>
								))}
							</Select>
						</FormControl>

						<FormControl>
							<FormLabel size="sm">Regional Tax</FormLabel>
							<Select
								size="sm"
								value={formData.governmentInfo.regionalTax}
								onChange={(e) => handleChange("governmentInfo", "regionalTax", e.target.value)}
							>
								{governmentProvinces.map((province) => (
									<option key={province} value={province}>
										{province}
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
									value={formData.governmentInfo.federalTaxCredit}
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
									value={formData.governmentInfo.regionalTaxCredit}
									onChange={(e) =>
										handleChange("governmentInfo", "regionalTaxCredit", e.target.value)
									}
									placeholder="Enter amount"
								/>
							</FormControl>
						</SimpleGrid>
					</Stack>
				)}
			</Box>
		</Flex>
	);
};
export default GovernmentInfo;
