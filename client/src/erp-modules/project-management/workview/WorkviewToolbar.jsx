import {
	Box,
	Button,
	ButtonGroup,
	Flex,
	HStack,
	Icon,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	Select,
	Spacer,
} from "@chakra-ui/react";
import { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { FaCaretDown, FaSearch } from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { MdDateRange } from "react-icons/md";
import { VIEW_MODE } from "./project/data";

const WorkviewToolbar = () => {
	const [viewMode, setViewMode] = useState(VIEW_MODE[0].name);
	const switchToView = (name) => setViewMode(name);
	return (
		<Flex
			justifyContent={"space-between"}
			gap={{ base: 0, lg: "1.5em" }}
			flexDir={{ base: "column", lg: "row" }}
		>
			<Box mb={4} bg={"var(--main_color)"} borderRadius={"1em"} px="5px">
				<ButtonGroup variant="solid" p={0} m={0}>
					{VIEW_MODE.map(({ name, id }) => (
						<Button
							key={id}
							m={"0 !important"}
							onClick={() => switchToView(name)}
							color={viewMode === name ? "brand.100" : "brand.nav_color"}
							bg={
								viewMode === name
									? "var(--primary_button_bg)"
									: "var(--main_color)"
							}
							borderRadius={"1em"}
							size={"sm"}
							variant={"solid"}
							fontWeight={viewMode === name ? "bold" : "normal"}
							_hover={{ bg: "transparent", color: "brand.600" }}
						>
							{name}
						</Button>
					))}
				</ButtonGroup>
			</Box>
			<Spacer />
			<Box>
				<InputGroup
					borderRadius={"1em"}
					border={"1px solid var(--filter_border_color)"}
					fontWeight="bold"
				>
					<InputLeftElement size="xs" children={<FaSearch />} />
					<Input
						borderRadius={"1em"}
						_placeholder={{
							color: "brand.nav_color",
							fontSize: "sm",
							verticalAlign: "top",
						}}
						color={"brand.nav_color"}
						bg={"transparent"}
						type="text"
						placeholder="People or owner"
					/>
				</InputGroup>
			</Box>
			<Box my={{ base: "1em", lg: "0" }}>
				<ButtonGroup
					variant="solid"
					isAttached
					p={0}
					m={0}
					borderRadius={"1em"}
					border={"1px solid var(--filter_border_color)"}
				>
					<IconButton
						icon={<AiOutlineUser />}
						borderRadius={"1em"}
						color="purple.100"
						bg={"brand.primary_button_bg"}
						p={"0.4em"}
						_hover={{ bg: "transparent", color: "brand.600" }}
					/>
					<IconButton
						icon={<HiOutlineUserGroup />}
						borderRadius={"1em"}
						color="brand.nav_color"
						p={"0.4em"}
						bg={"transparent"}
						_hover={{ bg: "transparent", color: "brand.600" }}
					/>
				</ButtonGroup>
			</Box>
			<Box mb={{ base: "1em", lg: "0" }}>
				<HStack
					borderRadius={"1em"}
					border={"1px solid var(--filter_border_color)"}
					color="brand.nav_color"
				>
					<Icon as={MdDateRange} boxSize={4} ml={2} />
					<Select fontSize={"sm"} icon={<Icon as={FaCaretDown} />}>
						<option>Last Month</option>
					</Select>
				</HStack>
			</Box>
		</Flex>
	);
};

export default WorkviewToolbar;
