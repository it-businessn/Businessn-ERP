import { Checkbox, HStack, useToast, VStack } from "@chakra-ui/react";
import DeletePopUp from "components/ui/modal/DeletePopUp";
import { useState } from "react";
import ProjectService from "services/ProjectService";
import TaskService from "services/TaskService";
import { getTaskCheckboxCss } from "utils/common";
import AddNewSubTask from "../project/AddNewSubTask";
import EditTask from "../project/EditTask";
import CellAction from "./CellAction";
import SubTaskActionCell from "./SubTaskActionCell";

const TaskActionCell = ({
	task,
	taskIndex,
	setRefresh,
	managers,
	handleSubTaskToggle,
	handleTaskToggle,
	isTaskExpanded,
	isSubExpanded,
	company,
}) => {
	const [isTaskCompleted, setIsTaskCompleted] = useState(task.completed);
	const [openEditTask, setOpenEditTask] = useState(false);
	const [openAddTask, setOpenAddTask] = useState(false);

	const [isOpen, setIsOpen] = useState(false);
	const [isChecked, setIsChecked] = useState(false);
	const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
	const [actualHours, setActualHours] = useState(0);
	const [deleteRecord, setDeleteRecord] = useState(false);
	const [deleteRecordTask, setDeleteRecordTask] = useState(false);
	const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);
	const toast = useToast();

	const handleTaskStatus = (e) => {
		const isOpen = e.target.checked;
		setIsTaskCompleted(isOpen);
		setIsChecked(!isChecked);
		handleCheckboxChange();
	};
	const handleClose = () => {
		setIsOpen(false);
		setActualHours(0);
		setShowConfirmationPopUp((prev) => !prev);
	};

	const handleCheckboxChange = async () => {
		setIsOpen(false);
		try {
			await TaskService.updateTaskStatus({ isOpen: isTaskCompleted }, task._id);
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

	const handleEditTask = () => {
		setOpenEditTask(true);
	};

	const handleAddTask = () => {
		setOpenAddTask(true);
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

	const handleSave = async (updatedData) => {
		try {
			await ProjectService.updateTaskName({ taskName: updatedData }, task._id);
		} catch (error) {
			console.log("An error occurred. Please try again.", error);
		}
	};

	const width = task?.subtasks?.length ? "38em" : "43.1em";
	return (
		<>
			<HStack
				spacing={2}
				className={`task_div_${taskIndex}`}
				whiteSpace={"pre-wrap"}
				_hover={{ bg: "var(--phoneCall_bg_light)" }}
			>
				<Checkbox
					sx={getTaskCheckboxCss(isTaskCompleted)}
					isChecked={isTaskCompleted}
					onChange={handleTaskStatus}
				/>
				<CellAction
					width={width}
					name={task.taskName}
					totalTask={task?.subtasks}
					totalTasks={task?.subtasks?.length}
					handleEdit={handleEditTask}
					handleAdd={handleAddTask}
					onSave={handleSave}
					handleToggle={() => handleTaskToggle(taskIndex)}
					isExpanded={isTaskExpanded === taskIndex}
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

			{isTaskExpanded === taskIndex &&
				task?.subtasks?.length > 0 &&
				task?.subtasks?.map((subtask, subtask_index) => {
					return (
						<VStack key={subtask._id} w={"100%"} alignItems={"flex-start"} ml={"1em"}>
							<SubTaskActionCell
								index={subtask_index}
								isTaskExpanded={isTaskExpanded}
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
					currentTask={task}
					setRefresh={setRefresh}
					managers={managers}
				/>
			)}
			{openAddTask && (
				<AddNewSubTask
					isOpen={openAddTask}
					onClose={() => setOpenAddTask(false)}
					currentTask={task}
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
