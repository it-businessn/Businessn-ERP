import { SmallAddIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Icon, Text, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ProjectService from "services/ProjectService";
import AddNewTask from "./AddNewTask";
import ProjectTable from "./ProjectTable";
import TaskTable from "./TaskTable";

const WorkView = () => {
	const [viewMode, setViewMode] = useState("Task");
	const { isOpen, onOpen, onClose } = useDisclosure();

	const switchToView = (name) => setViewMode(name);
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
	return (
		<Box p={{ base: "1em", md: "2em" }} overflow={"hidden"}>
			<Text fontWeight="bold" mb={"0.5em"}>
				Workview
			</Text>
			<Flex justifyContent={"space-between"}>
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
				<Button
					onClick={onOpen}
					leftIcon={<Icon as={SmallAddIcon} />}
					color={"brand.100"}
					bg={"brand.primary_button_bg"}
					borderRadius={"1em"}
					size={"sm"}
				>
					Add new task
				</Button>
			</Flex>

			<AddNewTask isOpen={isOpen} onClose={onClose} />

			{viewMode === "Task" && <TaskTable data={projects} />}
			{viewMode === "Project" && <ProjectTable data={projects} />}
			{viewMode === "Activity" && (
				<TaskTable
					data={projects.filter((task) => task.todoItems.length > 0)}
				/>
			)}
		</Box>
	);
};

export default WorkView;
