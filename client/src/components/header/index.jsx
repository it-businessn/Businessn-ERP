import { Box, Flex, HStack, Spacer, Stack } from "@chakra-ui/react";
import { Menu, UserProfile } from "components";
import Logo from "components/logo";
import TextTitle from "components/ui/text/TextTitle";
import { ROLES } from "constant";
import { SIDEBAR_MENU } from "data";
import useCompany from "hooks/useCompany";
import LocalStorageService from "services/LocalStorageService";
import LoginService from "services/LoginService";

const Navbar = ({ handleClick, companyName, companyId, user, setUser, isMobile }) => {
	const { company } = useCompany(companyName);

	const handleLogout = async () => {
		try {
			await LoginService.signOut(user._id);
			LocalStorageService.clear();
			sessionStorage.removeItem("accessToken");
			setUser(null);
		} catch (error) {
			console.log(error?.response?.data?.error);
		}
	};

	const menuList = SIDEBAR_MENU?.filter((tab) => tab.permissions);

	return (
		<Box
			pl={{ base: 0, md: 3 }}
			pt={isMobile ? 0 : 3}
			position="fixed"
			width="100%"
			color="var(--nav_color)"
			zIndex={1}
			bg="var(--main_color)"
		>
			<HStack spacing={0} alignItems="center" pr={{ base: "0em", md: "1em" }}>
				<Logo />
				<Flex
					w="100%"
					bg="var(--banner_bg)"
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
							<TextTitle size={isMobile ? "sm" : "lg"} title={company} />
							<TextTitle size={"lg"} title={companyId} />
						</Stack>
						<HStack w="100%" h={"30"}>
							{user?.role !== ROLES.EMPLOYEE &&
								menuList?.map((menu) =>
									menu.permissions?.canAccessModule ? (
										<Menu key={menu.name} handleClick={handleClick} menu={menu} />
									) : null,
								)}
						</HStack>
						<Spacer />
						<UserProfile user={user} isMobile={isMobile} handleLogout={handleLogout} />
					</HStack>
				</Flex>
			</HStack>
		</Box>
	);
};
export default Navbar;
