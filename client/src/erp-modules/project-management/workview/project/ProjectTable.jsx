import { SettingsIcon } from "@chakra-ui/icons";
import {
	Avatar,
	Button,
	Collapse,
	Flex,
	HStack,
	IconButton,
	Spacer,
	Table,
	Tbody,
	Td,
	Text,
	Thead,
	Tr,
	useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
	AddTaskButton,
	CircularFillProgress,
	TaskButton,
	calculateProjectCompletion,
	formatDate,
	renderPriorityBars,
} from "utils";
import { headerCell, statusColor } from "..";
import AddNewProjectTask from "./AddNewProjectTask";
import AddProject from "./AddProject";
import EditProject from "./EditProject";
import ProjectChild from "./ProjectChild";
import { workView_Table } from "./data";

const ProjectTable = ({ data, setRefresh, managers }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [projects, setProjects] = useState([]);

	const [openEditTask, setOpenEditTask] = useState(false);
	const [task, setTask] = useState(null);
	const [openEditProject, setOpenEditProject] = useState(false);
	const [openAddTask, setOpenAddTask] = useState(false);
	const [project, setProject] = useState(null);
	const [projectId, setProjectId] = useState(null);
	const [expandedIndex, setExpandedIndex] = useState(null);
	const [assignees, setAssignees] = useState(null);

	useEffect(() => {
		setProjects(data);
	}, [data]);

	const handleAddProject = () => {
		onOpen();
	};

	const handleAddTask = (project, projectId) => {
		setOpenAddTask(true);
		setProject(project);
		setProjectId(projectId);
	};

	const handleEditProject = (project, projectId) => {
		setOpenEditProject(true);
		setProject(project);
		setProjectId(projectId);
	};

	const handleToggle = (index) => {
		setExpandedIndex(expandedIndex === index ? null : index);
	};
	return (
		<>
			<Flex>
				<Text fontWeight="bold">Projects</Text>
				<Spacer />
				<Button
					onClick={handleAddProject}
					color={"brand.100"}
					bg={"brand.primary_button_bg"}
					borderRadius={"8px"}
					size={"sm"}
					px={"2em"}
				>
					Add new project
				</Button>
			</Flex>

			<AddProject
				managers={managers}
				isOpen={isOpen}
				onClose={onClose}
				setRefresh={setRefresh}
			/>

			<Table color={"brand.nav_color"} bg={"brand.primary_bg"}>
				<Thead>
					<Tr>{workView_Table.projects_cols.map((col) => headerCell(col))}</Tr>
				</Thead>
				<Tbody>
					{projects?.map((project, index) => (
						<React.Fragment key={project._id}>
							<Tr key={project._id}>
								<Td p={"0.5em"} fontSize={"xs"} w={"350px"}>
									<HStack spacing={2}>
										<CircularFillProgress
											completionPercentage={calculateProjectCompletion(project)}
										/>
										<Text>{project?.name}</Text>
										<HStack
											spacing={0}
											cursor={
												project?.tasks?.length > 0 ? "pointer" : "default"
											}
										>
											{project?.tasks?.length > 0 && (
												<TaskButton totalTasks={project?.totalTasks} />
											)}
											<IconButton
												variant="ghost"
												icon={<SettingsIcon />}
												color="brand.nav_color"
												aria-label="Settings Icon"
												onClick={() => handleEditProject(project, project._id)}
											/>
											<AddTaskButton
												onClick={() => handleAddTask(project, project._id)}
											/>
											{project?.tasks?.length > 0 && (
												<IconButton
													onClick={() => handleToggle(index)}
													variant="ghost"
													icon={
														expandedIndex === index ? (
															<FaChevronUp />
														) : (
															<FaChevronDown />
														)
													}
													color="brand.nav_color"
													aria-label="Calendar Icon"
												/>
											)}
										</HStack>
									</HStack>
								</Td>
								<Td fontSize={"xs"} p={"0.5em"} w={"200px"}>
									<HStack>
										{project?.selectedAssignees?.map((assignee) => (
											<Avatar
												key={assignee}
												name={assignee}
												size={{ base: "xs", md: "sm" }}
												src={assignee}
											/>
										))}
									</HStack>
								</Td>
								<Td fontSize={"xs"} pl={"1em"} w={"100px"}>
									<HStack spacing="1">{renderPriorityBars(2)}</HStack>
								</Td>
								<Td fontSize={"xs"} pl={"1em"} w={"150px"}>
									{project.startDate && formatDate(project.startDate)}
								</Td>
								<Td fontSize={"xs"} pl={"1em"} w={"150px"}>
									{project.dueDate && formatDate(project.dueDate)}
								</Td>
								<Td fontSize={"xs"} pl={"1em"} w={"150px"}>
									{project.managerName}
								</Td>
								<Td fontSize={"xs"} pl={"1em"} w={"150px"}>
									{project.updatedOn && formatDate(project.updatedOn)}
								</Td>
								<Td fontSize={"12px"} w={"200px"}>
									<HStack
										justifyContent={"space-around"}
										spacing={0}
										fontWeight={"bold"}
										color={statusColor(project.status).color}
										bgColor={statusColor(project.status).bg}
										p={"5px"}
										borderRadius={"8px"}
									>
										<Text> {project.status || 0}d over</Text>
									</HStack>
								</Td>
							</Tr>
							<Tr>
								<Td colSpan="8" p={0} pl={"5em"} fontSize={"xs"}>
									<Collapse in={expandedIndex === index}>
										{project?.tasks?.map((task, index) => {
											return (
												<ProjectChild
													managerName={project.managerName}
													key={index}
													setRefresh={setRefresh}
													task={task}
													managers={managers}
													taskIndex={index}
													projectId={project._id}
												/>
											);
										})}
									</Collapse>
								</Td>
							</Tr>
						</React.Fragment>
					))}
				</Tbody>
			</Table>
			{openEditProject && (
				<EditProject
					isOpen={openEditProject}
					onClose={() => setOpenEditProject(false)}
					project={project}
					projectId={projectId}
					setRefresh={setRefresh}
					managers={managers}
				/>
			)}
			{openAddTask && (
				<AddNewProjectTask
					isOpen={openAddTask}
					onClose={() => setOpenAddTask(false)}
					project={project}
					projectId={projectId}
					setRefresh={setRefresh}
					managers={managers}
				/>
			)}
		</>
	);
};

export default ProjectTable;
