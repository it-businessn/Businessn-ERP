import { SettingsIcon, SmallAddIcon } from "@chakra-ui/icons";
import {
	Avatar,
	Checkbox,
	HStack,
	IconButton,
	Td,
	Text,
	Tr,
} from "@chakra-ui/react";
import React, { useState } from "react";
import TaskService from "services/TaskService";
import {
	formatDate,
	generateLighterShade,
	renderPriorityBars,
	statusColor,
} from "utils";
import { COLORS } from "./project/data";

const TodoItem = ({ task }) => {
	const { _id, taskName, selectedAssignees, completed } = task;

	const [isOpenTask, setIsOpenTask] = useState(completed);

	const handleTaskStatus = async (e, taskId) => {
		const isOpen = e.target.checked;
		setIsOpenTask(isOpen);
		try {
			await TaskService.updateTaskActivityStatus({ isOpen }, taskId);
		} catch (error) {
			console.error("Error updating subtask status:", error);
		}
	};
	return (
		<React.Fragment key={_id}>
			<Tr>
				<Td p={0} pl={"5em"} w={"150px"}>
					<Checkbox
						isChecked={isOpenTask}
						onChange={(e) => handleTaskStatus(e, _id)}
						sx={{ verticalAlign: "middle" }}
						colorScheme="facebook"
					/>
				</Td>
				<Td
					fontSize={"xs"}
					w={"300px"}
					// onClick={handleToggle}
					cursor={task?.activities?.length > 0 ? "pointer" : "default"}
				>
					<HStack spacing={3}>
						<Text>{taskName}</Text>
						<HStack
							spacing={0}
							// onClick={() => handleToggle(index)}
							// cursor={project?.tasks?.length > 0 ? "pointer" : "default"}
						>
							{/* <TaskButton isTask totalTasks={task?.subtasks?.length || 0} /> */}
							<IconButton
								variant="ghost"
								icon={<SettingsIcon />}
								color="var(--nav_color)"
								aria-label="Settings Icon"
								// onClick={() => handleEditProject(project, project._id)}
							/>
							<IconButton
								variant="solid"
								icon={<SmallAddIcon />}
								borderRadius={"50%"}
								size={"xxs"}
								padding={"3px"}
								color="var(--nav_color)"
								bg={generateLighterShade(COLORS.primary, 0.8)}
								aria-label="Settings Icon"
								_hover={{
									color: "var(--nav_color)",
									bg: generateLighterShade(COLORS.primary, 0.8),
								}}
								// onClick={() => handleEditProject(project, project._id)}
							/>
							{/* <IconButton
								variant="ghost"
								icon={<FaChevronDown />}
								color="var(--nav_color)"
								aria-label="Calendar Icon"
							/> */}
						</HStack>
					</HStack>
				</Td>
				<Td fontSize={"xs"} w={"200px"}>
					<Avatar
						name={selectedAssignees}
						size={"sm"}
						src={selectedAssignees}
					/>
				</Td>
				<Td fontSize={"xs"} w={"200px"}>
					<HStack spacing="1">{renderPriorityBars(task.priority)}</HStack>
				</Td>
				<Td fontSize={"xs"} w={"180px"}>
					{task?.updatedOn && formatDate(task?.updatedOn)}
				</Td>
				<Td fontSize={"xs"} w={"180px"}>
					{task?.dueDate && formatDate(task?.dueDate)}
				</Td>
				<Td p={"1em"} fontSize={"12px"} w={"300px"}>
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
		</React.Fragment>
	);
};

export default TodoItem;
