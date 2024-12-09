import { Box, Flex, HStack, Spacer, VStack } from "@chakra-ui/react";
import { Menu, UserProfile } from "components";
import Logo from "components/logo";
import TextTitle from "components/ui/text/TextTitle";
import { SIDEBAR_MENU } from "data";
import useCompany from "hooks/useCompany";
import LocalStorageService from "services/LocalStorageService";
import LoginService from "services/LoginService";
import navBarImg from "../../assets/navbar_bg.png";

const Navbar = ({ handleClick, companyName, companyId, onOpen, user, setUser, isMobile }) => {
	const { company } = useCompany(companyName);

	const handleLogout = async () => {
		try {
			await LoginService.signOut(user._id);
			LocalStorageService.clear();
			setUser(null);
		} catch (error) {
			console.log(error.response.data.error);
		}
	};

	const menuList = SIDEBAR_MENU?.filter((tab) => tab.permissions);

	return (
		<Box
			pl={{ base: 0, md: 3 }}
			pt={3}
			position="fixed"
			width="100%"
			color="var(--nav_color)"
			zIndex={1}
			bg="var(--nav_gradient)"
		>
			{isMobile ? (
				<HStack>
					{/* {showCompanyList()} */}
					{/* {showUserInfo()} */}
				</HStack>
			) : (
				<HStack spacing={0} alignItems="center" pr={{ base: "0em", md: "1em" }}>
					<Logo />
					<Flex
						w="100%"
						backgroundImage={navBarImg}
						p={3}
						borderRadius="10px"
						ml={3}
						backgroundSize={"cover"}
					>
						<VStack
							align="center"
							spacing={0}
							w="100%"
							justifyContent={"start"}
							color="var(--main_color)"
						>
							<TextTitle size={"lg"} title={company} />
							<HStack w="100%" align={"flex-end"} h={"30"}>
								<TextTitle size={"lg"} title={companyId} width="150px" />
								{menuList?.map((menu) =>
									menu.permissions?.canAccessModule ? (
										<Menu key={menu.name} handleClick={handleClick} menu={menu} />
									) : null,
								)}
								<Spacer />
								<UserProfile user={user} handleLogout={handleLogout} />
							</HStack>
						</VStack>
					</Flex>
				</HStack>
			)}
		</Box>
	);
};
export default Navbar;
