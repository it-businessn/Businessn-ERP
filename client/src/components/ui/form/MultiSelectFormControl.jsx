import { Avatar, Button, FormLabel, Text } from "@chakra-ui/react";
import { FaCaretDown } from "react-icons/fa";
import FormControlMain from ".";
import MultiSelectBox from "./select/MultiSelectBox";

const MultiSelectFormControl = ({
	showMultiSelect,
	data,
	handleCloseMenu,
	selectedOptions,
	setSelectedOptions,
	handleMenuToggle,
	list,
	label,
	tag,
	size = "sm",
	hideAvatar,
}) => {
	return (
		<FormControlMain>
			<FormLabel visibility={showMultiSelect ? "" : "hidden"}>
				{label}
			</FormLabel>
			<Button
				rightIcon={<FaCaretDown />}
				bg={"var(--primary_bg)"}
				color={"var(--primary_button_bg)"}
				_hover={{
					bg: "var(--primary_bg)",
					color: "var(--primary_button_bg)",
				}}
			>
				{showMultiSelect ? (
					<MultiSelectBox
						data={data}
						openMenu={showMultiSelect}
						handleCloseMenu={handleCloseMenu}
						selectedOptions={selectedOptions}
						setSelectedOptions={setSelectedOptions}
					/>
				) : (
					<Text onClick={handleMenuToggle}>
						{list?.length > 0 ? `${list?.length} ${tag}` : label}
					</Text>
				)}
			</Button>
			{!hideAvatar &&
				list?.length > 0 &&
				list.map((name) => (
					<Avatar size={size} name={name} src={name} key={name} />
				))}
		</FormControlMain>
	);
};

export default MultiSelectFormControl;
