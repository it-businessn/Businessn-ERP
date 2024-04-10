import { Box, Button, ButtonGroup } from "@chakra-ui/react";
import { useState } from "react";
import CalendarTable from "./CalendarTable";
import TaskTable from "./TaskTable";

const UpcomingList = ({ user }) => {
	const TABS = [
		{ type: "Tasks", name: <TaskTable user={user} />, cols: ["Name"] },
		{ type: "Events", name: <CalendarTable />, cols: ["Name"] },
		{ type: "Meetings", name: <CalendarTable />, cols: ["Name"] },
		{ type: "Appointments", name: <CalendarTable />, cols: ["Name"] },
	];
	const [viewMode, setViewMode] = useState(TABS[0].type);
	const showComponent = (viewMode) =>
		TABS.find(({ type }) => type === viewMode)?.name;

	return (
		<Box>
			<Box mb={4} bg={"var(--main_color)"} borderRadius={"1em"} px="5px">
				<ButtonGroup variant="solid" p={0} m={0}>
					{TABS?.map(({ type }) => (
						<Button
							key={type}
							size={"sm"}
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
	);
};

export default UpcomingList;
