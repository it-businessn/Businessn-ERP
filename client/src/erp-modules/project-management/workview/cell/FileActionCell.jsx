import { HStack, Image, Td, VStack } from "@chakra-ui/react";
import { useState } from "react";
import fileImg from "../../../../assets/file.png";
import EditFile from "../files/EditFile";
import AddNewProject from "../project/AddNewProject";
import AddNotes from "./AddNotes";
import CellAction from "./CellAction";
import ProjectActionCell from "./ProjectActionCell";

const FileActionCell = ({
	file,
	index,
	handleFileToggle,
	expandedIndex,
	isExpanded,
	isTaskExpanded,
	isSubExpanded,
	handleTaskToggle,
	handleSubTaskToggle,
	handleProjectToggle,
	setFileId,
	fileId,
	managers,
	company,
	handleFileUpdate,
	handleProjectUpdate,
}) => {
	const [openEditFile, setOpenEditFile] = useState(false);
	const [openAddFile, setOpenAddFile] = useState(false);
	const [showNote, setShowNote] = useState(false);

	const handleEditFile = () => {
		setOpenEditFile(true);
		setFileId(file._id);
	};
	const handleAddTask = (projectId) => {
		setOpenAddFile(true);
		setFileId(projectId);
	};
	const width = file?.projects?.length ? "25em" : "29em";

	const noteIconClicked = () => {
		setShowNote(true);
	};
	return (
		<Td w="100%" fontSize={"xs"} py={0}>
			<VStack alignItems={"start"} spacing={0} w={"100%"} ml={"-1.5em"}>
				<HStack spacing={2} alignItems={"center"}>
					<Image height={"2em"} width={"2em"} objectFit="cover" src={fileImg} alt="file" />
					<CellAction
						textSize="lg"
						width={width}
						name={file.fileName}
						totalTask={file?.projects}
						totalTasks={file?.projects?.length}
						handleEdit={handleEditFile}
						handleAdd={() => handleAddTask(file._id)}
						handleToggle={() => handleFileToggle(index)}
						noteIconClicked={noteIconClicked}
						index={index}
						expandedIndex={expandedIndex}
						isExpanded={expandedIndex === index}
						// handleDelete={() => handleDelete(project, project._id)}
						type={"file"}
						isFile
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
									handleAddTask={() => handleAddTask(project._id)}
									noteIconClicked={noteIconClicked}
									isExpanded={isExpanded}
									isTaskExpanded={isTaskExpanded}
									isSubExpanded={isSubExpanded}
									handleProjectToggle={handleProjectToggle}
									handleTaskToggle={handleTaskToggle}
									handleSubTaskToggle={handleSubTaskToggle}
									managers={managers}
									company={company}
									handleFileToggle={handleFileToggle}
									handleProjectUpdate={handleProjectUpdate}
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
					managers={managers}
					handleFileUpdate={handleFileUpdate}
				/>
			)}
			{openAddFile && (
				<AddNewProject
					isOpen={openAddFile}
					onClose={() => setOpenAddFile(false)}
					file={file}
					fileId={fileId}
					managers={managers}
					company={company}
				/>
			)}

			{showNote && (
				<AddNotes
					type={"file"}
					content={file}
					isOpen={showNote}
					setIsOpen={setShowNote}
					handleFileUpdate={handleFileUpdate}
				/>
			)}
		</Td>
	);
};

export default FileActionCell;
