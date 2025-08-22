import { SmallAddIcon } from "@chakra-ui/icons";
import {
	Avatar,
	Box,
	Button,
	Checkbox,
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
	UnorderedList,
	VStack,
	useDisclosure,
} from "@chakra-ui/react";
import { RenderPriorityBars } from "components/RenderPriorityBars";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import Caption from "erp-modules/sales/lead docket/Caption";
import React, { useEffect, useState } from "react";
import { FaChevronDown, FaSort } from "react-icons/fa";
import TaskService from "services/TaskService";
import { TaskButton, statusColor } from "utils";
import { formatDate } from "utils/convertDate";
import EditTask from "../EditTask";
import TodoItem from "../TodoItem";
import Subtask from "../project/Subtask";
import { workView_Table } from "../project/data";
import AddNewActivity from "./AddNewActivity";
import AddNewSubTask from "./AddNewSubTask";
import AddNewTask from "./AddNewTask";

const TaskTable = ({
	data,
	isFiltered,
	setRefresh,
	allProjects,
	allTasks,
	allProjectTasks,
	allActivities,
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [expandedIndex, setExpandedIndex] = useState(null);
	const [filteredData, setFilteredData] = useState(data);
	const [openEditTask, setOpenEditTask] = useState(false);
	const [openSubTask, setOpenSubTask] = useState(false);
	const [openActivity, setOpenActivity] = useState(false);
	const [task, setTask] = useState(false);

	const handleToggle = (index) => {
		setExpandedIndex(expandedIndex === index ? -1 : index);
	};
	useEffect(() => {
		setFilteredData(data);
	}, [data]);

	const headerCell = (key) => (
		<Th fontWeight={"bolder"} key={key} fontSize={"xs"}>
			<Flex alignItems={"center"} gap={0.5}>
				{key}
				<FaSort sx={{ width: "5px" }} />
			</Flex>
		</Th>
	);

	useEffect(() => {
		if (isFiltered) {
			setFilteredData(allActivities);
		} else {
			setFilteredData(allTasks);
		}
	}, [isFiltered]);

	const handleAddTask = () => {
		if (isFiltered) {
			setOpenActivity(true);
		} else {
			onOpen();
		}
	};

	const handleAddSubTask = (task) => {
		setOpenSubTask(true);
		setTask(task);
	};

	const handleEditTask = (task) => {
		setOpenEditTask(true);
		setTask(task);
	};

	const Task = ({ task, index }) => {
		const [isOpenTask, setIsOpenTask] = useState(task.completed);

		const handleTaskStatus = async (e, taskId) => {
			const isOpen = e.target.checked;
			setIsOpenTask(isOpen);
			try {
				await TaskService.updateTaskStatus({ isOpen }, taskId);
			} catch (error) {
				console.error("Error updating task status:", error);
			}
		};
		return (
			<React.Fragment key={task._id}>
				<Tr key={task.taskName}>
					<Td>
						<Checkbox
							colorScheme="facebook"
							sx={{ verticalAlign: "middle" }}
							isChecked={isOpenTask}
							onChange={(e) => handleTaskStatus(e, task._id)}
						/>
					</Td>
					<Td fontSize={"xs"} cursor={task?.subtasks?.length > 0 ? "pointer" : "default"}>
						<HStack spacing={3}>
							<Text>{task.taskName}</Text>
							<HStack
								spacing={0}
								onClick={() => handleToggle(index)}
								cursor={task?.subtasks?.length > 0 ? "pointer" : "default"}
							>
								<TaskButton isTask totalTasks={task?.subtasks?.length} />

								<IconButton
									variant="ghost"
									icon={<FaChevronDown />}
									color="var(--nav_color)"
									aria-label="Calendar Icon"
								/>
							</HStack>
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
						<HStack spacing="1">{RenderPriorityBars(task.priority)}</HStack>
					</Td>
					<Td fontSize={"xs"}>{task.projectName}</Td>
					<Td fontSize={"xs"}>{task?.updatedOn && formatDate(task.updatedOn)}</Td>
					<Td fontSize={"xs"}>{task.dueDate && formatDate(task.dueDate)}</Td>
					<Td fontSize={"12px"}>
						<HStack
							justifyContent={"start"}
							spacing={0}
							fontWeight={"bold"}
							p={"5px"}
							borderRadius={"8px"}
							color={statusColor(task.status).color}
							bgColor={statusColor(task.status).bg}
						>
							<Text> {task?.status}d</Text>
						</HStack>
					</Td>
					<Td fontSize={"12px"}>
						<HStack>
							<Button
								colorScheme="blue"
								size="xs"
								leftIcon={<SmallAddIcon />}
								onClick={() => handleAddSubTask(task)}
							>
								Add
							</Button>
							{/* <Button
								colorScheme="green"
								size="xs"
								onClick={() => handleEditTask(task)}
								leftIcon={<CiEdit />}
							>
								Edit
							</Button> */}
						</HStack>
					</Td>
				</Tr>
				<Tr>
					<Td colSpan="3" p={0} fontSize={"xs"}>
						<Collapse in={expandedIndex === index}>
							<VStack align="start" spacing={2} ml={"3em"} p={0} my={2}>
								{!isFiltered && task?.subtasks?.length > 0 && (
									<UnorderedList listStyleType={"none"}>
										<Caption title={"Sub tasks"} />
										{task?.subtasks?.map((subtask) => (
											<Subtask key={subtask.taskName} task={subtask} />
										))}
									</UnorderedList>
								)}
								{task?.activities?.length > 0 && (
									<UnorderedList listStyleType={"none"}>
										<Caption title={"Todos"} />
										{task?.activities?.map((activity, i) => (
											<TodoItem key={activity.taskName} task={activity} />
										))}
									</UnorderedList>
								)}
							</VStack>
						</Collapse>
					</Td>
				</Tr>
			</React.Fragment>
		);
	};

	return (
		<>
			<Flex>
				<Text fontWeight="bold">{isFiltered ? "Activities" : "Tasks"}</Text>
				<Spacer />
				<Button
					onClick={handleAddTask}
					color={"var(--main_color)"}
					bg={"var(--primary_button_bg)"}
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
			<AddNewActivity
				isOpen={openActivity}
				isFiltered={isFiltered}
				onClose={() => setOpenActivity(false)}
				setRefresh={setRefresh}
				allProjects={allProjects}
				allProjectTasks={allProjectTasks}
			/>
			<AddNewSubTask
				isOpen={openSubTask}
				isFiltered={isFiltered}
				onClose={() => setOpenSubTask(false)}
				setRefresh={setRefresh}
				task={task}
			/>
			<EditTask
				isOpen={openEditTask}
				isFiltered={isFiltered}
				onClose={() => setOpenEditTask(false)}
				setRefresh={setRefresh}
				task={task}
			/>
			<Box overflow="auto" css={tabScrollCss}>
				<Table color={"var(--nav_color)"} bg={"var(--primary_bg)"} size={"small"}>
					<Thead>
						<Tr>
							<Th>{/* <Checkbox sx={{ verticalAlign: "middle" }} /> */}</Th>
							{workView_Table.task_view_cols.map((col) => (
								<React.Fragment key={col}>{headerCell(col)}</React.Fragment>
							))}
							<Th />
						</Tr>
					</Thead>
					<Tbody>
						{(!filteredData || filteredData?.length === 0) && (
							<EmptyRowRecord
								data={filteredData}
								colSpan={workView_Table?.task_view_cols?.length}
							/>
						)}
						{filteredData?.map((task, index) => {
							return <Task key={task._id} task={task} index={index} />;
						})}
					</Tbody>
				</Table>
			</Box>
		</>
	);
};

export default TaskTable;
