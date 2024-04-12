import { HamburgerIcon } from "@chakra-ui/icons";
import {
	Box,
	Flex,
	HStack,
	IconButton,
	Select,
	Spacer,
	Stack,
	VStack,
} from "@chakra-ui/react";
import { Tab, UserProfile } from "components";
import Logo from "components/logo";
import { useEffect, useState } from "react";
import { FaSyncAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useBreakpointValue } from "services/Breakpoint";
import SettingService from "services/SettingService";

const Navbar = ({
	company,
	setSelectedCompany,
	handleClick,
	user,
	handleLogout,
	onOpen,
	tabs,
}) => {
	const [companies, setCompanies] = useState(null);
	useEffect(() => {
		const fetchCompanyInfo = async () => {
			try {
				const response = await SettingService.getAllCompanies();
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
				{companies?.map((company) => (
					<option value={company.name} key={company._id}>
						{company.name}
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
					{tabs
						?.filter((tab) => tab.permissions)
						?.map((menu) => (
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
						))}
					{!isMobile && profile()}
				</Flex>
			</HStack>
		</Box>
	);
};
export default Navbar;
