import { HStack, Image, VStack } from "@chakra-ui/react";
import DeletePopUp from "components/ui/modal/DeletePopUp";
import { useState } from "react";
import ProjectService from "services/ProjectService";
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
	const [openEditProject, setOpenEditProject] = useState(false);
	const [openAddTask, setOpenAddTask] = useState(false);
	const [currentTask, setCurrentTask] = useState(null);
	const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);

	const handleClose = () => {
		setShowConfirmationPopUp(false);
	};

	const handleEditProject = () => {
		setOpenEditProject(true);
	};

	const handleAddTask = (task, taskId) => {
		setOpenAddTask(true);
		setCurrentTask(task);
	};

	const handleDelete = async () => {
		try {
			await ProjectService.deleteProject(project, project._id);
			setRefresh((prev) => !prev);
			setShowConfirmationPopUp(false);
		} catch (error) {
			console.error("Error updating task status:", error);
		}
	};

	const handleSave = async (updatedData) => {
		try {
			await ProjectService.updateProjectName({ projectName: updatedData }, project._id);
		} catch (error) {
			console.log("An error occurred. Please try again.", error);
		}
	};
	const width = project?.tasks?.length ? "38.5em" : "44em";

	return (
		<>
			<HStack
				spacing={2}
				mt={2}
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
					handleAdd={() => handleAddTask(project, project._id)}
					onSave={handleSave}
					handleToggle={() => handleProjectToggle(index)}
					isExpanded={isExpanded === index}
					handleDelete={() => {
						setShowConfirmationPopUp(true);
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

			{openEditProject && (
				<EditProject
					isOpen={openEditProject}
					onClose={() => setOpenEditProject(false)}
					project={project}
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
