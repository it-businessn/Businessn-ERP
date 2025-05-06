import { HStack, SimpleGrid } from "@chakra-ui/react";
import RadioButtonGroup from "components/ui/tab/RadioButtonGroup";
import { useState } from "react";
import MasterUserInfo from "../../../hr/MasterUserInfo";
import MasterUserModules from "../../../hr/MasterUserModules";

const AddUser = ({ handleClose, company }) => {
	const handleNext = (id) => setViewMode(SETUP_LIST[id]?.type);
	const SETUP_LIST = [
		{
			id: 0,
			type: "Personal Info",
			name: <MasterUserInfo company={company} handleNext={handleNext} />,
		},
		{
			id: 1,
			type: "Module Access",
			name: <MasterUserModules company={company} handleClose={handleClose} />,
		},
	];
	const [tabs, setTabs] = useState(SETUP_LIST);
	const tabContent = SETUP_LIST[0]?.type;
	const [viewMode, setViewMode] = useState(tabContent);

	const currentTab = tabs.find(({ type }) => type === viewMode)?.id;

	const showComponent = (viewMode) => tabs.find(({ type }) => type === viewMode)?.name;

	return (
		<>
			<HStack spacing="1em" justifyContent={"space-between"} w={"100%"}>
				<SimpleGrid
					columns={{ base: 4, lg: 6 }}
					spacing="1em"
					my="5"
					bg={"var(--primary_bg)"}
					borderRadius={"20px"}
					p={"8px"}
					w={"100%"}
				>
					{tabs?.map((_) => (
						<RadioButtonGroup
							key={_?.id}
							name={_?.type}
							selectedFilter={viewMode}
							handleFilterClick={(name) => setViewMode(name)}
							fontSize={"1em"}
						/>
					))}
				</SimpleGrid>
			</HStack>
			{showComponent(viewMode)}
		</>
	);
};

export default AddUser;
