import { Box, Text } from "@chakra-ui/react";
import ProjectTable from "../workview/ProjectTable";

const ProjectDashboard = () => {
	return (
		<Box p={{ base: "1em", md: "2em" }} overflow={"hidden"}>
			<Text fontWeight="bold" mb={"0.5em"}>
				Project Dashboard
			</Text>
			<ProjectTable />
		</Box>
	);
};

export default ProjectDashboard;
