import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { FaCaretDown } from "react-icons/fa";

const SelectTypeRecord = ({ param, formData, setFormData, handleConfirm }) => {
	const newCostCenter =
		formData.employmentCostCenter === "Golf Operations"
			? "Golf"
			: formData.employmentCostCenter;

	return (
		<FormControl>
			<FormLabel>{param.name}</FormLabel>
			<Select
				icon={<FaCaretDown />}
				borderRadius="10px"
				size="sm"
				placeholder={`Select ${param.name}`}
				name={param.param_key}
				value={formData[param.param_key]}
				onChange={(e) => {
					setFormData((prev) => ({
						...prev,
						[param.param_key]: e.target.value,
					}));
					handleConfirm();
				}}
			>
				{param.name === "Department" && formData.employmentCostCenter !== ""
					? param.options
							.filter(({ type }) => type.includes(newCostCenter))
							?.map(({ type }) => (
								<option value={type} key={type}>
									{type}
								</option>
							))
					: param.options?.map(({ type }) => (
							<option value={type} key={type}>
								{type}
							</option>
					  ))}
			</Select>
		</FormControl>
	);
};

export default SelectTypeRecord;
