import { Box, HStack, Td, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { CircularProgressBarCell } from "utils";
import AddNewProjectTask from "../AddNewProjectTask";
import EditProject from "../EditProject";
import ActionItem from "./ActionItem";
import TaskActionCell from "./TaskActionCell";

const ProjectActionCell = ({
	project,
	index,
	handleToggle,
	expandedIndex,
	isExpanded,
	isSubExpanded,
	handleTaskToggle,
	handleSubTaskToggle,
	setProject,
	setProjectId,
	projectId,
	setRefresh,
	managers,
}) => {
	const [openEditProject, setOpenEditProject] = useState(false);
	const [openAddTask, setOpenAddTask] = useState(false);

	const handleEditProject = (project, projectId) => {
		setOpenEditProject(true);
		setProject(project);
		setProjectId(projectId);
	};

	const handleAddTask = (project, projectId) => {
		setOpenAddTask(true);
		setProject(project);
		setProjectId(projectId);
	};

	const handleDelete = (index) => {};
	return (
		<Td p={"0.5em"} fontSize={"xs"} w={"400px"} py={0}>
			<VStack alignItems={"start"} spacing={0} w={"100%"} ml={"-1.5em"}>
				<HStack spacing={2}>
					<Box position="relative" width="100px" height="100px">
						<CircularProgressBarCell
							size="100px"
							completionPercentage={
								project.completionPercent
									? Number.isInteger(project.completionPercent)
										? project.completionPercent
										: parseFloat(project.completionPercent).toFixed(2)
									: 0
							}
						/>
					</Box>
					<ActionItem
						data={project}
						name={project.name}
						totalTask={project?.tasks}
						totalTasks={project?.totalTasks}
						handleEditProject={() => handleEditProject(project, project._id)}
						handleAddTask={() => handleAddTask(project, project._id)}
						handleToggle={() => handleToggle(index)}
						index={index}
						expandedIndex={expandedIndex}
						isExpanded={expandedIndex === index}
						handleDelete={() => handleDelete(project, project._id)}
						isProject
						type={"project"}
						setRefresh={setRefresh}
					/>
				</HStack>
				{expandedIndex === index &&
					project?.tasks?.map((task, taskIndex) => {
						return (
							<VStack
								key={task._id}
								w={"100%"}
								alignItems={"flex-start"}
								ml={"3em"}
							>
								<TaskActionCell
									taskIndex={taskIndex}
									isSubExpanded={isSubExpanded}
									task={task}
									handleAddTask={() => handleAddTask(task, task._id)}
									isExpanded={isExpanded}
									handleTaskToggle={handleTaskToggle}
									handleSubTaskToggle={handleSubTaskToggle}
									setRefresh={setRefresh}
									managers={managers}
								/>
							</VStack>
						);
					})}
			</VStack>
			{openEditProject && (
				<EditProject
					isOpen={openEditProject}
					onClose={() => setOpenEditProject(false)}
					project={project}
					projectId={projectId}
					setRefresh={setRefresh}
					managers={managers}
				/>
			)}
			{openAddTask && (
				<AddNewProjectTask
					isOpen={openAddTask}
					onClose={() => setOpenAddTask(false)}
					project={project}
					projectId={projectId}
					setRefresh={setRefresh}
					managers={managers}
				/>
			)}
		</Td>
	);
};

export default ProjectActionCell;
