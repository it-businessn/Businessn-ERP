import { HamburgerIcon } from "@chakra-ui/icons";
import {
	Box,
	Flex,
	HStack,
	IconButton,
	Spacer,
	Stack,
	VStack,
} from "@chakra-ui/react";
import { Tab, UserProfile } from "components";
import Logo from "components/logo";
import SelectBox from "components/ui/form/select/SelectBox";
import { useEffect, useState } from "react";
import { FaSyncAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useBreakpointValue } from "services/Breakpoint";
import LocalStorageService from "services/LocalStorageService";
import SettingService from "services/SettingService";

const Navbar = ({ handleClick, handleLogout, onOpen, tabs, user }) => {
	const [companies, setCompanies] = useState(null);

	const [selectedCompany, setSelectedCompany] = useState(
		user?.companyId[0]?.name || "",
	);

	const handleCompany = (company = "FD") => {
		// if (company === "FD") {
		// 	setActiveMenu(FD_SIDEBAR_MENU.find((menu) => menu.id === "sales"));
		// } else {
		// 	setActiveMenu(BUSINESSN_SIDEBAR_MENU.find((menu) => menu.id === "sales"));
		// }
		LocalStorageService.setItem("selectedCompany", selectedCompany);

		// setActiveMenu(SIDEBAR_MENU?.find((menu) => menu.id === "sales"));
	};
	useEffect(() => {
		handleCompany(selectedCompany);
		document.dispatchEvent(
			new CustomEvent("selectedCompanyChanged", {
				detail: selectedCompany,
			}),
		);
	}, [selectedCompany]);

	useEffect(() => {
		const fetchCompanyInfo = async () => {
			try {
				const response = await SettingService.getAllCompaniesByUser(user?._id);
				setCompanies(response.data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchCompanyInfo();
	}, []);

	const { isMobile } = useBreakpointValue();

	const handleChange = (value) => {
		setSelectedCompany(value);
	};

	const companyList = () => (
		<Flex flexDir={"column"} w={{ base: "60%", md: "auto" }}>
			{companies && (
				<SelectBox
					icon={
						<IconButton
							ml={"1em"}
							size="sm"
							icon={<FaSyncAlt />}
							aria-label="Refresh"
							variant="round"
						/>
					}
					value={selectedCompany}
					handleChange={handleChange}
					data={companies}
					name="name"
					fontWeight="bold"
					// placeholder={"No companies found"}
				/>
			)}
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

	const menuList = tabs?.filter((tab) => tab.permissions);

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
					{menuList?.map(
						(menu) =>
							menu.permissions?.canAccessModule && (
								<Link to={menu?.path} key={menu.name}>
									<Stack ml={{ base: "1em", md: "2em" }} key={menu.id}>
										<Tab
											handleClick={handleClick}
											color="primary"
											menu={menu}
											label={menu.name}
										/>
									</Stack>
								</Link>
							),
					)}
					{!isMobile && profile()}
				</Flex>
			</HStack>
		</Box>
	);
};
export default Navbar;
