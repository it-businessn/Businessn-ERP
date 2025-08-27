import { HStack, Image, VStack } from "@chakra-ui/react";
import DeletePopUp from "components/ui/modal/DeletePopUp";
import { useState } from "react";
import ProjectService from "services/ProjectService";
import projectImg from "../../../../assets/project.png";
import { ACTION } from "../files";
import AddNewTask from "../project/AddNewTask";
import EditProject from "../project/EditProject";
import AddNotes from "./AddNotes";
import CellAction from "./CellAction";
import TaskActionCell from "./TaskActionCell";

const ProjectActionCell = ({
	project,
	index,
	managers,
	handleProjectToggle,
	handleSubTaskToggle,
	handleTaskToggle,
	isExpanded,
	isTaskExpanded,
	isSubExpanded,
	company,
	handleFileToggle,
	handleProjectUpdate,
	handleSubTaskUpdate,
	handleTaskUpdate,
	handleInnerSubTaskUpdate,
}) => {
	const [openEditProject, setOpenEditProject] = useState(false);
	const [openAddTask, setOpenAddTask] = useState(false);
	const [currentTask, setCurrentTask] = useState(null);
	const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);
	const [showNote, setShowNote] = useState(false);

	const handleClose = () => {
		setShowConfirmationPopUp(false);
	};

	const handleEditProject = () => {
		setOpenEditProject(true);
	};

	const handleAddItem = (task) => {
		setOpenAddTask(true);
		setCurrentTask(task);
	};

	const noteIconClicked = () => {
		setShowNote(true);
	};

	const handleDelete = async () => {
		try {
			await ProjectService.deleteProject(project, project._id);
			setShowConfirmationPopUp(false);
			handleProjectUpdate(project, ACTION.DELETE);
			handleFileToggle();
		} catch (error) {
			console.error("Error updating task status:", error);
		}
	};

	const handleSave = async (updatedData) => {
		try {
			const { data } = await ProjectService.updateProjectName(
				{ projectName: updatedData },
				project._id,
			);
			handleProjectUpdate(data, ACTION.EDIT);
		} catch (error) {
			console.log("An error occurred. Please try again.", error);
		}
	};
	const width = project?.tasks?.length ? "38.5em" : "44em";

	return (
		<>
			<HStack
				spacing={2}
				mt={1}
				className={`task_div_${index}`}
				whiteSpace={"pre-wrap"}
				alignItems={"center"}
				_hover={{ bg: "var(--phoneCall_bg_light)" }}
			>
				<Image height={"20px"} width={"20px"} objectFit="cover" src={projectImg} alt="file" />
				<CellAction
					width={width}
					name={project.projectName}
					totalTask={project?.tasks}
					totalTasks={project?.tasks?.length}
					handleEdit={handleEditProject}
					handleAdd={() => handleAddItem(project)}
					onSave={handleSave}
					handleToggle={() => handleProjectToggle(index)}
					isExpanded={isExpanded === index}
					handleDelete={() => setShowConfirmationPopUp(true)}
					type={"project"}
					noteIconClicked={noteIconClicked}
				/>
			</HStack>

			{showNote && (
				<AddNotes
					type={"project"}
					content={project}
					isOpen={showNote}
					setIsOpen={setShowNote}
					handleActionUpdate={(data) => handleProjectUpdate(data, ACTION.EDIT)}
				/>
			)}
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
								handleAddTask={() => handleAddItem(task)}
								isExpanded={isExpanded}
								handleTaskToggle={handleTaskToggle}
								handleSubTaskToggle={handleSubTaskToggle}
								managers={managers}
								company={company}
								noteIconClicked={noteIconClicked}
								handleSubTaskUpdate={handleSubTaskUpdate}
								handleTaskUpdate={handleTaskUpdate}
								handleProjectToggle={handleProjectToggle}
								handleInnerSubTaskUpdate={handleInnerSubTaskUpdate}
								fileId={project.fileId}
							/>
						</VStack>
					);
				})}

			{openEditProject && (
				<EditProject
					isOpen={openEditProject}
					onClose={() => setOpenEditProject(false)}
					project={project}
					managers={managers}
					handleProjectUpdate={(data) => {
						handleFileToggle();
						handleProjectUpdate(data, ACTION.EDIT);
					}}
				/>
			)}
			{openAddTask && (
				<AddNewTask
					isOpen={openAddTask}
					onClose={() => setOpenAddTask(false)}
					currentTask={currentTask}
					managers={managers}
					company={company}
					handleTaskUpdate={handleTaskUpdate}
				/>
			)}
			{showConfirmationPopUp && (
				<DeletePopUp
					headerTitle={"Delete Project"}
					textTitle={"Are you sure you want to delete the project?"}
					isOpen={showConfirmationPopUp}
					onClose={handleClose}
					onOpen={handleDelete}
				/>
			)}
		</>
	);
};

export default ProjectActionCell;
