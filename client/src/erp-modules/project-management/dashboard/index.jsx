import { Box, Text } from "@chakra-ui/react";
import FilesList from "../workview/files";

const ProjectDashboard = () => {
	return (
		<Box p={{ base: "1em", md: "2em" }} mt={{ base: "3em", md: 0 }}>
			<Text fontWeight="bold" mb={"0.5em"}>
				Project Dashboard
			</Text>
			<FilesList />
		</Box>
	);
};

export default ProjectDashboard;
