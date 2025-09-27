import { Button, Divider, FormControl, FormLabel, HStack, Input, Stack } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import { FaPlus } from "react-icons/fa";

export const VacationBenefit = ({ formData, handleChange }) => {
	return (
		<Stack spacing={2} p={5}>
			<TextTitle size="xl" title="Vacation" />

			<FormControl isRequired>
				<FormLabel size="sm">Vacation Treatment</FormLabel>
				<HStack spacing={4}>
					<label>
						<input
							type="radio"
							checked={formData.benefitsInfo.typeOfVacationTreatment === "Payout"}
							onChange={() => handleChange("benefitsInfo", "typeOfVacationTreatment", "Payout")}
							style={{ marginRight: "8px" }}
						/>
						Payout
					</label>
					<label>
						<input
							type="radio"
							checked={formData.benefitsInfo.typeOfVacationTreatment === "Accrued"}
							onChange={() => handleChange("benefitsInfo", "typeOfVacationTreatment", "Accrued")}
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
						onChange={(e) => handleChange("benefitsInfo", "vacationAdjustment", e.target.value)}
					/>
				</FormControl>
			</HStack>
		</Stack>
	);
};
