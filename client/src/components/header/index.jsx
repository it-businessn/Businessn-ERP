import { Box, Flex, HStack, IconButton, Spacer, Stack } from "@chakra-ui/react";
import { HiOutlineMenu } from "react-icons/hi";
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
	onOpen,
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
				{/* F-02: on phones the module tabs are hidden, so the drawer is the only
				    way to navigate. The drawer existed but nothing opened it. */}
				{isMobile && (
					<IconButton
						aria-label="Open navigation menu"
						icon={<HiOutlineMenu size="1.5em" />}
						variant="ghost"
						color="var(--main_color)"
						_hover={{ bg: "rgba(255,255,255,0.15)" }}
						onClick={onOpen}
						ml={2}
					/>
				)}
				<Logo />
				<Flex
					w="100%"
					// backgroundImage={navBarImg}
					p={isMobile ? 2 : 3}
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
						<Stack minW={isMobile ? "auto" : "320px"} spacing={0}>
							<TextTitle size={isMobile ? "sm" : "lg"} title={companyName} />
							{!isMobile && <TextTitle size={"lg"} title={companyId} />}
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
