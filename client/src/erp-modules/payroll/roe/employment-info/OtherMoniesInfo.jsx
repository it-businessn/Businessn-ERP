import {
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	HStack,
	Input,
	Select,
	VStack,
} from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import { useState } from "react";
import { OTHER_MONIES_OPTIONS } from "../data";

export const OtherMoniesInfo = ({ roeData, handleArrayChange, removeArrayRow, addArrayRow }) => {
	const [errors, setErrors] = useState({});

	const validate = () => {
		const newErrors = {};
		roeData.otherMonies.forEach((om, i) => {
			if (!om.code) {
				newErrors[i] = { ...newErrors[i], code: "Code is required" };
			} else {
				const option = OTHER_MONIES_OPTIONS.find((o) => o.code === om.code);
				if (option.amountRequired && !om.amount) {
					newErrors[i] = { ...newErrors[i], amount: "Amount is required" };
				}
				if (option.startRequired && !om.startDate) {
					newErrors[i] = { ...newErrors[i], startDate: "Start Date is required" };
				}
				if (option.endRequired && !om.endDate) {
					newErrors[i] = { ...newErrors[i], endDate: "End Date is required" };
				}
			}
		});
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};
	const handleSubmit = () => {
		if (!validate()) return;
		console.log("Validated Other Monies:", roeData.otherMonies);
	};
	return (
		<>
			<TextTitle size="xl" title={"Other Monies"} />
			<div className="p-3 border rounded space-y-2">
				{roeData?.otherMonies?.map((om, i) => (
					<VStack key={i} align="stretch" spacing={2} borderWidth="1px" p={3} borderRadius="md">
						<HStack key={i} spacing={2} align="end">
							{/* Code */}
							<FormControl isInvalid={errors[i]?.code}>
								<FormLabel>Code</FormLabel>
								<Select
									placeholder="Select Code"
									value={om.code}
									onChange={(e) => {
										if (e.target.value) {
											handleArrayChange("otherMonies", i, "code", e.target.value);
										}
									}}
								>
									{OTHER_MONIES_OPTIONS.map((o) => (
										<option key={o.code} value={o.code}>
											{o.code} - {o.description}
										</option>
									))}
								</Select>
								<FormErrorMessage>{errors[i]?.code}</FormErrorMessage>
							</FormControl>

							{/* Start Date */}
							<FormControl isInvalid={errors[i]?.startDate}>
								<FormLabel>Start Date</FormLabel>
								<Input
									type="date"
									value={om.startDate}
									onChange={(e) => handleArrayChange("otherMonies", i, "startDate", e.target.value)}
								/>
								<FormErrorMessage>{errors[i]?.startDate}</FormErrorMessage>
							</FormControl>

							{/* End Date */}
							<FormControl isInvalid={errors[i]?.endDate}>
								<FormLabel>End Date</FormLabel>
								<Input
									type="date"
									value={om.endDate}
									onChange={(e) => handleArrayChange("otherMonies", i, "endDate", e.target.value)}
								/>
								<FormErrorMessage>{errors[i]?.endDate}</FormErrorMessage>
							</FormControl>

							{/* Amount */}
							<FormControl isInvalid={errors[i]?.amount}>
								<FormLabel>Amount</FormLabel>
								<Input
									type="number"
									step="0.01"
									value={om.amount}
									onChange={(e) => handleArrayChange("otherMonies", i, "amount", e.target.value)}
								/>
								<FormErrorMessage>{errors[i]?.amount}</FormErrorMessage>
							</FormControl>

							{/* Remove Button */}
							<Button colorScheme="red" onClick={() => removeArrayRow("otherMonies", i)}>
								X
							</Button>
						</HStack>
					</VStack>
				))}
				<HStack>
					{roeData?.otherMonies?.length < 3 && (
						<Button
							colorScheme="green"
							onClick={() =>
								addArrayRow("otherMonies", { code: "", startDate: "", endDate: "", amount: "" })
							}
							alignSelf="flex-start"
						>
							+ Add Other Money
						</Button>
					)}
					<Button colorScheme="blue" onClick={handleSubmit}>
						Validate & Save
					</Button>
				</HStack>
			</div>
		</>
	);
};
