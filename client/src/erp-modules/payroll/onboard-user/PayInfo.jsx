import { Box, Flex, FormControl, FormLabel, Input, Select, Stack } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import { tabScrollCss } from "./customInfo";

const PayInfo = ({ formData, handleChange }) => {
	return (
		<Box height="100%" overflowY="auto" css={tabScrollCss}>
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
							onChange={(e) => handleChange("payInfo", "payType", e.target.value)}
						>
							<option value="Hourly">Hourly</option>
							<option value="FTsalary">Full Time Salaried</option>
							<option value="PTsalary">Part Time Salaried</option>
							{/* <option value="commission">Commission</option> */}
						</Select>
					</FormControl>
				</Flex>

				<Flex gap={4}>
					{formData.payInfo.payType === "FTsalary" ? (
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
					) : formData.payInfo.payType === "PTsalary" ? (
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
	);
};
export default PayInfo;
