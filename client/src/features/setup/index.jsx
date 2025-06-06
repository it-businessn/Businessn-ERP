import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";
import useCompany from "hooks/useCompany";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import UserService from "services/UserService";
import CompanyPanel from "./company/CompanyPanel";
import PermissionsPanel from "./permisssions/PermissionsPanel";
import UsersPanel from "./users/UsersPanel";

const Setup = () => {
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const [employees, setEmployees] = useState(null);
	const [filteredEmployees, setFilteredEmployees] = useState(null);

	useEffect(() => {
		const fetchAllEmployees = async () => {
			try {
				const { data } = await UserService.getCompanyUsers(company);
				setEmployees(data);
				setFilteredEmployees(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllEmployees();
	}, [company]);

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
					// setIsRefresh={setIsRefresh}
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
	const showComponent = (viewMode) => SETUP_LIST.find(({ type }) => type === viewMode)?.name;

	return (
		<PageLayout title={"Set up"} showBgLayer>
			<TabsButtonGroup tabs={SETUP_LIST} setViewMode={setViewMode} viewMode={viewMode} />
			{showComponent(viewMode)}
		</PageLayout>
	);
};

export default Setup;
