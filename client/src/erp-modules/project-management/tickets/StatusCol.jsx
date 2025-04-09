import { Flex, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { ACTION_STATUS } from "../../payroll/timesheets/data";

const StatusCol = ({
	handleButtonClick,
	w = "10%",
	status,
	actions = ACTION_STATUS,
	id,
	minW = "105px",
	menuW = "150px",
	bg,
}) => {
	const [actionName, setActionName] = useState(status);
	const [actionBg, setActionBg] = useState(bg);

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
				minW={minW}
				bg={actionBg}
				color={"var(--primary_bg)"}
				size="xs"
				name={actionName}
				px={0}
				hover={{
					bg: actionBg,
					color: "var(--primary_bg)",
				}}
				onOpen={() => handleButtonClick(actionName)}
			/>
			<Menu placement="left-start">
				<MenuButton
					as={IconButton}
					height="auto"
					icon={<FaCaretDown fontSize={"1.2em"} color="var(--logo_bg)" />}
					aria-label="Options"
					minW="auto"
				/>
				<MenuList minW={menuW} zIndex={10}>
					{actions.map(({ color, title, icon }) => (
						<MenuItem
							key={title}
							onClick={() => {
								setActionName(title);
								setActionBg(color);
							}}
							color={color}
							hover={{
								bg: "var(--action_status_approve)",
								color: "var(--primary_bg)",
							}}
						>
							<HStack p={0} height={"20px"} justifyContent="start" alignItems="center">
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

export default StatusCol;
