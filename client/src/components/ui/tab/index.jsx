import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

const TabGroup = ({
	currentTab,
	handleTabChange,
	data,
	isCompanyPanel,
	colorScheme,
}) => {
	return (
		<Tabs
			isFitted={!isCompanyPanel}
			variant={isCompanyPanel ? "soft-rounded" : "enclosed"}
			index={currentTab}
			onChange={handleTabChange}
			colorScheme={colorScheme}
			size={isCompanyPanel && "sm"}
		>
			<TabList>
				{data.map((tab, index) => (
					<Tab
						key={index}
						bg={currentTab === index ? "brand.primary_button_bg" : undefined}
						color={currentTab === index ? "brand.100" : undefined}
					>
						{isCompanyPanel ? tab.type : tab.name}
					</Tab>
				))}
			</TabList>
			<TabPanels>
				{data.map((tab) => (
					<>
						{isCompanyPanel ? (
							<TabPanel key={tab.id}>
								{currentTab === tab.id && tab.name}
							</TabPanel>
						) : (
							<TabPanel key={tab.name}>{tab.component}</TabPanel>
						)}
					</>
				))}
			</TabPanels>
		</Tabs>
	);
};

export default TabGroup;
