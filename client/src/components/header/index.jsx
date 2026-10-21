import { Box, Flex, HStack, IconButton, Stack } from "@chakra-ui/react";
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
				{/* UI-01: never let the module bar squeeze the logo to zero width */}
				<Box flexShrink={0}>
					<Logo />
				</Box>
				{/* flex/minW 0 instead of w=100%: next to the phone menu button a full-width
				    row was 48px too wide and pushed the help icon off-screen */}
				<Flex
					flex="1"
					minW={0}
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
						{/* Long company names are cut with an ellipsis instead of pushing the
						    profile menu off the header (phones: the name takes the free space). */}
						<Stack
							minW={isMobile ? 0 : "10rem"}
							maxW={isMobile ? "none" : "20rem"}
							flex={isMobile ? "1" : undefined}
							flexShrink={isMobile ? 1 : 0}
							overflow="hidden"
							sx={{ "& > p": { overflow: "hidden", textOverflow: "ellipsis" } }}
							spacing={0}
						>
							<TextTitle size={isMobile ? "sm" : "lg"} title={companyName} />
							{!isMobile && <TextTitle size={"lg"} title={companyId} />}
						</Stack>
						{/* UI-01: modules shrink first, then scroll sideways; they no longer push
						    the profile menu off-screen on 1280-1536px wide viewports. */}
						<HStack
							display={isMobile ? "none" : "flex"}
							flex="1"
							minW={0}
							h="auto"
							overflowX="auto"
							css={{ scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}
						>
							{!isMobile &&
								menuListWithPermissions?.map((menu) =>
									menu.permissions?.canAccessModule ? (
										<Menu key={menu.name} handleClick={handleClick} menu={menu} />
									) : null,
								)}
						</HStack>
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
