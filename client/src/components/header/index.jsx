import { Box, Flex, HStack, Spacer } from "@chakra-ui/react";
import { Menu, UserProfile } from "components";
import { SIDEBAR_MENU } from "data";
import useCompany from "hooks/useCompany";
import useCompanyList from "hooks/useCompanyList";
import LocalStorageService from "services/LocalStorageService";
import LoginService from "services/LoginService";
import Company from "./Company";

const Navbar = ({ handleClick, onOpen, user, setUser, isMobile }) => {
	const { company, setSelectedCompany } = useCompany(
		user?.companyId[0]?.name || "",
	);

	const companies = useCompanyList(user?._id);

	const handleLogout = async () => {
		try {
			await LoginService.signOut(user._id);
			LocalStorageService.removeItem("user");
			setUser(null);
		} catch (error) {
			console.log(error.response.data.error);
		}
	};

	// const [selectedCompany, setSelectedCompany] = useState(company);

	const handleCompany = (company = "FD") => {
		// if (company === "FD") {
		// 	setActiveMenu(FD_SIDEBAR_MENU.find((menu) => menu.id === "sales"));
		// } else {
		// 	setActiveMenu(BUSINESSN_SIDEBAR_MENU.find((menu) => menu.id === "sales"));
		// }
		LocalStorageService.setItem("selectedCompany", company);

		// setActiveMenu(SIDEBAR_MENU?.find((menu) => menu.id === "sales"));
	};

	const handleChange = (value) => {
		setSelectedCompany(value);
	};

	// const menuOptions = () => {
	// 	// company === "FD" ? FD_SIDEBAR_MENU : BUSINESSN_SIDEBAR_MENU;
	// 	return SIDEBAR_MENU;
	// };

	const menuList = SIDEBAR_MENU?.filter((tab) => tab.permissions);

	return (
		<Box
			pl={{ base: 0, md: 3 }}
			pt={3}
			pr={3}
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
					{/* {isMobile ? (
						<IconButton
							icon={<HamburgerIcon />}
							aria-label="Open Sidebar"
							color="var(--main_color_black)"
							onClick={onOpen}
						/>
					) : (
						<></>
					)} */}
					<Flex
						justify="start"
						align={{ base: "center", md: "flex-end" }}
						w="100%"
					>
						<Company
							value={company}
							handleChange={handleChange}
							data={companies}
						/>
						{menuList?.map((menu) =>
							menu.permissions?.canAccessModule ? (
								<Menu key={menu.name} handleClick={handleClick} menu={menu} />
							) : null,
						)}
						<Spacer />
						<UserProfile user={user} handleLogout={handleLogout} />
					</Flex>
				</HStack>
			)}
		</Box>
	);
};
export default Navbar;
