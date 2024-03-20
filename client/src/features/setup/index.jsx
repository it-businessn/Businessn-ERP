import {
	Box,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useBreakpointValue } from "services/Breakpoint";
import ApproversPanel from "./ApproversPanel";
import DepartmentsPanel from "./DepartmentsPanel";
import ManagersPanel from "./ManagersPanel";
import RolesPanel from "./RolesPanel";
import { SETUP_LIST } from "./data";

const Setup = () => {
	const { isMobile } = useBreakpointValue();
	const [currentTab, setCurrentTab] = useState(0);

	const handleTabChange = (index) => {
		setCurrentTab(index);
	};
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
				<Tabs
					variant="soft-rounded"
					colorScheme="blue"
					index={currentTab}
					onChange={handleTabChange}
				>
					<TabList>
						{SETUP_LIST.map((item) => (
							<Tab key={item.type}>Set Up {item.type}</Tab>
						))}
					</TabList>

					<TabPanels>
						<TabPanel>{currentTab === 0 && <ManagersPanel />}</TabPanel>
						<TabPanel>{currentTab === 1 && <RolesPanel />}</TabPanel>
						<TabPanel>{currentTab === 2 && <DepartmentsPanel />}</TabPanel>
						<TabPanel>{currentTab === 3 && <ApproversPanel />}</TabPanel>
					</TabPanels>
				</Tabs>
			</Box>
		</Box>
	);
};

export default Setup;
