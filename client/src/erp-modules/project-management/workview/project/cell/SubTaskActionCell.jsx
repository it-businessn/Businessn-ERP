import { Checkbox, HStack, VStack } from "@chakra-ui/react";
import DeletePopUp from "components/ui/modal/DeletePopUp";
import { useState } from "react";
import ProjectService from "services/ProjectService";
import TaskService from "services/TaskService";
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
	company,
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
	const [deleteRecord, setDeleteRecord] = useState(false);
	const [deleteRecordTask, setDeleteRecordTask] = useState(false);
	const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);

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
		setShowConfirmationPopUp((prev) => !prev);
	};

	const handleConfirm = async () => {
		setIsOpen(false);
		try {
			await TaskService.updateSubTaskStatus({ isOpen: isTaskCompleted, actualHours }, taskId);
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

	const handleDelete = async () => {
		try {
			await ProjectService.deleteSubTask(deleteRecordTask, deleteRecord);
			setRefresh((prev) => !prev);
			setShowConfirmationPopUp((prev) => !prev);
		} catch (error) {
			console.error("Error updating task status:", error);
		}
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
			<HStack spacing={3} className={`subtask_div_${index}`} whiteSpace={"pre-wrap"}>
				<Checkbox
					sx={{ verticalAlign: "middle" }}
					colorScheme="facebook"
					isChecked={isTaskCompleted}
					onChange={(e) => handleTaskStatus(e, _id)}
				/>
				<ActionItem
					isInner={isInner}
					name={taskName}
					totalTask={task?.subtasks}
					totalTasks={task?.subtasks?.length}
					handleEditProject={() => handleEditSubtask(task, task._id)}
					handleAddTask={() => handleAddSubTask(task, task._id)}
					handleToggle={() => handleSubTaskToggle(index)}
					isExpanded={isSubExpanded === index}
					handleDelete={() => {
						console.log("ss");
						setShowConfirmationPopUp((prev) => !prev);
						setDeleteRecordTask(task);
						setDeleteRecord(task._id);
					}}
					data={task}
					type={"subtask"}
					setRefresh={setRefresh}
				/>
			</HStack>
			{isSubExpanded === index &&
				task?.subtasks?.length > 0 &&
				task?.subtasks?.map((rec, index) => {
					return (
						<VStack
							key={`subtasks_action_${rec._id}*78${index}`}
							w={"100%"}
							alignItems={"flex-start"}
							ml={"2em"}
						>
							<InnerSubTaskActionCell
								task={rec}
								index={index}
								setRefresh={setRefresh}
								managers={managers}
							/>
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
					company={company}
				/>
			)}
			{showConfirmationPopUp && (
				<DeletePopUp
					headerTitle={"Delete Sub Task"}
					textTitle={"Are you sure you want to delete the task?"}
					isOpen={showConfirmationPopUp}
					onClose={handleClose}
					onOpen={handleDelete}
				/>
			)}
		</>
	);
};

export default SubTaskActionCell;
