import { Checkbox, HStack, VStack } from "@chakra-ui/react";
import { useState } from "react";
import ProjectService from "services/ProjectService";
import { CircularProgressBarCell } from "utils";
import AddNewSubTasks from "../AddNewSubTasks";
import EditSubTask from "../EditSubTask";
import ActionItem from "./ActionItem";
import AddActualHours from "./AddActualHours";
import InnerSubTaskActionCell from "./InnerSubTaskActionCell";

const SubTaskActionCell = ({
	task,
	setRefresh,
	managers,
	isInner,
	isSubExpanded,
	handleSubTaskToggle,
	index,
}) => {
	const { _id, taskName, selectedAssignees, completed } = task;

	const [isTaskCompleted, setIsTaskCompleted] = useState(task.completed);

	const [isOpenTask, setIsOpenTask] = useState(completed);
	const [openEditTask, setOpenEditTask] = useState(false);
	const [openAddTask, setOpenAddTask] = useState(false);
	const [currentTask, setCurrentTask] = useState(null);
	const [isOpen, setIsOpen] = useState(false);
	const [isChecked, setIsChecked] = useState(false);
	const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
	const [taskId, setTaskId] = useState(null);
	const [actualHours, setActualHours] = useState(0);

	const handleTaskStatus = async (e, taskId) => {
		setTaskId(taskId);
		const isOpen = e.target.checked;
		if (isOpen) {
			const { top, left, height } = e.target.getBoundingClientRect();
			setModalPosition({ top: top + height, left });
			setIsOpen(true);
		}
		setIsTaskCompleted(isOpen);
		setIsChecked(!isChecked);

		setIsOpenTask(isOpen);
	};
	const handleClose = () => {
		setIsOpen(false);
		setActualHours(0);
	};

	const handleConfirm = async () => {
		setIsOpen(false);
		try {
			await ProjectService.updateSubTaskStatus(
				{ isOpen: isTaskCompleted, actualHours },
				taskId,
			);
		} catch (error) {
			console.error("Error updating task status:", error);
		}
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
		<>
			<AddActualHours
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				modalPosition={modalPosition}
				setActualHours={setActualHours}
				actualHours={actualHours}
				handleClose={handleClose}
				handleConfirm={handleConfirm}
			/>
			<HStack spacing={3} pl={"7em"} mt={"-1em"}>
				<Checkbox
					sx={{ verticalAlign: "middle" }}
					colorScheme="facebook"
					isChecked={isTaskCompleted}
					onChange={(e) => handleTaskStatus(e, _id)}
				/>
				<CircularProgressBarCell
					// completionPercentage={
					// 	calculateTaskCompletion(task).completionPercentage
					// }
					completionPercentage={parseFloat(task.completionPercent)}
				/>
				<ActionItem
					isInner={isInner}
					name={taskName}
					totalTask={task?.subtasks}
					totalTasks={task?.totalTasks}
					handleEditProject={() => handleEditSubtask(task, task._id)}
					handleAddTask={() => handleAddSubTask(task, task._id)}
					handleToggle={() => handleSubTaskToggle(index)}
					isExpanded={isSubExpanded}
				/>
			</HStack>
			{isSubExpanded &&
				task?.subtasks?.length > 0 &&
				task?.subtasks?.map((subtask) => {
					return (
						<VStack key={subtask._id}>
							<InnerSubTaskActionCell task={subtask} />
						</VStack>
					);
				})}
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
		</>
	);
};

export default SubTaskActionCell;
