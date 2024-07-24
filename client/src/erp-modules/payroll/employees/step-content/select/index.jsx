import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { FaCaretDown } from "react-icons/fa";

const SelectTypeRecord = ({ param, formData, setFormData, handleConfirm }) => {
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
				}}
			>
				{param.options?.map(({ type }) => (
					<option value={type} key={type}>
						{type}
					</option>
				))}
			</Select>
		</FormControl>
	);
};

export default SelectTypeRecord;
