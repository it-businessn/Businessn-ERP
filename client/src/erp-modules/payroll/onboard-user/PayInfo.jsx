import { Box, Flex, FormControl, FormLabel, Input, Select, Stack } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";

const PayInfo = ({ tabScrollCss, formData, handleChange }) => {
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
							<option value="hourly">Hourly</option>
							<option value="salary">Salary</option>
							<option value="commission">Commission</option>
						</Select>
					</FormControl>
				</Flex>

				<Flex gap={4}>
					<FormControl isRequired>
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
					</FormControl>

					<FormControl>
						<FormLabel size="sm">Tax Withholding</FormLabel>
						<Input
							size="sm"
							value={formData.payInfo.taxWithholding}
							onChange={(e) => handleChange("payInfo", "taxWithholding", e.target.value)}
							placeholder="Tax Withholding"
						/>
					</FormControl>
				</Flex>
			</Stack>
		</Box>
	);
};
export default PayInfo;
