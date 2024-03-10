import { Icon, Select } from "@chakra-ui/react";
import { COLORS } from "erp-modules/project-management/workview/data";
import { FaCaretDown } from "react-icons/fa";

import { generateLighterShade } from "utils";

const SelectList = ({
	data,
	selectedValue,
	code,
	bg_color = COLORS.primary,
}) => {
	const handleChange = (event) => {
		console.log(event.target.value);
	};

	const value = Array.isArray(selectedValue) ? selectedValue[0] : selectedValue;

	return (
		<Select
			icon={<Icon as={FaCaretDown} />}
			borderRadius={"10px"}
			size={"sm"}
			color={"brand.primary_button_bg"}
			bg={generateLighterShade(bg_color, 0.9)}
			border={`1px solid var(--primary_button_bg)`}
			value={value}
			onChange={handleChange}
		>
			{data.map((item) => (
				<option value={item[code]} key={item.id}>
					{item[code]}
				</option>
			))}
		</Select>
	);
};

export default SelectList;