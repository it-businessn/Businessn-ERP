import { Flex, IconButton, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
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
}) => {
	const [actionName, setActionName] = useState(ACTION_STATUS[0].title);
	const [bg, setBg] = useState(ACTION_STATUS[0].color);

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
				minW="100px"
				textTransform="uppercase"
				isDisabled={isDisabled || status?.includes(actionName)}
				color={"var(--primary_bg)"}
				bg={bg}
				size="xs"
				name={`${actionName} ${isRowAction ? "" : "all"}`}
				px={0}
				hover={{
					bg,
					color: "var(--primary_bg)",
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
				<MenuList minW="150px">
					{ACTION_STATUS.map(({ color, title, bg }) => (
						<MenuItem
							key={title}
							onClick={() => {
								setActionName(title);
								setBg(color);
								if (setIsActionSwitched) setIsActionSwitched(title);
							}}
							color={color}
							hover={{
								bg: "var(--correct_ans)",
								color: "var(--primary_bg)",
							}}
						>
							<TextTitle textTransform="uppercase" title={title} />
						</MenuItem>
					))}
				</MenuList>
			</Menu>
		</Flex>
	);
};

export default ActionAll;
