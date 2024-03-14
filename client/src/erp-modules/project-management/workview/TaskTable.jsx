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
import { FaEdit, FaSort } from "react-icons/fa";
import ProjectService from "services/ProjectService";
import {
	CircularProgressBarCell,
	TaskButton,
	calculateTaskCompletion,
	formatDate,
	renderPriorityBars,
} from "utils";
import { statusColor } from ".";
import AddNewTask from "./AddNewTask";
import EditTask from "./EditTask";
import Subtask from "./Subtask";
import TodoItem from "./TodoItem";
import { workView_Table } from "./data";

const TaskTable = ({ data, isFiltered }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [expandedIndex, setExpandedIndex] = useState(null);
	const [refresh, setRefresh] = useState(false);
	const [filteredData, setFilteredData] = useState(data);
	const [openEditTask, setOpenEditTask] = useState(false);
	const [task, setTask] = useState(false);

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
		projectName: project.name,
		id: project._id,
	}));

	const allTasks = data?.flatMap(
		(project) =>
			project?.tasks?.map((task) => ({
				...task,
				projectName: project.name,
			})) || [],
	);

	const allProjectTasks = allTasks.map((task) => ({
		taskName: task.name,
		id: task._id,
	}));

	const allActivities = allTasks?.filter(
		(task) => task?.activities?.length > 0,
	);

	useEffect(() => {
		if (isFiltered) {
			setFilteredData(allActivities);
		} else {
			setFilteredData(allTasks);
		}
	}, [isFiltered]);

	const handleAddTask = () => {
		onOpen();
	};

	const handleEditTask = (task) => {
		setOpenEditTask(true);
		setTask(task);
	};

	const Task = ({ task, index }) => {
		const [isOpenTask, setIsOpenTask] = useState(!task.isOpen);

		const handleTaskStatus = async (e, taskId) => {
			const isOpen = e.target.checked;
			setIsOpenTask(isOpen);
			try {
				await ProjectService.updateTaskStatus({ isOpen }, taskId);
			} catch (error) {
				console.error("Error updating task status:", error);
			}
		};
		return (
			<React.Fragment key={task._id}>
				<Tr key={task.name}>
					<Td>
						<Checkbox
							colorScheme="facebook"
							sx={{ verticalAlign: "middle" }}
							isChecked={isOpenTask}
							onChange={(e) => handleTaskStatus(e, task._id)}
						/>
					</Td>
					<Td
						fontSize={"xs"}
						cursor={task?.subtasks?.length > 0 ? "pointer" : "default"}
					>
						<HStack spacing={3}>
							<CircularProgressBarCell
								completionPercentage={
									calculateTaskCompletion(task).completionPercentage
								}
							/>
							<Text onClick={() => handleToggle(index)}>{task.name}</Text>
							<TaskButton
								totalTasks={task?.subtasks?.length}
								onClick={() => handleToggle(index)}
							/>
							<FaEdit onClick={() => handleEditTask(task)} />
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
					<Td fontSize={"xs"}>{task.dueDate && formatDate(task.dueDate)}</Td>
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
							<VStack align="start" spacing={2} ml={"3em"} p={0} my={2}>
								{!isFiltered && task?.subtasks?.length > 0 && (
									<UnorderedList listStyleType={"none"}>
										<Caption title={"Sub tasks"} />
										{task?.subtasks?.map((subtask) => (
											<Subtask key={subtask.name} task={subtask} />
										))}
									</UnorderedList>
								)}
								{task?.activities?.length > 0 && (
									<UnorderedList listStyleType={"none"}>
										<Caption title={"Todos"} />
										{task?.activities?.map((activity, i) => (
											<TodoItem key={activity.name} task={activity} />
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
			<EditTask
				isOpen={openEditTask}
				isFiltered={isFiltered}
				onClose={() => setOpenEditTask(false)}
				setRefresh={setRefresh}
				task={task}
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
							return <Task key={task._id} task={task} index={index} />;
						})}
					</Tbody>
				</Table>
			</Box>
		</>
	);
};

export default TaskTable;
