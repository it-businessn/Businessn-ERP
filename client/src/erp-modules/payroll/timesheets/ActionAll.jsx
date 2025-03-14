import { Flex, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { ACTION_STATUS } from "./data";

const ActionAll = ({
	isDisabled,
	handleButtonClick,
	w = "10%",
	isRowAction,
	status,
	setIsActionSwitched,
	isApproveDisabled,
	setRowAction,
	actions = ACTION_STATUS,
	id,
	setRowId,
}) => {
	const [actionName, setActionName] = useState(actions[0].title);
	const [actionIcon, setActionIcon] = useState(actions[0].icon);
	const [color, setColor] = useState(actions[0].color);

	return (
		<Flex
			w={w}
			alignItems="center"
			cursor="pointer"
			border="1px solid var(--filter_border_color)"
			borderRadius="10px"
			gap={0}
			justifyContent="space-between"
		>
			<PrimaryButton
				minW="105px"
				// textTransform="uppercase"
				isDisabled={
					(actionName === actions[0].title && isApproveDisabled) ||
					isDisabled ||
					status?.includes(actionName)
				}
				bg={"var(--action_status_bg)"}
				color={color}
				size="xs"
				name={
					<HStack spacing={1} alignItems="center">
						{actionIcon}
						<TextTitle size="sm" title={`${actionName} ${isRowAction ? "" : "all"}`} />
					</HStack>
				}
				px={0}
				hover={{
					bg: "var(--action_status_bg)",
					color,
				}}
				onOpen={() => handleButtonClick(actionName)}
			/>
			<Menu>
				<MenuButton
					as={IconButton}
					height="auto"
					icon={<FaCaretDown fontSize={isRowAction ? "1.2em" : "1.5em"} color="var(--logo_bg)" />}
					aria-label="Options"
				/>
				<MenuList minW="150px" zIndex={10}>
					{actions.map(({ color, title, icon }) => (
						<MenuItem
							py={"2px"}
							key={title}
							onClick={() => {
								setActionName(title);
								setActionIcon(icon);
								if (setRowAction) {
									setRowAction(title);
									setRowId(id);
								}
								setColor(color);
								if (setIsActionSwitched) setIsActionSwitched(title);
							}}
							color={color}
							hover={{
								bg: "var(--action_status_approve)",
								color: "var(--primary_bg)",
							}}
						>
							<HStack p={0} justifyContent="start" alignItems="center">
								{icon}
								<TextTitle size="sm" title={title} />
							</HStack>
						</MenuItem>
					))}
				</MenuList>
			</Menu>
		</Flex>
	);
};

export default ActionAll;
