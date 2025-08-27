import { Checkbox, HStack, useToast } from "@chakra-ui/react";
import DeletePopUp from "components/ui/modal/DeletePopUp";
import { useState } from "react";
import ProjectService from "services/ProjectService";
import TaskService from "services/TaskService";
import { getTaskCheckboxCss } from "utils/common";
import { ACTION } from "../files";
import EditInnerSubTask from "../project/EditInnerSubTask";
import CellAction from "./CellAction";

const InnerSubTaskActionCell = ({
	task,
	managers,
	index,
	noteIconClicked,
	handleInnerSubTaskUpdate,
	fileId,
	handleSubTaskToggle,
}) => {
	const { _id, taskName, subTaskId, completed } = task;
	const toast = useToast();

	const [isTaskCompleted, setIsTaskCompleted] = useState(completed);
	const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);

	const handleTaskStatus = async (e) => {
		const isOpen = e.target.checked;
		setIsTaskCompleted(isOpen);
		handleCheckboxChange(isOpen);
	};

	const handleClose = () => {
		setShowConfirmationPopUp(false);
	};

	const handleCheckboxChange = async (isOpen) => {
		try {
			await TaskService.updateInnerSubTaskStatus({ isOpen, taskName }, subTaskId);
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

	const [openEditTask, setOpenEditTask] = useState(false);

	const handleEditSubtask = () => {
		setOpenEditTask(true);
	};

	const handleDelete = async () => {
		try {
			await ProjectService.deleteInnerSubTask(task, subTaskId);
			setShowConfirmationPopUp(false);
			handleInnerSubTaskUpdate(task, fileId, ACTION.DELETE, subTaskId, index);
			handleSubTaskToggle();
		} catch (error) {
			console.error("Error updating task status:", error);
		}
	};

	const handleSave = async (updatedData) => {
		try {
			const { data } = await ProjectService.updateInnerSubTaskName(
				{ taskName: updatedData, recordIndex: index },
				subTaskId,
			);
			handleInnerSubTaskUpdate(data, fileId, ACTION.EDIT, subTaskId);
		} catch (error) {
			console.log("An error occurred. Please try again.", error);
		}
	};
	return (
		<>
			<HStack
				spacing={3}
				className={`inner_subtask_div_${index}`}
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
					width="44em"
					isInner={true}
					name={taskName}
					handleEditProject={handleEditSubtask}
					handleDelete={() => setShowConfirmationPopUp(true)}
					onSave={handleSave}
					noteIconClicked={noteIconClicked}
				/>
			</HStack>
			{openEditTask && (
				<EditInnerSubTask
					isOpen={openEditTask}
					onClose={() => setOpenEditTask(false)}
					currentTask={task}
					managers={managers}
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

export default InnerSubTaskActionCell;
