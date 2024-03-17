import {
	Avatar,
	Checkbox,
	Collapse,
	HStack,
	IconButton,
	Td,
	Text,
	Tr,
	UnorderedList,
	VStack,
} from "@chakra-ui/react";
import Caption from "erp-modules/sales/lead docket/Caption";
import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import ProjectService from "services/ProjectService";
import {
	CircularProgressBarCell,
	TaskButton,
	calculateTaskCompletion,
	formatDate,
	renderPriorityBars,
} from "utils";
import { statusColor } from "..";
import Subtask from "../Subtask";
import TodoItem from "../TodoItem";

const ProjectChild = ({ task, project }) => {
	const [isExpanded, setExpanded] = useState(null);
	const handleToggle = () => {
		setExpanded((prev) => !prev);
	};
	const [isOpenTask, setIsOpenTask] = useState(task.completed);

	const handleTaskStatus = async (e, taskId) => {
		const isOpen = e.target.checked;
		setIsOpenTask(isOpen);
		try {
			await ProjectService.updateTaskStatus({ isOpen }, taskId);
		} catch (error) {
			console.error("Error updating task status:", error);
		}
	};
	const handleEditTask = (task, projectId) => {
		// setOpenEditTask(true);
		// setTask(task);
		// setProjectId(projectId);
	};
	return (
		<React.Fragment key={task._id}>
			<Tr>
				<Td p={0} pl={"5em"}>
					<Checkbox
						sx={{ verticalAlign: "middle" }}
						colorScheme="facebook"
						isChecked={isOpenTask}
						onChange={(e) => handleTaskStatus(e, task._id)}
					/>
				</Td>
				<Td
					fontSize={"xs"}
					onClick={handleToggle}
					cursor={task?.activities?.length > 0 ? "pointer" : "default"}
				>
					<HStack spacing={3}>
						<CircularProgressBarCell
							completionPercentage={
								calculateTaskCompletion(task).completionPercentage
							}
						/>
						<Text>{task.taskName}</Text>
						<HStack
							spacing={0}
							// onClick={() => handleToggle(index)}
							cursor={project?.tasks?.length > 0 ? "pointer" : "default"}
						>
							<TaskButton isTask totalTasks={task?.subtasks?.length || 0} />

							<IconButton
								variant="ghost"
								icon={<FaChevronDown />}
								color="brand.nav_color"
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
				<Td fontSize={"12px"}>
					<HStack>
						{/* <Button
							colorScheme="blue"
							size="xs"
							// onClick={() => handleAddTaskToProject(project._id)}
						>
							Add Task
						</Button>
						<Button
							colorScheme="green"
							size="xs"
							onClick={() => handleEditTask(task, task.projectId)}
							leftIcon={<CiEdit />}
						>
							Edit
						</Button> */}
					</HStack>
				</Td>
			</Tr>
			<Tr>
				<Td colSpan="3" p={0} fontSize={"xs"}>
					<Collapse in={isExpanded}>
						<VStack align="start" spacing={2} ml={"10em"} p={0} my={2}>
							{task?.subtasks?.length > 0 && (
								<UnorderedList listStyleType={"none"}>
									<Caption title={"Sub tasks"} />
									{task?.subtasks?.map((subtask) => (
										<Subtask id={task._id} key={subtask._id} task={subtask} />
									))}
								</UnorderedList>
							)}
							{task?.activities?.length > 0 && (
								<UnorderedList listStyleType={"none"}>
									<Caption title={"Todos"} />
									{task?.activities?.map((activity) => (
										<TodoItem key={activity._id} task={activity} />
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

export default ProjectChild;
