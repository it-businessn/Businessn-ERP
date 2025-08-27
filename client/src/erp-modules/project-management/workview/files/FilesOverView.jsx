import { Flex, Table, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import { useState } from "react";
import { FaSort } from "react-icons/fa";
import AssigneeCell from "../cell/AssigneeCell";
import DateCell from "../cell/DateCell";
import FileActionCell from "../cell/FileActionCell";
import PriorityCell from "../cell/PriorityCell";
import StatusCell from "../cell/StatusCell";

const FILE_OVERVIEW_COLS = [
	{ name: "File name" },
	{ name: "Assignee(s)" },
	{ name: "Priority" },
	{ name: "Due Date" },
	{ name: "Status" },
];

const FilesOverView = ({ files, setFiles, managers, company }) => {
	const [fileId, setFileId] = useState(null);
	const [fileExpandedIndex, setFileExpandedIndex] = useState(null);
	const [projectExpandedIndex, setProjectExpandedIndex] = useState(null);
	const [taskExpandedIndex, setTaskExpandedIndex] = useState(null);
	const [subTaskExpandedIndex, setSubTaskExpandedIndex] = useState(null);

	const handleFileToggle = (index) => {
		setFileExpandedIndex(fileExpandedIndex === index ? null : index);
	};

	const handleProjectToggle = (index) => {
		setProjectExpandedIndex(projectExpandedIndex === index ? null : index);
	};

	const handleTaskToggle = (index) => {
		setTaskExpandedIndex(taskExpandedIndex === index ? null : index);
	};

	const handleSubTaskToggle = (index) => {
		setSubTaskExpandedIndex(subTaskExpandedIndex === index ? null : index);
	};

	const handleProjectUpdate = (projectData) => {
		const {
			projectName,
			selectedAssigneesId,
			notes,
			priority,
			selectedAssignees,
			startDate,
			dueDate,
			status,
		} = projectData;

		const updatedData = files?.map((file) =>
			file._id === projectData.fileId
				? {
						...file,
						projects: file.projects?.map((project) => {
							return project._id === projectData._id
								? {
										...project,
										projectName,
										selectedAssignees,
										selectedAssigneesId,
										priority,
										dueDate,
										notes,
										startDate,
										status,
								  }
								: project;
						}),
				  }
				: file,
		);
		setFiles(updatedData);
	};

	const handleFileUpdate = (fileData) => {
		const {
			fileName,
			managerId,
			managerName,
			notes,
			priority,
			selectedAssignees,
			startDate,
			dueDate,
			status,
			_id,
		} = fileData;
		const updatedData = files?.map((file) =>
			file._id === _id
				? {
						...file,
						fileName,
						managerId,
						managerName,
						notes,
						priority,
						selectedAssignees,
						startDate,
						status,
						dueDate,
				  }
				: file,
		);
		setFiles(updatedData);
	};
	return (
		<Table color={"var(--nav_color)"} bg={"var(--primary_bg)"}>
			<Thead>
				<Tr display={"flex"} alignItems={"center"}>
					{FILE_OVERVIEW_COLS.map(({ name }, index) => (
						<Th w={"100%"} key={name} fontWeight={"bolder"} fontSize={"xs"} p={"10px"}>
							<Flex alignItems={"center"} gap={0.5} w={index === 0 ? "55em" : "100%"}>
								{name}
								<FaSort sx={{ width: "5px" }} />
							</Flex>
						</Th>
					))}
				</Tr>
			</Thead>

			<Tbody>
				{(!files || files?.length === 0) && (
					<EmptyRowRecord data={files} colSpan={FILE_OVERVIEW_COLS.length} />
				)}
				{files?.map((file, fileIndex) => (
					<Tr key={file._id} display={"flex"} justifyContent={"start"} alignItems={"start"} mb={1}>
						<FileActionCell
							expandedIndex={fileExpandedIndex}
							handleSubTaskToggle={handleSubTaskToggle}
							handleProjectToggle={handleProjectToggle}
							handleTaskToggle={handleTaskToggle}
							handleFileToggle={handleFileToggle}
							index={fileIndex}
							isExpanded={projectExpandedIndex}
							isTaskExpanded={taskExpandedIndex}
							isSubExpanded={subTaskExpandedIndex}
							managers={managers}
							file={file}
							fileId={fileId}
							setFileId={setFileId}
							company={company}
							handleFileUpdate={handleFileUpdate}
							handleProjectUpdate={handleProjectUpdate}
						/>
						<AssigneeCell
							expandedIndex={fileExpandedIndex}
							index={fileIndex}
							isExpanded={projectExpandedIndex}
							isTaskExpanded={taskExpandedIndex}
							isSubExpanded={subTaskExpandedIndex}
							// project={file}
						/>
						<PriorityCell
							expandedIndex={fileExpandedIndex}
							index={fileIndex}
							isExpanded={projectExpandedIndex}
							isSubExpanded={taskExpandedIndex}
							// project={file}
						/>
						<DateCell
							date={"dueDate"}
							expandedIndex={fileExpandedIndex}
							index={fileIndex}
							isExpanded={projectExpandedIndex}
							isTaskExpanded={taskExpandedIndex}
							isSubExpanded={subTaskExpandedIndex}
							project={file}
						/>
						<StatusCell
							expandedIndex={fileExpandedIndex}
							index={fileIndex}
							isExpanded={projectExpandedIndex}
							isTaskExpanded={taskExpandedIndex}
							isSubExpanded={subTaskExpandedIndex}
							// project={file}
						/>
					</Tr>
				))}
			</Tbody>
		</Table>
	);
};
export default FilesOverView;
