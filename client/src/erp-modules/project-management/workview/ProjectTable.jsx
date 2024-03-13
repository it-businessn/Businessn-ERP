import {
	Avatar,
	Button,
	Checkbox,
	Collapse,
	Flex,
	HStack,
	Spacer,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	UnorderedList,
	VStack,
	useDisclosure,
} from "@chakra-ui/react";
import Caption from "erp-modules/sales/lead docket/Caption";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import ProjectService from "services/ProjectService";
import {
	CircularFillProgress,
	CircularProgressBarCell,
	TaskButton,
	formatDate,
	renderPriorityBars,
} from "utils";
import { headerCell, statusColor } from ".";
import AddNewProjectTask from "./AddNewProjectTask";
import AddProject from "./AddProject";
import EditProject from "./EditProject";
import Subtask from "./Subtask";
import TodoItem from "./TodoItem";
import { workView_Table } from "./data";

const ProjectTable = ({ data }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [openEditTask, setOpenEditTask] = useState(false);
	const [task, setTask] = useState(null);
	const [openEditProject, setOpenEditProject] = useState(false);
	const [project, setProject] = useState(null);
	const [projectId, setProjectId] = useState(null);
	const [refresh, setRefresh] = useState(false);
	const [projects, setProjects] = useState([]);
	const [expandedIndex, setExpandedIndex] = useState(null);

	useEffect(() => {
		setProjects(data);
	}, [data]);

	useEffect(() => {
		const fetchAllProjects = async () => {
			try {
				const response = await ProjectService.getAllProjects();
				setProjects(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		if (refresh) {
			fetchAllProjects();
		}
	}, [refresh]);

	const handleEditTask = (task, projectId) => {
		setOpenEditTask(true);
		setTask(task);
		setProjectId(projectId);
	};

	const handleAddProject = () => {
		setOpenEditProject(false);
		setProject(null);
		setProjectId(null);
		onOpen();
	};

	const handleEditProject = (project, projectId) => {
		setOpenEditProject(true);
		setProject(project);
		setProjectId(projectId);
	};

	const Task = ({ task, projectId, taskIndex }) => {
		const [isExpanded, setExpanded] = useState(null);
		const handleToggle = () => {
			setExpanded((prev) => !prev);
		};
		return (
			<React.Fragment key={task._id}>
				<Tr key={task.taskName}>
					<Td p={0} pl={"3em"}>
						<Checkbox sx={{ verticalAlign: "middle" }} colorScheme="facebook" />
					</Td>
					<Td
						fontSize={"xs"}
						onClick={handleToggle}
						cursor={task?.todoItems?.length > 0 ? "pointer" : "default"}
					>
						<HStack spacing={3}>
							<CircularProgressBarCell completionPercentage={25} />
							<Text>{task.taskName}</Text>
							<TaskButton totalTasks={task?.subtasks?.length || 0} />
							<FaEdit onClick={() => handleEditTask(task, projectId)} />
						</HStack>
					</Td>
					<Td fontSize={"xs"}>
						<HStack>
							{task?.selectedAssignees?.map((assignee) => (
								<Avatar
									key={assignee.name}
									name={assignee.name}
									size={{ base: "xs", md: "sm" }}
									src={assignee.avatarUrl}
								/>
							))}
						</HStack>
					</Td>
					<Td fontSize={"xs"}>
						<HStack spacing="1">{renderPriorityBars(2)}</HStack>
					</Td>
					<Td fontSize={"xs"}>
						{task?.updatedOn && formatDate(task?.updatedOn)}
					</Td>
					<Td fontSize={"xs"}>{task?.dueDate && formatDate(task?.dueDate)}</Td>
					<Td p={"1em"} fontSize={"12px"}>
						<HStack
							justifyContent={"space-around"}
							spacing={0}
							fontWeight={"bold"}
							color={statusColor(task.status).color}
							bgColor={statusColor(task.status).bg}
							p={"5px"}
							borderRadius={"8px"}
						>
							<Text> {task.status || 0}d over</Text>
						</HStack>
					</Td>
				</Tr>
				<Tr>
					<Td colSpan="3" p={0} fontSize={"xs"}>
						<Collapse in={isExpanded}>
							<VStack align="start" spacing={2} ml={"10em"} p={0} my={2}>
								<UnorderedList listStyleType={"none"}>
									<Caption title={"Sub tasks"} />
									{task?.subtasks?.map((subtask) => (
										<Subtask key={subtask.taskName} task={subtask} />
									))}
								</UnorderedList>
								<UnorderedList listStyleType={"none"}>
									<Caption title={"Todos"} />
									{task?.action?.map((action, i) => (
										<TodoItem key={action.taskName} task={action} />
									))}
								</UnorderedList>
							</VStack>
						</Collapse>
					</Td>
				</Tr>
			</React.Fragment>
		);
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

			<AddProject isOpen={isOpen} onClose={onClose} setRefresh={setRefresh} />

			<Table color={"brand.nav_color"} bg={"brand.primary_bg"} size={"small"}>
				<Thead>
					<Tr>{workView_Table.projects_cols.map((col) => headerCell(col))}</Tr>
				</Thead>
				<Tbody>
					{projects?.map((project, index) => (
						<React.Fragment key={project._id}>
							<Tr key={project._id}>
								<Td
									p={"0.5em 1em"}
									fontSize={"xs"}
									cursor={project?.tasks?.length > 0 ? "pointer" : "default"}
								>
									<HStack spacing={3}>
										<CircularFillProgress completionPercentage={20} />
										<HStack spacing={3} onClick={() => handleToggle(index)}>
											<Text>{project?.projectName}</Text>
											<TaskButton totalTasks={project?.tasks?.length} />
										</HStack>
										<FaEdit
											onClick={() => handleEditProject(project, project._id)}
										/>
									</HStack>
								</Td>
								<Td fontSize={"xs"} />
								<Td fontSize={"xs"}>
									<HStack spacing="1">{renderPriorityBars(2)}</HStack>
								</Td>
								<Td fontSize={"xs"}>{formatDate(project.date)}</Td>
								<Td fontSize={"xs"}>{formatDate(project.date)}</Td>
								<Td fontSize={"12px"} p={"0.5em 1em"}>
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
								<Td colSpan="6" p={0} fontSize={"xs"}>
									<Collapse in={expandedIndex === index}>
										<Table
											color={"brand.nav_color"}
											bg={"brand.primary_bg"}
											size={"small"}
										>
											<Thead>
												<Tr>
													<Th />
													{workView_Table.task_cols.map((col) =>
														headerCell(col, "normal"),
													)}
												</Tr>
											</Thead>
											<Tbody>
												{project?.tasks?.map((task, index) => {
													task.taskStatus = "Completed";
													return (
														<Task
															key={index}
															task={task}
															taskIndex={index}
															projectId={project._id}
														/>
													);
												})}
											</Tbody>
										</Table>
									</Collapse>
								</Td>
							</Tr>
						</React.Fragment>
					))}
				</Tbody>
			</Table>
			{openEditTask && (
				<AddNewProjectTask
					setRefresh={setRefresh}
					isOpen={openEditTask}
					projectId={projectId}
					onClose={() => setOpenEditTask(false)}
					task={task}
				/>
			)}
			{openEditProject && (
				<EditProject
					setRefresh={setRefresh}
					isOpen={openEditProject}
					projectId={projectId}
					onClose={() => setOpenEditProject(false)}
					project={project}
				/>
			)}
		</>
	);
};

export default ProjectTable;
