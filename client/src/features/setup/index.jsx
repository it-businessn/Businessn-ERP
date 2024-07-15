import { Box } from "@chakra-ui/react";
import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";
import TextTitle from "components/ui/text/TextTitle";
import useCompany from "hooks/useCompany";
import { useEffect, useState } from "react";
import UserService from "services/UserService";
import CompanyPanel from "./company/CompanyPanel";
import PermissionsPanel from "./permisssions/PermissionsPanel";
import UsersPanel from "./users/UsersPanel";

const Setup = () => {
	const [employees, setEmployees] = useState(null);
	const [filteredEmployees, setFilteredEmployees] = useState(null);
	const [isRefresh, setIsRefresh] = useState(false);

	const { company } = useCompany();
	useEffect(() => {
		const fetchAllEmployees = async () => {
			try {
				const response = await UserService.getAllCompanyUsers(company);
				setEmployees(response.data);
				setFilteredEmployees(response.data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchAllEmployees();
	}, [isRefresh, company]);

	const SETUP_LIST = [
		{
			id: 0,
			type: "Users",
			name: (
				<UsersPanel
					isUser
					employees={employees}
					setFilteredEmployees={setFilteredEmployees}
					filteredEmployees={filteredEmployees}
					setIsRefresh={setIsRefresh}
					company={company}
				/>
			),
		},
		{
			id: 1,
			type: "Company",
			name: (
				<CompanyPanel
					employees={employees}
					company={company}
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
					company={company}
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
			<TextTitle title="Set up" mb={"1em"} />

			<Box
				p="1em"
				bg={"var(--primary_bg)"}
				border="2px solid var(--main_color)"
				borderRadius="10px"
				color={"var(--nav_color)"}
			>
				<Box mb={4} bg={"var(--main_color)"} borderRadius={"1em"} px="5px">
					<TabsButtonGroup
						tabs={SETUP_LIST}
						setViewMode={setViewMode}
						viewMode={viewMode}
					/>
				</Box>
				{showComponent(viewMode)}
			</Box>
		</Box>
	);
};

export default Setup;
