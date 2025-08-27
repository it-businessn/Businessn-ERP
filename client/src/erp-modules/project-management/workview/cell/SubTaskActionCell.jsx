import { Checkbox, HStack, useToast, VStack } from "@chakra-ui/react";
import DeletePopUp from "components/ui/modal/DeletePopUp";
import { useState } from "react";
import ProjectService from "services/ProjectService";
import TaskService from "services/TaskService";
import { getTaskCheckboxCss } from "utils/common";
import { ACTION } from "../files";
import AddNewSubTasks from "../project/AddNewSubTasks";
import EditSubTask from "../project/EditSubTask";
import AddNotes from "./AddNotes";
import CellAction from "./CellAction";
import InnerSubTaskActionCell from "./InnerSubTaskActionCell";

const SubTaskActionCell = ({
	task,
	managers,
	isInner,
	isSubExpanded,
	handleSubTaskToggle,
	index,
	company,
	handleSubTaskUpdate,
	fileId,
	handleTaskToggle,
	handleInnerSubTaskUpdate,
}) => {
	const { _id, taskName, selectedAssignees, completed } = task;

	const [isTaskCompleted, setIsTaskCompleted] = useState(completed);

	const [openEditTask, setOpenEditTask] = useState(false);
	const [openAddTask, setOpenAddTask] = useState(false);
	const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);
	const [showNote, setShowNote] = useState(false);

	const toast = useToast();

	const handleTaskStatus = async (e) => {
		const isOpen = e.target.checked;
		setIsTaskCompleted(isOpen);
		handleCheckboxChange(isOpen);
	};

	const handleClose = () => {
		setShowConfirmationPopUp((prev) => !prev);
	};

	const handleCheckboxChange = async (isOpen) => {
		try {
			const { data } = await TaskService.updateSubTaskStatus({ isOpen }, _id);
			toast({
				title: "Task updated successfully!",
				status: "success",
				duration: 1000,
				isClosable: true,
			});
			handleSubTaskUpdate(data, fileId, ACTION.EDIT);
		} catch (error) {
			console.error("Error updating task status:", error);
		}
	};
	const handleEditSubtask = () => {
		setOpenEditTask(true);
	};

	const handleAddSubTask = () => {
		setOpenAddTask(true);
	};

	const handleDelete = async () => {
		try {
			await ProjectService.deleteSubTask(task, _id);
			setShowConfirmationPopUp(false);
			handleSubTaskUpdate(task, fileId, ACTION.DELETE);
			handleTaskToggle();
		} catch (error) {
			console.error("Error updating task status:", error);
		}
	};

	const handleSave = async (updatedData) => {
		try {
			const { data } = await ProjectService.updateSubTaskName({ taskName: updatedData }, task._id);
			handleSubTaskUpdate(data, fileId, ACTION.EDIT);
		} catch (error) {
			console.log("An error occurred. Please try again.", error);
		}
	};

	const noteIconClicked = () => {
		setShowNote(true);
	};

	const subTaskAdded = (data) => {
		handleInnerSubTaskUpdate(data, fileId, ACTION.ADD, data._id);
	};

	const taskUpdated = (data, action) => {
		handleSubTaskUpdate(data, fileId, action);
		handleTaskToggle();
	};

	const width = task?.subtasks?.length ? "36.5em" : "42em";
	return (
		<>
			<HStack
				spacing={3}
				className={`subtask_div_${index}`}
				whiteSpace={"pre-wrap"}
				_hover={{ bg: "var(--phoneCall_bg_light)" }}
			>
				<Checkbox
					sx={getTaskCheckboxCss(isTaskCompleted)}
					colorScheme="facebook"
					isChecked={isTaskCompleted}
					onChange={handleTaskStatus}
				/>
				<CellAction
					width={width}
					isInner={isInner}
					name={taskName}
					totalTask={task?.subtasks}
					totalTasks={task?.subtasks?.length}
					handleEdit={handleEditSubtask}
					handleAdd={handleAddSubTask}
					onSave={handleSave}
					handleToggle={() => handleSubTaskToggle(index)}
					isExpanded={isSubExpanded === index}
					handleDelete={() => setShowConfirmationPopUp(true)}
					type={"subtask"}
					noteIconClicked={noteIconClicked}
				/>
			</HStack>
			{isSubExpanded === index &&
				task?.subtasks?.length > 0 &&
				task?.subtasks?.map((rec, sub_index) => {
					return (
						<VStack
							key={`subtasks_action_${rec._id}*78${sub_index}`}
							w={"100%"}
							alignItems={"flex-start"}
							ml={"1em"}
						>
							<InnerSubTaskActionCell
								task={rec}
								index={sub_index}
								managers={managers}
								noteIconClicked={noteIconClicked}
								handleInnerSubTaskUpdate={handleInnerSubTaskUpdate}
								fileId={fileId}
								handleSubTaskToggle={handleSubTaskToggle}
							/>
						</VStack>
					);
				})}
			{openEditTask && (
				<EditSubTask
					isOpen={openEditTask}
					onClose={() => setOpenEditTask(false)}
					currentTask={task}
					managers={managers}
					handleSubTaskUpdate={taskUpdated}
				/>
			)}
			{openAddTask && (
				<AddNewSubTasks
					isOpen={openAddTask}
					onClose={() => setOpenAddTask(false)}
					currentTask={task}
					managers={managers}
					company={company}
					subTaskAdded={subTaskAdded}
				/>
			)}
			{showNote && (
				<AddNotes
					type={"subtask"}
					content={task}
					isOpen={showNote}
					setIsOpen={setShowNote}
					handleActionUpdate={(data) => handleSubTaskUpdate(data, fileId, ACTION.EDIT)}
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
