import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

const TabGroup = ({ currentTab, handleTabChange, data, isCompanyPanel, colorScheme, id }) => {
	return (
		<Tabs
			isFitted={!isCompanyPanel}
			variant={isCompanyPanel ? "soft-rounded" : "enclosed"}
			index={currentTab}
			onChange={handleTabChange}
			colorScheme={colorScheme}
			size={isCompanyPanel && "sm"}
			isLazy
			lazyBehavior="unmount"
		>
			<TabList>
				{data.map((tab, index) => (
					<Tab
						key={tab[id] || index}
						bg={currentTab === index ? "var(--primary_button_bg)" : undefined}
						color={currentTab === index ? "var(--main_color)" : undefined}
					>
						{isCompanyPanel ? tab.type : tab.name}
					</Tab>
				))}
			</TabList>
			<TabPanels>
				{data.map((tab) =>
					isCompanyPanel ? (
						<TabPanel key={tab.id}>{currentTab === tab.id && tab.name}</TabPanel>
					) : (
						<TabPanel p={0} key={tab.name}>
							{tab.component}
						</TabPanel>
					),
				)}
			</TabPanels>
		</Tabs>
	);
};

export default TabGroup;
