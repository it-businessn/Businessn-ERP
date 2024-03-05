import {
	Avatar,
	Badge,
	Box,
	Card,
	HStack,
	Progress,
	Text,
} from "@chakra-ui/react";
import { projectsData } from "data";

const ProjectDashboard = () => {
	const totalTasks = projectsData.reduce(
		(total, project) => total + project.tasksLeft,
		0,
	);

	return (
		<Box p={{ base: "1em", md: "2em" }} overflow={"hidden"}>
			<Text fontWeight="bold" mb={"0.5em"}>
				Project Dashboard
			</Text>
			<Box>
				{projectsData.map((project) => (
					<Card
						key={project.id}
						mb={4}
						borderRadius="md"
						boxShadow="md"
						p={4}
						color={"brand.nav_color"}
					>
						<HStack spacing={5} w={"100%"} justify={"space-between"}>
							<HStack spacing={3}>
								<Text fontWeight="bold">{project.name}</Text>
								<Badge bg="#e3c9c9" borderRadius={"40%"}>
									{project.tasksLeft}
								</Badge>
							</HStack>
							<HStack direction="row" spacing={2}>
								{project.assignees.map((assignee) => (
									<Avatar
										key={assignee.id}
										name={assignee.name}
										src={assignee.avatarUrl}
									/>
								))}
							</HStack>
							<Box
								bg="#d8e1ff"
								w="50%"
								p={2}
								borderRadius="md"
								boxShadow="md"
								overflow="hidden"
							>
								<Progress
									colorScheme="blue"
									bg={"#d8e1ff"}
									value={((project.tasksLeft / totalTasks) * 100).toFixed(2)}
								/>
								<Text textAlign="center" color="black" fontWeight="bold">
									{`${((project.tasksLeft / totalTasks) * 100).toFixed(
										2,
									)}% Complete`}
								</Text>
							</Box>
						</HStack>
					</Card>
				))}
			</Box>
		</Box>
	);
};

export default ProjectDashboard;
