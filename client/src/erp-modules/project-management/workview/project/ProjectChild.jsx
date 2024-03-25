import { SettingsIcon } from "@chakra-ui/icons";
import {
	Avatar,
	Checkbox,
	Collapse,
	HStack,
	IconButton,
	Td,
	Text,
	Tr,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import ProjectService from "services/ProjectService";
import {
	AddTaskButton,
	CircularProgressBarCell,
	TaskButton,
	calculateTaskCompletion,
	formatDate,
	renderPriorityBars,
} from "utils";
import { statusColor } from "..";
import AddNewSubTask from "./AddNewSubTask";
import EditTask from "./EditTask";
import Subtask from "./Subtask";

const ProjectChild = ({
	task,
	projectId,
	setRefresh,
	managers,
	managerName,
}) => {
	const [isExpanded, setExpanded] = useState(null);
	const handleToggle = () => {
		setExpanded((prev) => !prev);
	};

	const [isTaskCompleted, setIsTaskCompleted] = useState(task.completed);
	const [openEditTask, setOpenEditTask] = useState(false);
	const [openAddTask, setOpenAddTask] = useState(false);
	const [currentTask, setCurrentTask] = useState(null);
	const [taskId, setTaskId] = useState(null);

	const handleTaskStatus = async (e, taskId) => {
		const isOpen = e.target.checked;
		setIsTaskCompleted(isOpen);
		try {
			await ProjectService.updateTaskStatus({ isOpen }, taskId);
		} catch (error) {
			console.error("Error updating task status:", error);
		}
	};

	const handleEditTask = (task, taskId) => {
		setOpenEditTask(true);
		setCurrentTask(task);
		setTaskId(taskId);
	};

	const handleAddTask = (task, taskId) => {
		setOpenAddTask(true);
		setCurrentTask(task);
		setTaskId(taskId);
	};

	return (
		<React.Fragment key={task._id}>
			<Tr p={0}>
				<Td p={"0.5em"} fontSize={"xs"} w={"350px"}>
					<HStack spacing={3}>
						<Checkbox
							sx={{ verticalAlign: "middle" }}
							colorScheme="facebook"
							isChecked={isTaskCompleted}
							onChange={(e) => handleTaskStatus(e, task._id)}
						/>
						<CircularProgressBarCell
							completionPercentage={
								calculateTaskCompletion(task).completionPercentage
							}
						/>
						<Text>{task.taskName}</Text>
						<HStack
							spacing={0}
							// cursor={project?.tasks?.length > 0 ? "pointer" : "default"}
						>
							{task?.subtasks?.length > 0 && (
								<TaskButton totalTasks={task?.totalTasks} />
							)}

							<IconButton
								variant="ghost"
								icon={<SettingsIcon />}
								color="brand.nav_color"
								aria-label="Settings Icon"
								onClick={() => handleEditTask(task, task._id)}
							/>
							<AddTaskButton onClick={() => handleAddTask(task, task._id)} />
							{task?.subtasks?.length > 0 && (
								<IconButton
									onClick={handleToggle}
									variant="ghost"
									icon={<FaChevronDown />}
									color="brand.nav_color"
									aria-label="Calendar Icon"
								/>
							)}
						</HStack>
					</HStack>
				</Td>
				<Td fontSize={"xs"} p={"0.5em"} w={"200px"}>
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
				<Td fontSize={"xs"} pl={"1em"} w={"100px"}>
					<HStack spacing="1">{renderPriorityBars(2)}</HStack>
				</Td>
				<Td fontSize={"xs"} pl={"1em"} w={"150px"}>
					{task?.createdOn && formatDate(task?.createdOn)}
				</Td>
				<Td fontSize={"xs"} pl={"1em"} w={"150px"}>
					{task?.dueDate && formatDate(task?.dueDate)}
				</Td>
				<Td fontSize={"xs"} pl={"1em"} w={"150px"}>
					{managerName}
				</Td>
				<Td fontSize={"xs"} pl={"1em"} w={"150px"}>
					{task?.updatedOn && formatDate(task?.updatedOn)}
				</Td>
				<Td fontSize={"12px"} w={"200px"}>
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
				<Td colSpan="8" p={0} pl={"2em"} fontSize={"xs"}>
					<Collapse in={isExpanded}>
						{task?.subtasks?.length > 0 &&
							task?.subtasks?.map((subtask) => {
								return (
									<Subtask
										setRefresh={setRefresh}
										managerName={managerName}
										id={task._id}
										key={subtask._id}
										subtask={task?.subtasks}
										task={subtask}
										managers={managers}
									/>
								);
							})}
					</Collapse>
				</Td>
			</Tr>
			{openEditTask && (
				<EditTask
					isOpen={openEditTask}
					onClose={() => setOpenEditTask(false)}
					currentTask={currentTask}
					setRefresh={setRefresh}
					managers={managers}
				/>
			)}
			{openAddTask && (
				<AddNewSubTask
					isOpen={openAddTask}
					onClose={() => setOpenAddTask(false)}
					currentTask={currentTask}
					setRefresh={setRefresh}
					managers={managers}
				/>
			)}
		</React.Fragment>
	);
};

export default ProjectChild;
