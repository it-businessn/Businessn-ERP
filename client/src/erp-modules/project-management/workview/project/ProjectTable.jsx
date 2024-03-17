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
	Th,
	Thead,
	Tr,
	useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa";
import {
	CircularFillProgress,
	TaskButton,
	calculateProjectCompletion,
	formatDate,
	renderPriorityBars,
} from "utils";
import { headerCell, statusColor } from "..";
import EditProject from "../EditProject";
import { workView_Table } from "../data";
import AddProject from "./AddProject";
import ProjectChild from "./ProjectChild";

const ProjectTable = ({ data, setRefresh }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [projects, setProjects] = useState([]);

	const [openEditTask, setOpenEditTask] = useState(false);
	const [task, setTask] = useState(null);
	const [openEditProject, setOpenEditProject] = useState(false);
	const [project, setProject] = useState(null);
	const [projectId, setProjectId] = useState(null);
	const [expandedIndex, setExpandedIndex] = useState(null);

	useEffect(() => {
		setProjects(data);
	}, [data]);

	const handleAddProject = () => {
		// setOpenEditProject(false);
		// setProject(null);
		// setProjectId(null);
		onOpen();
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

			<AddProject isOpen={isOpen} onClose={onClose} setRefresh={setRefresh} />

			<Table color={"brand.nav_color"} bg={"brand.primary_bg"}>
				<Thead>
					<Tr>{workView_Table.projects_cols.map((col) => headerCell(col))}</Tr>
				</Thead>
				<Tbody>
					{projects?.map((project, index) => (
						<React.Fragment key={project._id}>
							<Tr key={project._id}>
								<Td p={"0.5em"} fontSize={"xs"}>
									<HStack spacing={2}>
										<CircularFillProgress
											completionPercentage={calculateProjectCompletion(project)}
										/>
										<Text>{project?.name}</Text>
										<HStack
											spacing={0}
											onClick={() => handleToggle(index)}
											cursor={
												project?.tasks?.length > 0 ? "pointer" : "default"
											}
										>
											<TaskButton totalTasks={project?.tasks?.length} />

											<IconButton
												variant="ghost"
												icon={<FaChevronDown />}
												color="brand.nav_color"
												aria-label="Calendar Icon"
											/>
										</HStack>
									</HStack>
								</Td>
								<Td fontSize={"xs"} p={"0.5em"}>
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
								<Td fontSize={"xs"} pl={"1em"}>
									<HStack spacing="1">{renderPriorityBars(2)}</HStack>
								</Td>
								<Td fontSize={"xs"} pl={"1em"}>
									{formatDate(project.updatedOn)}
								</Td>
								<Td fontSize={"xs"} pl={"1em"}>
									{formatDate(project.dueDate)}
								</Td>
								<Td fontSize={"12px"}>
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
								<Td fontSize={"12px"} pl={0}>
									<Button
										colorScheme="green"
										size="xs"
										onClick={() => handleEditProject(project, project._id)}
										leftIcon={<CiEdit />}
									>
										Edit
									</Button>
								</Td>
							</Tr>
							<Tr>
								<Td colSpan="9" p={0} fontSize={"xs"}>
									<Collapse in={expandedIndex === index}>
										<Table
											color={"brand.nav_color"}
											bg={"brand.primary_bg"}
											size={"small"}
										>
											<Thead visibility={"hidden"}>
												<Tr>
													<Th />
													{workView_Table.task_cols.map((col) =>
														headerCell(col, "normal"),
													)}
												</Tr>
											</Thead>
											<Tbody>
												{project?.tasks?.map((task, index) => {
													return (
														<ProjectChild
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
			{/* {openEditTask && (
				<AddNewProjectTask
					setRefresh={setRefresh}
					isOpen={openEditTask}
					projectId={projectId}
					onClose={() => setOpenEditTask(false)}
					task={task}
				/>
			)}*/}
			{openEditProject && (
				<EditProject
					isOpen={openEditProject}
					onClose={() => setOpenEditProject(false)}
					project={project}
					projectId={projectId}
					setRefresh={setRefresh}
				/>
			)}
		</>
	);
};

export default ProjectTable;
