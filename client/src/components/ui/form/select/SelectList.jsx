import { Icon, Select } from "@chakra-ui/react";
import { COLORS } from "erp-modules/project-management/workview/project/data";
import { FaCaretDown, FaCaretRight } from "react-icons/fa";

import { generateLighterShade } from "utils";

const SelectList = ({
	_id,
	id,
	data,
	selectedValue,
	code,
	bg_color = COLORS.primary,
	isRight,
	handleSelect,
	type,
	isTimesheetAction,
	isTimesheetPayType,
}) => {
	const handleChange = (event) => {
		if (handleSelect && type) {
			handleSelect(type, event.target.value, id);
		}
	};

	const value = selectedValue
		? Array.isArray(selectedValue)
			? selectedValue[0]
			: selectedValue
		: "";

	return (
		<Select
			icon={<Icon as={isRight ? FaCaretRight : FaCaretDown} />}
			borderRadius={"10px"}
			size={"sm"}
			color={!isTimesheetPayType && "var(--primary_button_bg)"}
			bg={generateLighterShade(bg_color, 0.9)}
			border={
				isTimesheetPayType
					? `1px solid var(--filter_border_color)`
					: `1px solid var(--primary_button_bg)`
			}
			value={value}
			onChange={handleChange}
			placeholder={!isTimesheetAction && "Select"}
		>
			{data?.map((item) => (
				<option
					value={item[code]}
					key={`${_id}${item.name || item._id || item[code]}`}
					style={{ color: (isTimesheetAction || isTimesheetPayType) && item.color }}
				>
					{item[code]}
					{code === "abbr" && ` - ${item.name}`}
				</option>
			))}
		</Select>
	);
};

export default SelectList;
