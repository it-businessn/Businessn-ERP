import TabGroup from "components/ui/tab";
import { useState } from "react";
import CompanyDetails from "./CompanyDetails";
import GroupsPanel from "./GroupsPanel";
import ModulePanel from "./ModulePanel";
import Naming from "./Naming";

const CompanyPanel = ({
	employees,
	setFilteredEmployees,
	filteredEmployees,
	company,
}) => {
	const COMPANY_SETUP_TAB = [
		{ id: 0, type: "Modules", name: <ModulePanel company={company} /> },
		{
			id: 1,
			type: "Groups",
			name: (
				<GroupsPanel
					employees={employees}
					company={company}
					setFilteredEmployees={setFilteredEmployees}
					filteredEmployees={filteredEmployees}
				/>
			),
		},
		{ id: 2, type: "Naming", name: <Naming /> },
		{ id: 3, type: "Company Info", name: <CompanyDetails company={company} /> },
	];
	const [currentTab, setCurrentTab] = useState(0);

	const handleTabChange = (index) => {
		setCurrentTab(index);
	};
	return (
		<TabGroup
			currentTab={currentTab}
			handleTabChange={handleTabChange}
			data={COMPANY_SETUP_TAB}
			isCompanyPanel
			colorScheme="facebook"
		/>
	);
};

export default CompanyPanel;
