import { Avatar, FormLabel } from "@chakra-ui/react";
import FormControlMain from ".";
import MultiSelectButton from "./MultiSelectButton";

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
	height,
	w,
	titleLabelText,
}) => {
	return (
		<FormControlMain>
			<FormLabel visibility={showMultiSelect || titleLabelText ? "visible" : "hidden"}>
				{titleLabelText || label}
			</FormLabel>

			<MultiSelectButton
				handleMenuToggle={handleMenuToggle}
				assignees={list}
				openAssigneeMenu={showMultiSelect}
				handleCloseMenu={handleCloseMenu}
				data={data}
				selectedOptions={selectedOptions}
				setSelectedOptions={setSelectedOptions}
				w={w}
				height={height}
				weight="500"
				tag={tag}
				label={label}
			/>

			{!hideAvatar &&
				list?.length > 0 &&
				list.map((name) => <Avatar size={size} name={name} src={name} key={name} />)}
		</FormControlMain>
	);
};

export default MultiSelectFormControl;
