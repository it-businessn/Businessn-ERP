import { Box, Button, Text } from "@chakra-ui/react";
import { useState } from "react";
import ProjectTable from "./ProjectTable";
import TaskTable from "./TaskTable";

const WorkView = () => {
	const [viewMode, setViewMode] = useState("Task");

	const switchToView = (name) => setViewMode(name);
	return (
		<Box p={{ base: "1em", md: "2em" }} overflow={"hidden"}>
			<Text fontWeight="bold" mb={"0.5em"}>
				WorkView
			</Text>
			<Box mb={4}>
				{["Task", "Project", "Activity"].map((name) => (
					<Button
						onClick={() => switchToView(name)}
						color={viewMode === name ? "brand.100" : "brand.nav_color"}
						bg={viewMode === name ? "brand.primary_button_bg" : "#dbe0ec"}
						borderRadius={"1em"}
						size={"sm"}
						fontWeight={viewMode === name ? "bold" : "normal"}
						_hover={{ bg: "#dbe0ec", color: "brand.600" }}
						ml={2}
					>
						{name} View
					</Button>
				))}
			</Box>
			{viewMode === "Task" && <TaskTable />}
			{viewMode === "Project" && <ProjectTable />}
			{viewMode === "Activity" && <TaskTable filter />}
		</Box>
	);
};

export default WorkView;
