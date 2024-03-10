import {
	Avatar,
	Badge,
	Box,
	Card,
	HStack,
	Progress,
	Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ProjectService from "services/ProjectService";

const ProjectTable = () => {
	const [projects, setProjects] = useState([]);
	useEffect(() => {
		const fetchAllProjectInfo = async () => {
			try {
				const response = await ProjectService.getAllProjects();
				setProjects(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllProjectInfo();
	}, []);
	const getPercentComplete = (project) => {
		return project.todoItems.length === 0
			? 100
			: ((project.todoItems.length / totalTasks) * 100).toFixed(2);
	};
	const totalTasks = projects.reduce(
		(total, project) => total + project.todoItems.length,
		0,
	);

	return (
		<Box>
			{projects.map((project) => (
				<Card
					key={project._id}
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
								{project.projectName}
							</Text>
							<Badge bg="#e3c9c9" borderRadius={"40%"}>
								{project.todoItems.length}
							</Badge>
						</HStack>
						<HStack direction="row" spacing={{ base: 1, md: 2 }}>
							{project.selectedAssignees.map((assignee) => (
								<Avatar
									key={assignee.name}
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
								value={getPercentComplete}
							/>
							<Text
								textAlign="center"
								fontSize={{ base: "xs", md: "md" }}
								color="var(--main_color_black)"
								fontWeight="bold"
							>
								{project.todoItems.length === 0
									? 100
									: getPercentComplete(project)}
								% Complete
							</Text>
						</Box>
					</HStack>
				</Card>
			))}
		</Box>
	);
};

export default ProjectTable;
