import { Checkbox, HStack } from "@chakra-ui/react";
import { useState } from "react";
import ProjectService from "services/ProjectService";
import { CircularProgressBarCell } from "utils";
import ActionItem from "./ActionItem";
import AddActualHours from "./AddActualHours";

const InnerSubTaskActionCell = ({ task }) => {
	const { _id, taskName, subTaskId, completed } = task;

	const [isOpenTask, setIsOpenTask] = useState(completed);
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
			await ProjectService.updateInnerSubTaskStatus(
				{ isOpen: isOpenTask, actualHours, taskName },
				subTaskId,
			);
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
			<HStack spacing={3} mt={"-1em"}>
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
					completionPercentage={parseFloat(task.completionPercent)}
				/>
				<ActionItem isInner={true} name={taskName} />
			</HStack>
		</>
	);
};

export default InnerSubTaskActionCell;
