import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useState } from "react";
import CompanyDetails from "./CompanyDetails";
import GroupsPanel from "./GroupsPanel";
import ModulePanel from "./ModulePanel";
import Naming from "./Naming";

const CompanyPanel = ({
	employees,
	setFilteredEmployees,
	filteredEmployees,
}) => {
	const COMPANY_SETUP_TAB = [
		{ id: 0, type: "Modules", name: <ModulePanel /> },
		{
			id: 1,
			type: "Groups",
			name: (
				<GroupsPanel
					employees={employees}
					setFilteredEmployees={setFilteredEmployees}
					filteredEmployees={filteredEmployees}
				/>
			),
		},
		{ id: 2, type: "Naming", name: <Naming /> },
		{ id: 3, type: "Company Info", name: <CompanyDetails /> },
	];
	const [currentTab, setCurrentTab] = useState(0);

	const handleTabChange = (index) => {
		setCurrentTab(index);
	};
	return (
		<Tabs
			variant="soft-rounded"
			colorScheme="blue"
			index={currentTab}
			onChange={handleTabChange}
		>
			<TabList>
				{COMPANY_SETUP_TAB.map((item) => (
					<Tab key={item.type}>{item.type}</Tab>
				))}
			</TabList>

			<TabPanels>
				{COMPANY_SETUP_TAB.map((item) => (
					<TabPanel key={item.id}>
						{currentTab === item.id && item.name}
					</TabPanel>
				))}
			</TabPanels>
		</Tabs>
	);
};

export default CompanyPanel;
