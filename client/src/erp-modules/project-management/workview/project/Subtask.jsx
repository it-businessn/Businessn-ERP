import { SettingsIcon } from "@chakra-ui/icons";
import { Avatar, Checkbox, Collapse, HStack, IconButton, Td, Text, Tr } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import TaskService from "services/TaskService";
import { AddTaskButton, TaskButton, renderPriorityBars, statusColor } from "utils";
import { formatDate } from "utils/convertDate";
import AddNewSubTasks from "./AddNewSubTasks";
import EditSubTask from "./EditSubTask";

const Subtask = ({ id, task, subtask, managerName, setRefresh, managers, isInner }) => {
	const { _id, taskName, selectedAssignees, completed } = task;

	const [isOpenTask, setIsOpenTask] = useState(completed);
	const [openEditTask, setOpenEditTask] = useState(false);
	const [openAddTask, setOpenAddTask] = useState(false);
	const [currentTask, setCurrentTask] = useState(null);
	const [taskId, setTaskId] = useState(null);

	const handleTaskStatus = async (e, taskId) => {
		const isOpen = e.target.checked;
		setIsOpenTask(isOpen);
		try {
			await TaskService.updateSubTaskStatus({ isOpen }, taskId);
		} catch (error) {
			console.error("Error updating subtask status:", error);
		}
	};
	const [isExpanded, setExpanded] = useState(null);
	const handleToggle = () => {
		setExpanded((prev) => !prev);
	};
	const handleEditSubtask = (task, taskId) => {
		setOpenEditTask(true);
		setCurrentTask(task);
		setTaskId(taskId);
	};

	const handleAddSubTask = (task, taskId) => {
		setOpenAddTask(true);
		setCurrentTask(task);
		setTaskId(taskId);
	};
	return (
		<React.Fragment key={_id}>
			<Tr p={0}>
				<Td
					p={0}
					fontSize={"xs"}
					w={"350px"}
					cursor={task?.activities?.length > 0 ? "pointer" : "default"}
				>
					<HStack spacing={3}>
						<Checkbox
							isChecked={isOpenTask}
							sx={{ verticalAlign: "middle" }}
							colorScheme="facebook"
							onChange={(e) => handleTaskStatus(e, _id)}
						/>

						<Text>{taskName}</Text>
						<HStack
							spacing={0}
							// onClick={() => handleToggle(index)}
							// cursor={project?.tasks?.length > 0 ? "pointer" : "default"}
						>
							{!isInner && (
								<>
									{task?.subtasks?.length > 0 && (
										<TaskButton isTask totalTasks={task?.totalTasks || task?.subtasks?.length} />
									)}

									<IconButton
										variant="ghost"
										icon={<SettingsIcon />}
										color="var(--nav_color)"
										aria-label="Settings Icon"
										onClick={() => handleEditSubtask(task, task._id)}
									/>
									<AddTaskButton onClick={() => handleAddSubTask(task, task._id)} />
									{task?.subtasks?.length > 0 && (
										<IconButton
											onClick={handleToggle}
											variant="ghost"
											icon={<FaChevronDown />}
											color="var(--nav_color)"
											aria-label="Calendar Icon"
										/>
									)}
								</>
							)}
						</HStack>
					</HStack>
				</Td>
				<Td fontSize={"xs"} w={"200px"} p={0}>
					<HStack>
						{selectedAssignees?.map((assignee) => (
							<Avatar
								key={assignee}
								name={assignee}
								size={{ base: "xs", md: "sm" }}
								src={assignee}
							/>
						))}
					</HStack>
				</Td>
				<Td fontSize={"xs"} w={"100px"} p={0}>
					<HStack spacing="1">{renderPriorityBars(task.priority)}</HStack>
				</Td>
				<Td fontSize={"xs"} w={"150px"} p={0}>
					{task?.createdOn && formatDate(task?.createdOn)}
				</Td>
				<Td fontSize={"xs"} w={"150px"} p={0}>
					{task?.dueDate && formatDate(task?.dueDate)}
				</Td>
				<Td fontSize={"xs"} w={"150px"} p={0}>
					{managerName}
				</Td>
				<Td fontSize={"xs"} w={"150px"} p={0}>
					{task?.updatedOn && formatDate(task?.updatedOn)}
				</Td>
				<Td p={"1em"} fontSize={"12px"} w={"200px"}>
					<HStack
						justifyContent={"space-around"}
						spacing={0}
						fontWeight={"bold"}
						color={statusColor(task.status).color}
						bgColor={statusColor(task.status).bg}
						p={"5px"}
						borderRadius={"8px"}
					>
						<Text> {task.status || 0}d</Text>
					</HStack>
				</Td>
			</Tr>
			<Tr>
				<Td colSpan="8" p={0} fontSize={"xs"} pl={"3em"}>
					<Collapse in={isExpanded}>
						{task?.subtasks?.length > 0 &&
							task?.subtasks?.map((subtasks) => {
								return (
									<Subtask
										isInner
										id={subtasks._id}
										key={subtasks._id}
										task={subtasks}
										setRefresh={setRefresh}
										managerName={managerName}
										subtask={subtasks?.subtasks}
										managers={managers}
									/>
								);
							})}
					</Collapse>
				</Td>
			</Tr>
			{openEditTask && (
				<EditSubTask
					isOpen={openEditTask}
					onClose={() => setOpenEditTask(false)}
					currentTask={currentTask}
					setRefresh={setRefresh}
					managers={managers}
				/>
			)}
			{openAddTask && (
				<AddNewSubTasks
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

export default Subtask;
