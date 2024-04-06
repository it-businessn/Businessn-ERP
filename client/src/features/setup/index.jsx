import { Box, Button, ButtonGroup, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import UserService from "services/UserService";
import CompanyPanel from "./company/CompanyPanel";
import PermissionsPanel from "./permisssions/PermissionsPanel";
import UsersPanel from "./users/UsersPanel";

const Setup = () => {
	const [employees, setEmployees] = useState(null);
	const [filteredEmployees, setFilteredEmployees] = useState(null);
	const [isRefresh, setIsRefresh] = useState(false);

	useEffect(() => {
		const fetchAllEmployees = async () => {
			try {
				const response = await UserService.getAllUsers();
				setEmployees(response.data);
				setFilteredEmployees(response.data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchAllEmployees();
	}, [isRefresh]);

	const SETUP_LIST = [
		{
			id: 0,
			type: "Users",
			name: (
				<UsersPanel
					employees={employees}
					setFilteredEmployees={setFilteredEmployees}
					filteredEmployees={filteredEmployees}
					setIsRefresh={setIsRefresh}
				/>
			),
		},
		{
			id: 1,
			type: "Company",
			name: (
				<CompanyPanel
					employees={employees}
					setFilteredEmployees={setFilteredEmployees}
					filteredEmployees={filteredEmployees}
				/>
			),
		},
		{
			id: 2,
			type: "Permissions",
			name: (
				<PermissionsPanel
					employees={employees}
					setFilteredEmployees={setFilteredEmployees}
					filteredEmployees={filteredEmployees}
				/>
			),
		},
	];
	const [viewMode, setViewMode] = useState(SETUP_LIST[0].type);
	const showComponent = (viewMode) =>
		SETUP_LIST.find(({ type }) => type === viewMode)?.name;

	return (
		<Box p={{ base: "1em", md: "2em" }}>
			<Text fontWeight="bold" mb={"1em"}>
				Set up
			</Text>
			<Box
				p="1em"
				bg={"brand.primary_bg"}
				border="2px solid var(--main_color)"
				borderRadius="10px"
				color={"brand.nav_color"}
			>
				<Box mb={4} bg={"var(--main_color)"} borderRadius={"1em"} px="5px">
					<ButtonGroup variant="solid" p={0} m={0}>
						{SETUP_LIST.map(({ type, id }) => (
							<Button
								key={id}
								size={"lg"}
								onClick={() => setViewMode(type)}
								color={viewMode === type ? "brand.100" : "brand.nav_color"}
								bg={
									viewMode === type
										? "var(--primary_button_bg)"
										: "var(--main_color)"
								}
								borderRadius={"1em"}
								variant={"solid"}
								fontWeight={viewMode === type ? "bold" : "normal"}
								_hover={{ bg: "transparent", color: "brand.600" }}
							>
								{type}
							</Button>
						))}
					</ButtonGroup>
				</Box>
				{showComponent(viewMode)}
			</Box>
		</Box>
	);
};

export default Setup;
