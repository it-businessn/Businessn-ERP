import { Checkbox, HStack, VStack } from "@chakra-ui/react";
import { useState } from "react";
import ProjectService from "services/ProjectService";
import { CircularProgressBarCell } from "utils";
import AddNewSubTask from "../AddNewSubTask";
import EditTask from "../EditTask";
import ActionItem from "./ActionItem";
import AddActualHours from "./AddActualHours";
import SubTaskActionCell from "./SubTaskActionCell";

const TaskActionCell = ({
	task,
	taskIndex,
	setRefresh,
	managers,
	handleSubTaskToggle,
	handleTaskToggle,
	isExpanded,
	isSubExpanded,
}) => {
	const [isTaskCompleted, setIsTaskCompleted] = useState(task.completed);
	const [openEditTask, setOpenEditTask] = useState(false);
	const [openAddTask, setOpenAddTask] = useState(false);
	const [currentTask, setCurrentTask] = useState(null);
	const [taskId, setTaskId] = useState(null);

	const [isOpen, setIsOpen] = useState(false);
	const [isChecked, setIsChecked] = useState(false);
	const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
	const [actualHours, setActualHours] = useState(0);

	const handleTaskStatus = (e, taskId) => {
		setTaskId(taskId);
		const isOpen = e.target.checked;
		if (isOpen) {
			const { top, left, height } = e.target.getBoundingClientRect();
			setModalPosition({ top: top + height, left });
			setIsOpen(true);
		}
		setIsTaskCompleted(isOpen);
		setIsChecked(!isChecked);
	};
	const handleClose = () => {
		setIsOpen(false);
		setActualHours(0);
	};

	const handleConfirm = async () => {
		setIsOpen(false);
		try {
			await ProjectService.updateTaskStatus(
				{ isOpen: isTaskCompleted, actualHours },
				taskId,
			);
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
		<>
			<HStack spacing={3} pl={"3em"} mt={"-1em"}>
				<Checkbox
					sx={{ verticalAlign: "middle" }}
					colorScheme="facebook"
					isChecked={isTaskCompleted}
					onChange={(e) => handleTaskStatus(e, task._id)}
				/>
				<CircularProgressBarCell
					// completionPercentage={
					// 	calculateTaskCompletion(task).completionPercentage
					// }
					completionPercentage={parseFloat(task.completionPercent)}
				/>
				<ActionItem
					name={task.taskName}
					totalTask={task?.subtasks}
					totalTasks={task?.totalTasks}
					handleEditProject={() => handleEditTask(task, task._id)}
					handleAddTask={() => handleAddTask(task, task._id)}
					handleToggle={() => handleTaskToggle(taskIndex)}
					isExpanded={isExpanded}
				/>
			</HStack>
			{isExpanded &&
				task?.subtasks?.length > 0 &&
				task?.subtasks?.map((subtask, subtask_index) => {
					return (
						<VStack key={subtask._id}>
							<SubTaskActionCell
								index={subtask_index}
								isSubExpanded={isSubExpanded === subtask_index}
								task={subtask}
								handleSubTaskToggle={handleSubTaskToggle}
								setRefresh={setRefresh}
								managers={managers}
							/>
						</VStack>
					);
				})}
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
			<AddActualHours
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				modalPosition={modalPosition}
				setActualHours={setActualHours}
				actualHours={actualHours}
				handleClose={handleClose}
				handleConfirm={handleConfirm}
			/>
		</>
	);
};

export default TaskActionCell;
