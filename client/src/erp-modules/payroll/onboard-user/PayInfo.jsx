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
} from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import {
	EARNING_TYPE,
	payInfoSubSteps,
	tabPanelStyleCss,
	tabScrollCss,
} from "erp-modules/payroll/onboard-user/customInfo";

const PayInfo = ({ formData, handleChange }) => {
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
				<Stepper index={0} orientation="vertical" gap={8} sx={tabPanelStyleCss}>
					{payInfoSubSteps.map((step, index) => (
						<Step key={index} cursor="pointer" py={2}>
							<StepIndicator>
								<StepStatus
									complete={<StepIcon fontSize="1.2em" color="white" bg={"var(--banner_bg)"} />}
									incomplete={<StepNumber fontSize="1.1em" color={"var(--banner_bg)"} />}
									active={<StepNumber fontSize="1.1em" color="white" bg={"var(--banner_bg)"} />}
								/>
							</StepIndicator>
							<Box flexShrink="0" ml={3}>
								<StepTitle fontWeight={"bold"} mb={1}>
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
				<Stack spacing={4} p={5}>
					<TextTitle size="xl" title="Compensation Information" />

					<Flex gap={4}>
						<FormControl isRequired>
							<FormLabel size="sm">Pay Rate</FormLabel>
							<Input
								size="sm"
								type="number"
								value={formData.payInfo.salary}
								onChange={(e) => handleChange("payInfo", "salary", e.target.value)}
								placeholder="Pay Rate"
							/>
						</FormControl>

						<FormControl isRequired>
							<FormLabel size="sm">Pay Type</FormLabel>
							<Select
								size="sm"
								value={formData.payInfo.payType}
								onChange={(e) => {
									if (e.target.value) handleChange("payInfo", "payType", e.target.value);
								}}
							>
								<option value={EARNING_TYPE.HOURLY}>Hourly</option>
								<option value={EARNING_TYPE.FT}>Full Time Salaried</option>
								<option value={EARNING_TYPE.PT}>Part Time Salaried</option>
								{/* <option value="commission">Commission</option> */}
							</Select>
						</FormControl>
					</Flex>

					<Flex gap={4}>
						{formData.payInfo.payType === EARNING_TYPE.FT ? (
							<FormControl>
								<FormLabel size="sm">Standard Hours (FT)</FormLabel>
								<Input
									size="sm"
									type="number"
									value={formData.payInfo.fullTimeStandardHours}
									onChange={(e) => handleChange("payInfo", "fullTimeStandardHours", e.target.value)}
									placeholder="Enter Full Time Hours"
								/>
							</FormControl>
						) : formData.payInfo.payType === EARNING_TYPE.PT ? (
							<FormControl>
								<FormLabel size="sm">Standard Hours (PT)</FormLabel>
								<Input
									type="number"
									size="sm"
									value={formData.payInfo.partTimeStandardHours}
									onChange={(e) => handleChange("payInfo", "partTimeStandardHours", e.target.value)}
									placeholder="Enter Part Time Hours"
								/>
							</FormControl>
						) : (
							<></>
						)}
						{/* <FormControl isRequired>
						<FormLabel size="sm">Pay Frequency</FormLabel>
						<Select
							size="sm"
							value={formData.payInfo.payFrequency}
							onChange={(e) => handleChange("payInfo", "payFrequency", e.target.value)}
						>
							<option value="weekly">Weekly</option>
							<option value="biweekly">Bi-weekly</option>
							<option value="monthly">Monthly</option>
						</Select>
					</FormControl> */}

						{/* <FormControl>
						<FormLabel size="sm">Tax Withholding</FormLabel>
						<Input
							size="sm"
							value={formData.payInfo.taxWithholding}
							onChange={(e) => handleChange("payInfo", "taxWithholding", e.target.value)}
							placeholder="Tax Withholding"
						/>
					</FormControl> */}
					</Flex>
				</Stack>
			</Box>
		</Flex>
	);
};
export default PayInfo;
