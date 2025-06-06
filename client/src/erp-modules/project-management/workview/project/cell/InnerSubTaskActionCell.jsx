import { Checkbox, HStack } from "@chakra-ui/react";
import { useState } from "react";
import ProjectService from "services/ProjectService";
import TaskService from "services/TaskService";
import { CircularProgressBarCell } from "utils";
import { convertDecimal } from "utils/convertAmt";
import EditInnerSubTask from "../EditInnerSubTask";
import ActionItem from "./ActionItem";
import AddActualHours from "./AddActualHours";

const InnerSubTaskActionCell = ({ task, setRefresh, managers, index }) => {
	const { _id, taskName, subTaskId, completed } = task;

	const [isOpenTask, setIsOpenTask] = useState(completed);
	const [isOpen, setIsOpen] = useState(false);
	const [isChecked, setIsChecked] = useState(false);
	const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
	const [innertaskId, setTaskId] = useState(null);
	const [actualHours, setActualHours] = useState(0);

	const handleTaskStatus = async (e, taskId) => {
		setTaskId(taskId);
		const isOpen = e.target.checked;
		if (isOpen) {
			const { top, left, height } = e.target.getBoundingClientRect();
			setModalPosition({ top: top + height, left });
			setIsOpen(true);
		}
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
			await TaskService.updateInnerSubTaskStatus(
				{ isOpen: isOpenTask, actualHours, taskName },
				subTaskId,
			);
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
			<AddActualHours
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				modalPosition={modalPosition}
				setActualHours={setActualHours}
				actualHours={actualHours}
				handleClose={handleClose}
				handleConfirm={handleConfirm}
			/>
			<HStack
				spacing={3}
				mt={"-0.5em"}
				className={`inner_subtask_div_${index}`}
				whiteSpace={"pre-wrap"}
			>
				<Checkbox
					sx={{ verticalAlign: "middle" }}
					colorScheme="facebook"
					isChecked={isOpenTask}
					onChange={(e) => handleTaskStatus(e, _id)}
				/>
				<CircularProgressBarCell
					// completionPercentage={
					// 	calculateTaskCompletion(task).completionPercentage
					// }

					completionPercentage={
						task.completionPercent
							? Number.isInteger(task.completionPercent)
								? task.completionPercent
								: convertDecimal(task.completionPercent)
							: 0
					}
				/>
				<ActionItem
					isInner={true}
					name={taskName}
					handleEditProject={() => handleEditSubtask(task, task._id)}
					handleDelete={() => handleDelete(task)}
				/>
			</HStack>
		</>
	);
};

export default InnerSubTaskActionCell;
