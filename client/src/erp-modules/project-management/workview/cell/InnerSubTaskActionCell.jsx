import { Checkbox, HStack, useToast } from "@chakra-ui/react";
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
	const [isChecked, setIsChecked] = useState(false);
	const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
	const [innertaskId, setTaskId] = useState(null);
	const [actualHours, setActualHours] = useState(0);
	const toast = useToast();

	const handleTaskStatus = async (e, taskId) => {
		setTaskId(taskId);
		const isOpen = e.target.checked;
		setIsChecked(!isChecked);
		setIsTaskCompleted(isOpen);
		handleConfirm();
	};

	const handleClose = () => {
		setIsOpen(false);
		setActualHours(0);
	};

	const handleConfirm = async () => {
		setIsOpen(false);
		try {
			await TaskService.updateInnerSubTaskStatus({ isOpen: isTaskCompleted, taskName }, subTaskId);
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

	const handleEditSubtask = (task, taskId) => {
		setOpenEditTask(true);
		setCurrentTask(task);
		setTaskId(taskId);
	};

	const handleDelete = async (task) => {
		try {
			await ProjectService.deleteInnerSubTask(task, subTaskId);
			setRefresh((prev) => !prev);
		} catch (error) {
			console.error("Error updating task status:", error);
		}
	};
	const handleSave = async (updatedData) => {
		try {
			await ProjectService.updateInnerSubTaskName({ projectName: updatedData }, task._id);
		} catch (error) {
			console.log("An error occurred. Please try again.", error);
		}
	};
	return (
		<>
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
			<HStack spacing={3} className={`inner_subtask_div_${index}`} whiteSpace={"pre-wrap"}>
				<Checkbox
					sx={getTaskCheckboxCss(isTaskCompleted)}
					colorScheme="facebook"
					isChecked={isTaskCompleted}
					onChange={(e) => handleTaskStatus(e, _id)}
				/>
				<CellAction
					isInner={true}
					name={taskName}
					handleEditProject={() => handleEditSubtask(task, task._id)}
					handleDelete={() => handleDelete(task)}
					onSave={handleSave}
				/>
			</HStack>
		</>
	);
};

export default InnerSubTaskActionCell;
