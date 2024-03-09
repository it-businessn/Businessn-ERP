import { Icon, Select } from "@chakra-ui/react";
import { FaCaretDown } from "react-icons/fa";

import { generateLighterShade } from "utils";

const SelectBox = ({ data, selectedValue, code }) => {
	return (
		<Select
			icon={<Icon as={FaCaretDown} />}
			borderRadius={"10px"}
			size={"sm"}
			color={"brand.primary_button_bg"}
			bg={generateLighterShade("var(--primary_button_bg)", 0.9)}
			border={`1px solid var(--primary_button_bg)`}
			value={selectedValue}
			onChange={(e) => console.log(e.target.value)}
		>
			{data.map((item) => (
				<option value={item[code]} key={item.id}>
					{item[code]}
				</option>
			))}
		</Select>
	);
};

export default SelectBox;
