import {
	Avatar,
	Box,
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
import { FaSort } from "react-icons/fa";
import {
	CircularProgressBarCell,
	TaskButton,
	formatDate,
	renderPriorityBars,
} from "utils";
import { statusColor } from ".";
import AddNewTask from "./AddNewTask";
import Subtask from "./Subtask";
import TodoItem from "./TodoItem";
import { workView_Table } from "./data";

const TaskTable = ({ data, isFiltered }) => {
	// const [filters, setFilters] = useState({
	// 	taskName: "",
	// 	assignee: "",
	// 	projectName: "",
	// 	status: "",
	// });
	// const handleFilterChange = (event, columnName) => {
	// 	console.log(`Filtering ${columnName} by ${event.target.value}`);
	// };
	// useEffect(() => {
	// 	if (filter) {
	// 		setTasks(tasksData.filter((task) => task.checklist));
	// 	}
	// }, [filter]);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [expandedIndex, setExpandedIndex] = useState(null);
	const [refresh, setRefresh] = useState(false);

	const handleToggle = (index) => {
		setExpandedIndex(expandedIndex === index ? -1 : index);
	};

	const headerCell = (key) => (
		<Th fontWeight={"bolder"} key={key} fontSize={"xs"}>
			<Flex alignItems={"center"} gap={0.5}>
				{key}
				<FaSort sx={{ width: "5px" }} />
			</Flex>
		</Th>
	);
	const allProjects = data.map((project) => ({
		projectName: project.projectName,
		id: project._id,
	}));

	const allTasks = data?.flatMap(
		(project) =>
			project?.tasks?.map((task) => ({
				...task,
				projectName: project.projectName,
			})) || [],
	);
	const allProjectTasks = allTasks.map((task) => ({
		taskName: task.taskName,
		id: task._id,
	}));

	const allActivities = allTasks?.filter((task) => task?.action?.length > 0);
	const [filteredData, setFilteredData] = useState(data);

	useEffect(() => {
		if (isFiltered) {
			setFilteredData(allActivities);
		} else {
			setFilteredData(allTasks);
		}
	}, [isFiltered]);

	const handleAddTask = () => {
		// setOpenEditTask(false);
		// setProject(null);
		// setProjectId(null);
		onOpen();
	};

	return (
		<>
			<Flex>
				<Text fontWeight="bold">{isFiltered ? "Activities" : "Tasks"}</Text>
				<Spacer />
				<Button
					onClick={handleAddTask}
					color={"brand.100"}
					bg={"brand.primary_button_bg"}
					borderRadius={"8px"}
					size={"sm"}
					px={"2em"}
				>
					Add new {isFiltered ? "activity" : "task"}
				</Button>
			</Flex>
			<AddNewTask
				isOpen={isOpen}
				isFiltered={isFiltered}
				onClose={onClose}
				setRefresh={setRefresh}
				allProjects={allProjects}
				allProjectTasks={allProjectTasks}
			/>
			<Box overflow="auto">
				<Table color={"brand.nav_color"} bg={"brand.primary_bg"} size={"small"}>
					<Thead>
						<Tr>
							<Th>{/* <Checkbox sx={{ verticalAlign: "middle" }} /> */}</Th>
							{workView_Table.task_view_cols.map((col) => headerCell(col))}
						</Tr>
					</Thead>
					<Tbody>
						{filteredData?.map((task, index) => {
							return (
								<React.Fragment key={task._id}>
									<Tr key={task.taskName}>
										<Td>
											<Checkbox
												colorScheme="facebook"
												sx={{ verticalAlign: "middle" }}
												// isChecked={checkedRows.includes(item.id)}
												// onChange={() => handleCheckboxChange(item.id)}
											/>
										</Td>
										<Td
											fontSize={"xs"}
											onClick={() => handleToggle(index)}
											cursor={
												task?.subtasks?.length > 0 ? "pointer" : "default"
											}
										>
											<HStack spacing={3}>
												<CircularProgressBarCell completionPercentage={25} />
												<Text>{task.taskName}</Text>
												<TaskButton totalTasks={task?.subtasks?.length} />
											</HStack>
										</Td>
										<Td fontSize={"xs"}>
											<HStack>
												{task?.selectedAssignees?.map((assignee) => (
													<Avatar
														key={assignee}
														name={assignee}
														size={{ base: "xs", md: "sm" }}
														src={assignee}
													/>
												))}
											</HStack>
										</Td>
										<Td fontSize={"xs"}>
											<HStack spacing="1">{renderPriorityBars(2)}</HStack>
										</Td>
										<Td fontSize={"xs"}>{task.projectName}</Td>
										<Td fontSize={"xs"}>
											{task?.updatedOn && formatDate(task.updatedOn)}
										</Td>
										<Td fontSize={"xs"}>
											{task.dueDate && formatDate(task.dueDate)}
										</Td>
										<Td fontSize={"12px"}>
											<HStack
												justifyContent={"space-around"}
												spacing={0}
												fontWeight={"bold"}
												p={"5px"}
												borderRadius={"8px"}
												color={statusColor(task.status).color}
												bgColor={statusColor(task.status).bg}
											>
												<Text> {task?.status}d over</Text>
											</HStack>
										</Td>
									</Tr>
									<Tr>
										<Td colSpan="3" p={0} fontSize={"xs"}>
											<Collapse in={expandedIndex === index}>
												<VStack
													align="start"
													spacing={2}
													ml={"3em"}
													p={0}
													my={2}
												>
													{!isFiltered && (
														<UnorderedList listStyleType={"none"}>
															<Caption title={"Sub tasks"} />
															{task?.subtasks?.map((subtask) => (
																<Subtask
																	key={subtask.taskName}
																	task={subtask}
																/>
															))}
														</UnorderedList>
													)}
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
						})}
					</Tbody>
				</Table>
			</Box>
		</>
	);
};

export default TaskTable;
