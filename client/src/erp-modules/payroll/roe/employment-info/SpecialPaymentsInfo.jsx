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
import { useEffect, useState } from "react";
import { SPECIAL_PAYMENT_OPTIONS } from "../data";

export const SpecialPaymentsInfo = ({
	roeData,
	handleArrayChange,
	removeArrayRow,
	addArrayRow,
	formData,
}) => {
	const [errors, setErrors] = useState({});
	const validate = () => {
		const newErrors = {};
		(roeData?.specialPayments || []).forEach((p, i) => {
			if (!p.code) {
				// an empty row is left out when the ROE is saved
				if (Object.values(p).some(Boolean))
					newErrors[i] = { ...newErrors[i], code: "Code is required" };
			} else {
				const option = SPECIAL_PAYMENT_OPTIONS.find((o) => o.code === p.code);
				if (option.startRequired && !p.startDate)
					newErrors[i] = { ...newErrors[i], startDate: "Start Date is required" };
				if (option.endRequired && !p.endDate)
					newErrors[i] = { ...newErrors[i], endDate: "End Date is required" };
				if (option.amountRequired && !p.amount)
					newErrors[i] = { ...newErrors[i], amount: "Amount is required" };
				if (option.periodRequired && !p.period)
					newErrors[i] = { ...newErrors[i], period: "Period is required" };
			}
		});
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};
	// ROE-01: rows are checked as they are filled in
	useEffect(() => {
		validate();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [roeData?.specialPayments]);


	return (
		<>
			<TextTitle size="xl" title={"Special Payments"} />
			<div className="p-3 border rounded space-y-2">
				{(roeData?.specialPayments || []).map((p, i) => (
					<VStack key={i} align="stretch" spacing={2} borderWidth="1px" p={3} borderRadius="md">
						<HStack spacing={2} align="end">
							{/* Code */}
							<FormControl isInvalid={errors[i]?.code}>
								<FormLabel>Code</FormLabel>
								<Select
									value={p.code}
									onChange={(e) => {
										if (e.target.value) {
											handleArrayChange("specialPayments", i, "code", e.target.value);
										}
									}}
									placeholder="Select Code"
								>
									{SPECIAL_PAYMENT_OPTIONS.map((o) => (
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
									value={p.startDate}
									onChange={(e) =>
										handleArrayChange("specialPayments", i, "startDate", e.target.value)
									}
								/>
								<FormErrorMessage>{errors[i]?.startDate}</FormErrorMessage>
							</FormControl>

							{/* End Date */}
							<FormControl isInvalid={errors[i]?.endDate}>
								<FormLabel>End Date</FormLabel>
								<Input
									type="date"
									value={p.endDate}
									onChange={(e) =>
										handleArrayChange("specialPayments", i, "endDate", e.target.value)
									}
								/>
								<FormErrorMessage>{errors[i]?.endDate}</FormErrorMessage>
							</FormControl>

							{/* Amount */}
							<FormControl isInvalid={errors[i]?.amount}>
								<FormLabel>Amount</FormLabel>
								<Input
									type="number"
									step="0.01"
									value={p.amount}
									onChange={(e) =>
										handleArrayChange("specialPayments", i, "amount", e.target.value)
									}
								/>
								<FormErrorMessage>{errors[i]?.amount}</FormErrorMessage>
							</FormControl>

							{/* Period */}
							<FormControl isInvalid={errors[i]?.period}>
								<FormLabel>Period</FormLabel>
								<Input
									value={p.period}
									onChange={(e) => {
										if (e.target.value) {
											handleArrayChange("specialPayments", i, "period", e.target.value);
										}
									}}
									placeholder="D=Day, W=Week"
								/>
								<FormErrorMessage>{errors[i]?.period}</FormErrorMessage>
							</FormControl>

							{/* Remove Button */}
							<Button colorScheme="red" onClick={() => removeArrayRow("specialPayments", i)}>
								X
							</Button>
						</HStack>
					</VStack>
				))}
				<HStack>
					{roeData?.specialPayments?.length < 3 && (
						<Button
							colorScheme="green"
							onClick={() =>
								addArrayRow("specialPayments", {
									code: "",
									startDate: "",
									endDate: "",
									amount: "",
									period: "",
								})
							}
							alignSelf="flex-start"
						>
							+ Add Special Payment
						</Button>
					)}
				</HStack>
			</div>
		</>
	);
};
