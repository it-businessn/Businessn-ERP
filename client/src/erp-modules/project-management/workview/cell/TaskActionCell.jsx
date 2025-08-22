import { Checkbox, HStack, useToast, VStack } from "@chakra-ui/react";
import DeletePopUp from "components/ui/modal/DeletePopUp";
import { useState } from "react";
import ProjectService from "services/ProjectService";
import TaskService from "services/TaskService";
import { getTaskCheckboxCss } from "utils/common";
import AddNewSubTask from "../project/AddNewSubTask";
import EditTask from "../project/EditTask";
import ActionItem from "./ActionItem";
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
	company,
}) => {
	const { _id, taskName, selectedAssignees, completed } = task;
	const [isTaskCompleted, setIsTaskCompleted] = useState(task.completed);
	const [openEditTask, setOpenEditTask] = useState(false);
	const [openAddTask, setOpenAddTask] = useState(false);
	const [currentTask, setCurrentTask] = useState(null);
	const [taskId, setTaskId] = useState(null);

	const [isOpen, setIsOpen] = useState(false);
	const [isChecked, setIsChecked] = useState(false);
	const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
	const [actualHours, setActualHours] = useState(0);
	const [deleteRecord, setDeleteRecord] = useState(false);
	const [deleteRecordTask, setDeleteRecordTask] = useState(false);
	const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);
	const toast = useToast();

	const handleTaskStatus = (e, taskId) => {
		setTaskId(taskId);
		const isOpen = e.target.checked;
		setIsTaskCompleted(isOpen);
		setIsChecked(!isChecked);
		handleConfirm();
	};
	const handleClose = () => {
		setIsOpen(false);
		setActualHours(0);
		setShowConfirmationPopUp((prev) => !prev);
	};

	const handleConfirm = async () => {
		setIsOpen(false);
		try {
			await TaskService.updateTaskStatus({ isOpen: isTaskCompleted }, taskId);
			setRefresh((prev) => !prev);
			toast({
				title: "Task updated successfully!",
				status: "success",
				duration: 1000,
				isClosable: true,
			});
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

	const handleDelete = async () => {
		try {
			await ProjectService.deleteTask(deleteRecordTask, deleteRecord);
			setRefresh((prev) => !prev);
			setShowConfirmationPopUp((prev) => !prev);
		} catch (error) {
			console.error("Error updating task status:", error);
		}
	};
	return (
		<>
			<HStack spacing={2} className={`task_div_${taskIndex}`} whiteSpace={"pre-wrap"}>
				<Checkbox
					sx={getTaskCheckboxCss(isTaskCompleted)}
					isChecked={isTaskCompleted}
					onChange={(e) => handleTaskStatus(e, _id)}
				/>
				<ActionItem
					width="33em"
					name={task.taskName}
					totalTask={task?.subtasks}
					totalTasks={task?.totalTasks}
					handleEditProject={() => handleEditTask(task, task._id)}
					handleAddTask={() => handleAddTask(task, task._id)}
					handleToggle={() => handleTaskToggle(taskIndex)}
					isExpanded={isExpanded === taskIndex}
					handleDelete={() => {
						setShowConfirmationPopUp(true);
						setDeleteRecordTask(task);
						setDeleteRecord(task._id);
					}}
					type={"task"}
					data={task}
					setRefresh={setRefresh}
				/>
			</HStack>

			{isExpanded === taskIndex &&
				task?.subtasks?.length > 0 &&
				task?.subtasks?.map((subtask, subtask_index) => {
					return (
						<VStack key={subtask._id} w={"100%"} alignItems={"flex-start"} ml={"1em"}>
							<SubTaskActionCell
								index={subtask_index}
								isSubExpanded={isSubExpanded}
								task={subtask}
								handleSubTaskToggle={handleSubTaskToggle}
								setRefresh={setRefresh}
								managers={managers}
								company={company}
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
					company={company}
				/>
			)}
			{/* {isOpen && (
				<AddActualHours
					isOpen={isOpen}
					setIsOpen={setIsOpen}
					modalPosition={modalPosition}
					setActualHours={setActualHours}
					actualHours={actualHours}
					handleClose={handleClose}
					handleConfirm={handleConfirm}
				/>
			)} */}
			{showConfirmationPopUp && (
				<DeletePopUp
					headerTitle={"Delete Task"}
					textTitle={"Are you sure you want to delete the task?"}
					isOpen={showConfirmationPopUp}
					onClose={handleClose}
					onOpen={handleDelete}
				/>
			)}
		</>
	);
};

export default TaskActionCell;
