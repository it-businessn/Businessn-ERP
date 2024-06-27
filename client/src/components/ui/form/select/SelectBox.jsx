import { Select } from "@chakra-ui/react";

const SelectBox = ({
	icon,
	handleChange,
	data,
	name,
	border = "none",
	color,
	value,
	placeholder,
	size,
	fontWeight,
	width,
}) => {
	return (
		<Select
			w={width}
			fontSize={{ base: "sm" }}
			size={size}
			icon={icon}
			border={border}
			fontWeight={fontWeight}
			borderRadius={"10px"}
			color={color}
			value={value}
			placeholder={placeholder}
			onChange={(e) => handleChange(e.target.value)}
		>
			{data?.map((_) => (
				<option value={_[name]} key={_._id}>
					{_[name]}
				</option>
			))}
		</Select>
	);
};

export default SelectBox;
