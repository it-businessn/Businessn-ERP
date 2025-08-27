import { Checkbox, HStack, useToast } from "@chakra-ui/react";
import DeletePopUp from "components/ui/modal/DeletePopUp";
import { useState } from "react";
import ProjectService from "services/ProjectService";
import TaskService from "services/TaskService";
import { getTaskCheckboxCss } from "utils/common";
import EditInnerSubTask from "../project/EditInnerSubTask";
import CellAction from "./CellAction";

const InnerSubTaskActionCell = ({ task, setRefresh, managers, index }) => {
	const { _id, taskName, subTaskId, completed } = task;

	const [isTaskCompleted, setIsTaskCompleted] = useState(completed);
	const [isOpen, setIsOpen] = useState(false);
	const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
	const [innertaskId, setTaskId] = useState(null);
	const [actualHours, setActualHours] = useState(0);
	const toast = useToast();
	const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);

	const handleTaskStatus = async (e) => {
		setTaskId(_id);
		const isOpen = e.target.checked;
		setIsTaskCompleted(isOpen);
		handleCheckboxChange(isOpen);
	};

	const handleClose = () => {
		setIsOpen(false);
		setActualHours(0);
		setShowConfirmationPopUp(false);
	};

	const handleCheckboxChange = async (isOpen) => {
		setIsOpen(false);
		try {
			await TaskService.updateInnerSubTaskStatus({ isOpen, taskName }, subTaskId);
			toast({
				title: "Task updated successfully!",
				status: "success",
				duration: 1000,
				isClosable: true,
			});
			setRefresh((prev) => !prev);
		} catch (error) {
			console.error("Error updating task status:", error);
		}
	};

	const [openEditTask, setOpenEditTask] = useState(false);
	const [currentTask, setCurrentTask] = useState(null);

	const handleEditSubtask = () => {
		setOpenEditTask(true);
		setCurrentTask(task);
		setTaskId(_id);
	};

	const handleDelete = async () => {
		try {
			await ProjectService.deleteInnerSubTask(task, subTaskId);
			setShowConfirmationPopUp(false);
		} catch (error) {
			console.error("Error updating task status:", error);
		}
	};

	const handleSave = async (updatedData) => {
		try {
			await ProjectService.updateInnerSubTaskName(
				{ taskName: updatedData, recordIndex: index },
				subTaskId,
			);
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
				/>
			</HStack>
			{openEditTask && (
				<EditInnerSubTask
					isOpen={openEditTask}
					onClose={() => setOpenEditTask(false)}
					currentTask={currentTask}
					setRefresh={setRefresh}
					managers={managers}
				/>
			)}
			{/* <AddActualHours
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				modalPosition={modalPosition}
				setActualHours={setActualHours}
				actualHours={actualHours}
				handleClose={handleClose}
				handleConfirm={handleConfirm}
			/> */}
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
