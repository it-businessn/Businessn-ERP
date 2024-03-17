import { Box, Text } from "@chakra-ui/react";
import ProjectTable from "../workview/project/ProjectTable";

const ProjectDashboard = () => {
	return (
		<Box p={{ base: "1em", md: "2em" }} mt={{ base: "3em", md: 0 }}>
			<Text fontWeight="bold" mb={"0.5em"}>
				Project Dashboard
			</Text>
			<ProjectTable />
		</Box>
	);
};

export default ProjectDashboard;
