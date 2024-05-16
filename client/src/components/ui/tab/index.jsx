import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

const TabGroup = ({ currentTab, handleTabChange, data }) => {
	return (
		<Tabs
			isFitted
			variant="enclosed"
			index={currentTab}
			onChange={handleTabChange}
		>
			<TabList>
				{data.map((tab, index) => (
					<Tab
						key={tab.name}
						bg={currentTab === index ? "brand.primary_button_bg" : undefined}
						color={currentTab === index ? "brand.100" : undefined}
					>
						{tab.name}
					</Tab>
				))}
			</TabList>
			<TabPanels>
				{data.map((tab) => (
					<TabPanel key={tab.name}>{tab.component}</TabPanel>
				))}
			</TabPanels>
		</Tabs>
	);
};

export default TabGroup;
