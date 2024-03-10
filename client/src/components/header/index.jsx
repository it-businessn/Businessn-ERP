import { HamburgerIcon } from "@chakra-ui/icons";
import {
	Box,
	Flex,
	HStack,
	IconButton,
	Select,
	Spacer,
	Stack,
	Text,
	VStack,
} from "@chakra-ui/react";
import { Tab, UserProfile } from "components";
import Logo from "components/logo";
import { SIDEBAR_MENU } from "components/sidebar/data";
import { FaSyncAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useBreakpointValue } from "services/Breakpoint";

const COMPANIES = [
	{ name: "Fractional Departments", value: "FD" },
	{ name: "BusinessN Corporate", value: "BusinessN" },
];

const Navbar = ({
	company,
	selectedCompany,
	handleClick,
	user,
	handleLogout,
	onOpen,
}) => {
	const { isMobile } = useBreakpointValue();

	const handleChange = (value) => {
		selectedCompany(value);
	};

	const companyList = () => (
		<Flex flexDir={"column"} w={{ base: "60%", md: "auto" }}>
			<Select
				fontSize={{ base: "sm", md: "md" }}
				icon={
					<IconButton
						ml={"1em"}
						size="sm"
						icon={<FaSyncAlt />}
						aria-label="Refresh"
						variant="round"
					/>
				}
				border={"none"}
				fontWeight="bold"
				onChange={(e) => handleChange(e.target.value)}
			>
				{COMPANIES.map(({ name, value }) => (
					<option value={value}>
						<Text>{name}</Text>
					</option>
				))}
			</Select>
		</Flex>
	);

	// const menuOptions = () => {
	// 	// company === "FD" ? FD_SIDEBAR_MENU : BUSINESSN_SIDEBAR_MENU;
	// 	return SIDEBAR_MENU;
	// };

	const profile = () => (
		<>
			<Spacer />
			<UserProfile user={user} handleLogout={handleLogout} />
		</>
	);

	return (
		<Box
			pl={{ base: 0, md: 3 }}
			pt={3}
			pr={3}
			position="fixed"
			width="100%"
			color="brand.nav_color"
			zIndex={1}
			bg="brand.nav_gradient"
		>
			{isMobile && (
				<HStack>
					{companyList()}
					{profile()}
				</HStack>
			)}
			<HStack spacing={0} alignItems="center" pr={{ base: "0em", md: "1em" }}>
				{isMobile && (
					<IconButton
						icon={<HamburgerIcon />}
						aria-label="Open Sidebar"
						color="brand.600"
						onClick={() => onOpen()}
					/>
				)}
				<Flex
					justify="start"
					align={{ base: "center", md: "flex-end" }}
					w="100%"
				>
					<VStack align="start" m={0}>
						<Logo />
						{!isMobile && companyList()}
					</VStack>

					{SIDEBAR_MENU?.map((menu) => (
						<Link to={menu?.path}>
							<Stack ml={{ base: "1em", md: "2em" }} key={menu.id}>
								<Tab
									handleClick={handleClick}
									color="primary"
									menu={menu}
									label={menu.name}
								/>
							</Stack>
						</Link>
					))}
					{!isMobile && profile()}
				</Flex>
			</HStack>
		</Box>
	);
};
export default Navbar;
