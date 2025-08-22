import { HStack, Image, VStack } from "@chakra-ui/react";
import DeletePopUp from "components/ui/modal/DeletePopUp";
import { useState } from "react";
import ProjectService from "services/ProjectService";
import TaskService from "services/TaskService";
import projectImg from "../../../../assets/project.png";
import AddNewTask from "../project/AddNewTask";
import EditProject from "../project/EditProject";
import CellAction from "./CellAction";
import TaskActionCell from "./TaskActionCell";

const ProjectActionCell = ({
	project,
	index,
	setRefresh,
	managers,
	handleProjectToggle,
	handleSubTaskToggle,
	handleTaskToggle,
	isExpanded,
	isTaskExpanded,
	isSubExpanded,
	company,
}) => {
	const [isTaskCompleted, setIsTaskCompleted] = useState(project.completed);
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

	const handleTaskStatus = (e, taskId) => {
		setTaskId(taskId);
		const isOpen = e.target.checked;
		if (isOpen) {
			const { top, left, height } = e.target.getBoundingClientRect();
			setModalPosition({ top: top + height, left });
			setIsOpen(true);
		}
		setIsTaskCompleted(isOpen);
		setIsChecked(!isChecked);
	};

	const handleClose = () => {
		setIsOpen(false);
		setActualHours(0);
		setShowConfirmationPopUp((prev) => !prev);
	};

	const handleConfirm = async () => {
		setIsOpen(false);
		try {
			await TaskService.updateTaskStatus({ isOpen: isTaskCompleted, actualHours }, taskId);
			setRefresh((prev) => !prev);
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
			<HStack
				spacing={2}
				mt={2}
				className={`task_div_${index}`}
				whiteSpace={"pre-wrap"}
				alignItems={"center"}
			>
				<Image height={"20px"} width={"20px"} objectFit="cover" src={projectImg} alt="file" />
				<CellAction
					width="33em"
					name={project.projectName}
					totalTask={project?.tasks}
					totalTasks={project?.totalTasks}
					handleEdit={() => handleEditTask(project, project._id)}
					handleAdd={() => handleAddTask(project, project._id)}
					handleToggle={() => handleProjectToggle(index)}
					isExpanded={isExpanded === index}
					handleDelete={() => {
						setShowConfirmationPopUp(true);
						setDeleteRecordTask(project);
						setDeleteRecord(project._id);
					}}
					type={"project"}
					data={project}
					setRefresh={setRefresh}
				/>
			</HStack>

			{isExpanded === index &&
				project?.tasks?.length > 0 &&
				project?.tasks?.map((task, task_index) => {
					return (
						<VStack key={task._id} w={"100%"} alignItems={"flex-start"} ml={"1em"}>
							<TaskActionCell
								taskIndex={task_index}
								isTaskExpanded={isTaskExpanded}
								isSubExpanded={isSubExpanded}
								task={task}
								handleAddTask={() => handleAddTask(task, task._id)}
								isExpanded={isExpanded}
								handleTaskToggle={handleTaskToggle}
								handleSubTaskToggle={handleSubTaskToggle}
								setRefresh={setRefresh}
								managers={managers}
								company={company}
							/>
						</VStack>
					);
				})}
			{openEditTask && (
				<EditProject
					isOpen={openEditTask}
					onClose={() => setOpenEditTask(false)}
					currentTask={currentTask}
					setRefresh={setRefresh}
					managers={managers}
				/>
			)}
			{openAddTask && (
				<AddNewTask
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
					headerTitle={"Delete Project"}
					textTitle={"Are you sure you want to delete the task?"}
					isOpen={showConfirmationPopUp}
					onClose={handleClose}
					onOpen={handleDelete}
				/>
			)}
		</>
	);
};

export default ProjectActionCell;
