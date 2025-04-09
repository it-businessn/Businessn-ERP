import { Button, Flex, HStack, Input, InputGroup, InputLeftElement, Text } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";

const CustomFilter = ({ isMobile }) => {
	return isMobile ? (
		<Flex flexDir="column">
			<Flex justify="space-between">
				<Text fontWeight="bold">Orders</Text>
				{/* <Button
                bg="var(--primary_button_bg)"
                color={"var(--primary_bg)"}
                variant={"solid"}
                size="xs"
                _hover={{ color: "var(--main_color_black)" }}
                borderRadius={"10px"}
            >
                Add new sales
            </Button> */}
			</Flex>
			<HStack spacing="1em" mt="1em">
				<Button
					color={"var(--nav_color)"}
					leftIcon={<MdOutlineFilterList />}
					border={"2px solid var(--filter_border_color)"}
					borderRadius={"10px"}
					variant={"ghost"}
					size={"xs"}
					_hover={{ color: "var(--main_color_black)", bg: "transparent" }}
				>
					Filter
				</Button>
				<InputGroup
					borderRadius={"10px"}
					border={"1px solid var(--filter_border_color)"}
					fontSize="xs"
					size={"xs"}
					fontWeight="bold"
				>
					<InputLeftElement children={<FaSearch />} />
					<Input
						_placeholder={{
							color: "var(--nav_color)",
							fontSize: "xs",
						}}
						color={"var(--nav_color)"}
						bg={"var(--primary_bg)"}
						type="text"
						placeholder="Search here"
						pr="4.5rem"
						py={"1.2em"}
					/>
				</InputGroup>
			</HStack>
		</Flex>
	) : (
		<HStack spacing={3} justify={"flex-end"}>
			<Button
				color={"var(--nav_color)"}
				leftIcon={<MdOutlineFilterList />}
				border={"2px solid var(--filter_border_color)"}
				borderRadius={"10px"}
				variant={"ghost"}
				size={"xs"}
				_hover={{ color: "var(--main_color_black)", bg: "transparent" }}
				ml={2}
			>
				Filter
			</Button>
			<InputGroup
				w={"40%"}
				borderRadius={"10px"}
				border={"1px solid var(--filter_border_color)"}
				fontSize="xs"
				fontWeight="bold"
				size={"xs"}
			>
				<InputLeftElement children={<FaSearch />} />
				<Input
					_placeholder={{
						color: "var(--nav_color)",
						fontSize: "xs",
					}}
					color={"var(--nav_color)"}
					bg={"var(--primary_bg)"}
					type="text"
					placeholder="Search here"
					pr="4.5rem"
					py={"1.2em"}
				/>
			</InputGroup>
			<Button
				bg="var(--primary_button_bg)"
				color={"var(--primary_bg)"}
				variant={"solid"}
				size={"xs"}
				px={"1em"}
				_hover={{ color: "var(--main_color_black)" }}
				borderRadius={"10px"}
				isDisabled
			>
				Add new orders
			</Button>
		</HStack>
	);
};

export default CustomFilter;
