import { HStack, Image, Td, VStack } from "@chakra-ui/react";
import { useState } from "react";
import fileImg from "../../../../assets/file.png";
import EditFile from "../files/EditFile";
import AddNewProject from "../project/AddNewProject";
import CellAction from "./CellAction";
import ProjectActionCell from "./ProjectActionCell";

const FileActionCell = ({
	file,
	index,
	handleToggle,
	expandedIndex,
	isExpanded,
	isTaskExpanded,
	isSubExpanded,
	handleTaskToggle,
	handleSubTaskToggle,
	handleProjectToggle,
	setFile,
	setFileId,
	fileId,
	setRefresh,
	managers,
	company,
}) => {
	const [openEditFile, setOpenEditFile] = useState(false);
	const [openAddFile, setOpenAddFile] = useState(false);

	const handleEditFile = (project, projectId) => {
		setOpenEditFile(true);
		setFile(project);
		setFileId(projectId);
	};

	const handleAddTask = (project, projectId) => {
		setOpenAddFile(true);
		setFile(project);
		setFileId(projectId);
	};

	return (
		<Td w="100%" fontSize={"xs"} py={0}>
			<VStack alignItems={"start"} spacing={0} w={"100%"} ml={"-1.5em"}>
				<HStack spacing={2} alignItems={"center"}>
					<Image height={"2em"} width={"2em"} objectFit="cover" src={fileImg} alt="file" />
					<CellAction
						textSize="lg"
						width="25em"
						data={file}
						name={file.fileName}
						totalTask={file?.projects}
						totalTasks={file?.totalProjects}
						handleEdit={() => handleEditFile(file, file._id)}
						handleAdd={() => handleAddTask(file, file._id)}
						handleToggle={() => handleToggle(index)}
						index={index}
						expandedIndex={expandedIndex}
						isExpanded={expandedIndex === index}
						// handleDelete={() => handleDelete(project, project._id)}
						type={"file"}
						isFile
						setRefresh={setRefresh}
					/>
				</HStack>
				{expandedIndex === index &&
					file?.projects?.map((project, project_index) => {
						return (
							<VStack
								key={project._id}
								w={"100%"}
								alignItems={"flex-start"}
								// _hover={{ bg: "var(--phoneCall_bg_light)" }}
							>
								<ProjectActionCell
									index={project_index}
									project={project}
									handleAddTask={() => handleAddTask(project, project._id)}
									isExpanded={isExpanded}
									isTaskExpanded={isTaskExpanded}
									isSubExpanded={isSubExpanded}
									handleProjectToggle={handleProjectToggle}
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
			{openEditFile && (
				<EditFile
					isOpen={openEditFile}
					onClose={() => setOpenEditFile(false)}
					file={file}
					fileId={fileId}
					setRefresh={setRefresh}
					managers={managers}
				/>
			)}
			{openAddFile && (
				<AddNewProject
					isOpen={openAddFile}
					onClose={() => setOpenAddFile(false)}
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

export default FileActionCell;
