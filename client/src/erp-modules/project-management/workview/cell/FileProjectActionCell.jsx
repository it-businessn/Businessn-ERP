import { HStack, Image, Td, VStack } from "@chakra-ui/react";
import { useState } from "react";
import fileImg from "../../../../assets/file.png";
import AddNewProject from "../project/AddNewProject";
import EditProjectFile from "../project/EditProjectFile";
import ActionItem from "./ActionItem";
import ProjectActionCell from "./ProjectActionCell";

const FileProjectActionCell = ({
	file,
	index,
	handleToggle,
	expandedIndex,
	isExpanded,
	isSubExpanded,
	handleTaskToggle,
	handleSubTaskToggle,
	setFile,
	setFileId,
	fileId,
	setRefresh,
	managers,
	company,
}) => {
	const [openEditProject, setOpenEditProject] = useState(false);
	const [openAddProject, setOpenAddProject] = useState(false);

	const handleEditProject = (project, projectId) => {
		setOpenEditProject(true);
		setFile(project);
		setFileId(projectId);
	};

	const handleAddTask = (project, projectId) => {
		setOpenAddProject(true);
		setFile(project);
		setFileId(projectId);
	};

	return (
		<Td w="100%" fontSize={"xs"} py={0}>
			<VStack alignItems={"start"} spacing={0} w={"100%"} ml={"-1.5em"}>
				<HStack spacing={2} alignItems={"start"}>
					<Image height={"20px"} width={"20px"} objectFit="cover" src={fileImg} alt="file" />
					<ActionItem
						data={file}
						name={file.fileName}
						totalTask={file?.projects}
						totalTasks={file?.totalProjects}
						handleEditProject={() => handleEditProject(file, file._id)}
						handleAddTask={() => handleAddTask(file, file._id)}
						handleToggle={() => handleToggle(index)}
						index={index}
						expandedIndex={expandedIndex}
						isExpanded={expandedIndex === index}
						// handleDelete={() => handleDelete(project, project._id)}
						isProject
						type={"file"}
						setRefresh={setRefresh}
					/>
				</HStack>
				{expandedIndex === index &&
					file?.projects?.map((project, taskIndex) => {
						return (
							<VStack key={project._id} w={"100%"} alignItems={"flex-start"} ml={"1em"}>
								<ProjectActionCell
									taskIndex={taskIndex}
									isSubExpanded={isSubExpanded}
									project={project}
									handleAddTask={() => handleAddTask(project, project._id)}
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
			</VStack>
			{openEditProject && (
				<EditProjectFile
					isOpen={openEditProject}
					onClose={() => setOpenEditProject(false)}
					project={file}
					projectId={fileId}
					setRefresh={setRefresh}
					managers={managers}
				/>
			)}
			{openAddProject && (
				<AddNewProject
					isOpen={openAddProject}
					onClose={() => setOpenAddProject(false)}
					file={file}
					fileId={fileId}
					setRefresh={setRefresh}
					managers={managers}
					company={company}
				/>
			)}
		</Td>
	);
};

export default FileProjectActionCell;
