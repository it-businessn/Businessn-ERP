import { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";

import { Flex, FormControl, FormLabel, Input, Select, SimpleGrid, Stack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import RequiredLabel from "components/ui/form/RequiredLabel";
import { EARNING_TYPE } from "erp-modules/payroll/onboard-user/customInfo";

const EarningInfo = ({
	role,
	handleUpdate,
	updateRecordIndex,
	setEditedIndices,
	editedIndices,
}) => {
	const [roleInfo, setRoleInfo] = useState(role);
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		setIsError(parseFloat(roleInfo?.payRate) < 17.85);
	}, [roleInfo?.payRate]);

	const handleChange = (index, e) => {
		const { name, value } = e.target;
		setRoleInfo((prevData) => ({ ...prevData, [name]: value }));
		setEditedIndices((prev) => ({ ...prev, [index]: true }));
	};

	return (
		<Stack spacing={4}>
			<SimpleGrid columns={4} spacing={3}>
				<FormControl>
					<RequiredLabel required label="Pay Rate" />
					<Input
						size="sm"
						type="number"
						name="payRate"
						value={roleInfo?.payRate || ""}
						onChange={(e) => handleChange(updateRecordIndex, e)}
						placeholder="Pay Rate"
					/>
					{isError && <FormLabel color={"red"}>Pay rate must be at least $17.85</FormLabel>}
				</FormControl>
				<FormControl isRequired>
					<FormLabel size="sm">Pay Type</FormLabel>
					<Select
						size="sm"
						value={roleInfo?.typeOfEarning || ""}
						onChange={(e) => {
							if (e.target.value) {
								setEditedIndices((prev) => ({ ...prev, [updateRecordIndex]: true }));
								setRoleInfo((prevData) => ({
									...prevData,
									typeOfEarning: e.target.value,
								}));
							}
						}}
					>
						<option value={EARNING_TYPE.HOURLY}>Hourly</option>
						<option value={EARNING_TYPE.FT}>Full Time Salaried</option>
						<option value={EARNING_TYPE.PT}>Part Time Salaried</option>
						{/* <option value="commission">Commission</option> */}
					</Select>
				</FormControl>
				<Flex gap={4}>
					{roleInfo?.typeOfEarning === EARNING_TYPE.FT && (
						<FormControl>
							<FormLabel size="sm">Standard Hours (FT)</FormLabel>
							<Input
								size="sm"
								type="number"
								name="fullTimeStandardHours"
								value={roleInfo?.fullTimeStandardHours || 80}
								onChange={(e) => handleChange(updateRecordIndex, e)}
								placeholder="Enter Full Time Hours"
							/>
						</FormControl>
					)}
					{roleInfo?.typeOfEarning === EARNING_TYPE.PT && (
						<FormControl>
							<FormLabel size="sm">Standard Hours (PT)</FormLabel>
							<Input
								type="number"
								size="sm"
								name="partTimeStandardHours"
								value={roleInfo?.partTimeStandardHours || 40}
								onChange={(e) => handleChange(updateRecordIndex, e)}
								placeholder="Enter Part Time Hours"
							/>
						</FormControl>
					)}
					{/* <FormControl isRequired>
						<FormLabel size="sm">Pay Frequency</FormLabel>
						<Select
							size="sm"
							value={roleInfo?.payInfo.payFrequency}
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
							value={roleInfo?.payInfo.taxWithholding}
							onChange={(e) => handleChange("payInfo", "taxWithholding", e.target.value)}
							placeholder="Tax Withholding"
						/>
					</FormControl> */}
				</Flex>
			</SimpleGrid>
			<Stack w={"10%"} justifyContent={"end"}>
				{editedIndices[updateRecordIndex] && !isError && (
					<PrimaryButton
						w={"100px"}
						bg="var(--banner_bg)"
						onOpen={() => handleUpdate(roleInfo, updateRecordIndex)}
						size="xs"
						borderRadius={6}
						name="Save"
						rightIcon={<FaSave />}
					/>
				)}
			</Stack>
		</Stack>
	);
};

export default EarningInfo;
