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
} from "@chakra-ui/react";
import { NavButton, UserProfile } from "components";
import Logo from "components/logo";
import { SIDEBAR_MENU } from "constant";
import { FaSyncAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useBreakpointValue } from "services/Breakpoint";

const Navbar = ({ handleClick, user, handleLogout, onOpen }) => {
	const { isMobile } = useBreakpointValue();

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

					{SIDEBAR_MENU.map((menu) => (
						<Stack ml={{ base: "1em", md: "2em" }} key={menu.id}>
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
