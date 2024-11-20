import { Button, Menu, MenuButton } from "@chakra-ui/react";
import { FaCaretDown } from "react-icons/fa";
import TextTitle from "../text/TextTitle";
import MultiSelectBox from "./select/MultiSelectBox";

const MultiSelectButton = ({
	handleMenuToggle,
	assignees,
	openAssigneeMenu,
	data,
	handleCloseMenu,
	selectedOptions,
	setSelectedOptions,
	w,
	height,
	weight,
	tag = "assignee(s)",
	label = "Select Assignee",
}) => {
	return (
		<Menu>
			<MenuButton
				as={Button}
				bg={"var(--primary_bg)"}
				color={"var(--primary_button_bg)"}
				_hover={{
					bg: "var(--primary_bg)",
					color: "var(--primary_button_bg)",
				}}
				rightIcon={<FaCaretDown />}
				onClick={handleMenuToggle}
			>
				<TextTitle
					weight={weight}
					title={assignees?.length > 0 ? `${assignees?.length} ${tag}` : label}
				/>
			</MenuButton>
			{openAssigneeMenu && (
				<MultiSelectBox
					data={data}
					openMenu={openAssigneeMenu}
					handleCloseMenu={handleCloseMenu}
					selectedOptions={selectedOptions}
					setSelectedOptions={setSelectedOptions}
					w={w}
					height={height}
				/>
			)}
		</Menu>
	);
};

export default MultiSelectButton;
