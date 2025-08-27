import { HStack, Image, Td, VStack } from "@chakra-ui/react";
import { useState } from "react";
import fileImg from "../../../../assets/file.png";
import AddFileProject from "../files/AddFileProject";
import EditFile from "../files/EditFile";
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
	managers,
	company,
	handleFileUpdate,
	handleProjectUpdate,
	handleSubTaskUpdate,
	handleTaskUpdate,
}) => {
	const [openEditFile, setOpenEditFile] = useState(false);
	const [openAddFile, setOpenAddFile] = useState(false);
	const [showNote, setShowNote] = useState(false);

	const handleEditFile = () => {
		setOpenEditFile(true);
	};

	const handleAddItem = () => {
		setOpenAddFile(true);
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
						handleAdd={handleAddItem}
						handleToggle={() => handleFileToggle(index)}
						noteIconClicked={noteIconClicked}
						index={index}
						expandedIndex={expandedIndex}
						isExpanded={expandedIndex === index}
						type={"file"}
						isFile
					/>
				</HStack>
				{expandedIndex === index &&
					file?.projects?.map((project, project_index) => {
						return (
							<VStack key={project._id} w={"100%"} alignItems={"start"}>
								<ProjectActionCell
									index={project_index}
									project={project}
									handleAddTask={handleAddItem}
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
									handleSubTaskUpdate={handleSubTaskUpdate}
									handleTaskUpdate={handleTaskUpdate}
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
					managers={managers}
					handleFileUpdate={handleFileUpdate}
				/>
			)}
			{openAddFile && (
				<AddFileProject
					isOpen={openAddFile}
					onClose={() => setOpenAddFile(false)}
					file={file}
					managers={managers}
					company={company}
					handleProjectUpdate={handleProjectUpdate}
				/>
			)}

			{showNote && (
				<AddNotes
					type={"file"}
					content={file}
					isOpen={showNote}
					setIsOpen={setShowNote}
					handleActionUpdate={handleFileUpdate}
				/>
			)}
		</Td>
	);
};

export default FileActionCell;
