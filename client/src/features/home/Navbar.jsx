import { HamburgerIcon } from "@chakra-ui/icons";
import {
	Box,
	Flex,
	HStack,
	IconButton,
	Spacer,
	Stack,
	Text,
	VStack,
	useBreakpointValue,
} from "@chakra-ui/react";
import { NavButton, UserProfile } from "components";
import Logo from "components/logo";
import { TOP_NAV_MENU_LIST } from "constant";
import { FaSyncAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = ({ handleClick, user, handleLogout, onOpen }) => {
	const isMobile = useBreakpointValue({ base: true, sm: false });

	return (
		<Box
			pl={3}
			pt={3}
			pr={3}
			position="fixed"
			width="100%"
			color="brand.nav_color"
			zIndex={1}
			bg="linear-gradient(103deg, rgba(244,240,255,1) 0%, rgba(238,239,241,1) 100%)"
		>
			<HStack spacing={0} alignItems="center">
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
						{!isMobile && (
							<Text fontWeight="bold">
								Fractional Departments
								<IconButton
									size="sm"
									icon={<FaSyncAlt />}
									aria-label="Refresh"
									variant="round"
								/>
							</Text>
						)}
					</VStack>

					{TOP_NAV_MENU_LIST.map((menu) => (
						<Stack ml="2em" key={menu.id}>
							<Link to={menu?.path}>
								<NavButton
									handleClick={handleClick}
									color="primary"
									menu={menu}
									label={menu.name}
								/>
							</Link>
						</Stack>
					))}
					<Spacer />
					<UserProfile user={user} handleLogout={handleLogout} />
				</Flex>
			</HStack>
		</Box>
	);
};
export default Navbar;
