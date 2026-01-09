import { Box, Flex, HStack, Spacer, Stack } from "@chakra-ui/react";
import { redirectLogin } from "api";
import { Menu, UserProfile } from "components";
import Logo from "components/logo";
import TextTitle from "components/ui/text/TextTitle";
import LoginService from "services/LoginService";

const Navbar = ({
	handleClick,
	companyName,
	companyId,
	user,
	setUser,
	isMobile,
	menuList,
	consoleAccess,
}) => {
	const handleLogout = async () => {
		try {
			await LoginService.signOut(user._id);
			redirectLogin();
			setUser(null);
		} catch (error) {
			console.log(error?.response?.data?.message);
		}
	};

	const menuListWithPermissions = menuList?.filter((tab) => tab.permissions);

	return (
		<Box position="fixed" width="100%" zIndex={1} bg="var(--banner_bg)">
			<HStack spacing={0} alignItems="center" px={{ base: "0em", md: "1em" }}>
				<Logo />
				<Flex
					w="100%"
					// backgroundImage={navBarImg}
					p={3}
					borderRadius={isMobile ? 0 : "10px"}
					ml={isMobile ? 0 : 3}
					// backgroundSize={"cover"}
				>
					<HStack
						align="center"
						spacing={0}
						w="100%"
						justifyContent={"start"}
						color="var(--main_color)"
					>
						<Stack minW={isMobile ? "auto" : "320px"}>
							<TextTitle size={isMobile ? "sm" : "lg"} title={companyName} />
							<TextTitle size={"lg"} title={companyId} />
						</Stack>
						<HStack w="100%" h={"30"}>
							{!isMobile &&
								menuListWithPermissions?.map((menu) =>
									menu.permissions?.canAccessModule ? (
										<Menu key={menu.name} handleClick={handleClick} menu={menu} />
									) : null,
								)}
						</HStack>
						<Spacer />
						<UserProfile
							user={user}
							isMobile={isMobile}
							handleLogout={handleLogout}
							consoleAccess={consoleAccess}
						/>
					</HStack>
				</Flex>
			</HStack>
		</Box>
	);
};
export default Navbar;
