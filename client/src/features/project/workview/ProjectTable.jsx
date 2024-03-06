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
import { useEffect } from "react";
import ProjectService from "services/ProjectService";

const ProjectTable = () => {
	const totalTasks = projectsData.reduce(
		(total, project) => total + project.tasksLeft,
		0,
	);
	useEffect(() => {
		const fetchAllProjectInfo = async () => {
			try {
				const response = await ProjectService.getAllProjects();
				console.log(response);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllProjectInfo();
	}, []);
	return (
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
					<HStack
						spacing={{ base: 2, md: 5 }}
						w={"100%"}
						justify={"space-between"}
					>
						<HStack
							flexDir={{ base: "column", md: "row" }}
							spacing={{ base: 1, md: 5 }}
						>
							<Text fontWeight="bold" fontSize={{ base: "xs", md: "md" }}>
								{project.name}
							</Text>
							<Badge bg="#e3c9c9" borderRadius={"40%"}>
								{project.tasksLeft}
							</Badge>
						</HStack>
						<HStack direction="row" spacing={{ base: 1, md: 2 }}>
							{project.assignees.map((assignee) => (
								<Avatar
									key={assignee.id}
									name={assignee.name}
									size={{ base: "xs", md: "md" }}
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
							<Text
								textAlign="center"
								fontSize={{ base: "xs", md: "md" }}
								color="black"
								fontWeight="bold"
							>
								{`${((project.tasksLeft / totalTasks) * 100).toFixed(
									2,
								)}% Complete`}
							</Text>
						</Box>
					</HStack>
				</Card>
			))}
		</Box>
	);
};

export default ProjectTable;
