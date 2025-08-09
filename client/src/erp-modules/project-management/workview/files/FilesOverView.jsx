import { Flex, Table, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import { useState } from "react";
import { FaSort } from "react-icons/fa";
import AssigneeCell from "../cell/AssigneeCell";
import DateCell from "../cell/DateCell";
import FileProjectActionCell from "../cell/FileProjectActionCell";
import PriorityCell from "../cell/PriorityCell";
import StatusCell from "../cell/StatusCell";

const FILE_OVERVIEW_COLS = [
	{ name: "File name" },
	{ name: "Assignee(s)" },
	{ name: "Priority" },
	{ name: "Due Date" },
	{ name: "Status" },
];

const FilesOverView = ({ files, managers, company, setRefresh }) => {
	const [file, setFile] = useState(null);
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
	return (
		<Table color={"var(--nav_color)"} bg={"var(--primary_bg)"}>
			<Thead>
				<Tr display={"flex"} alignItems={"center"}>
					{FILE_OVERVIEW_COLS.map(({ name }) => (
						<Th w={"100%"} key={name} fontWeight={"bolder"} fontSize={"xs"} p={"10px"} pl={"1em"}>
							<Flex alignItems={"center"} gap={0.5}>
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
						<FileProjectActionCell
							expandedIndex={fileExpandedIndex}
							handleSubTaskToggle={handleSubTaskToggle}
							handleTaskToggle={handleTaskToggle}
							handleToggle={handleFileToggle}
							index={fileIndex}
							isExpanded={projectExpandedIndex}
							isSubExpanded={subTaskExpandedIndex}
							managers={managers}
							file={file}
							fileId={fileId}
							setFile={setFile}
							setFileId={setFileId}
							setRefresh={setRefresh}
							company={company}
						/>
						<AssigneeCell
							expandedIndex={fileExpandedIndex}
							index={fileIndex}
							isExpanded={projectExpandedIndex}
							isSubExpanded={subTaskExpandedIndex}
							project={file}
						/>
						<PriorityCell
							expandedIndex={fileExpandedIndex}
							index={fileIndex}
							isExpanded={projectExpandedIndex}
							isSubExpanded={subTaskExpandedIndex}
							project={file}
						/>
						<DateCell
							date={"dueDate"}
							expandedIndex={fileExpandedIndex}
							index={fileIndex}
							isExpanded={projectExpandedIndex}
							isSubExpanded={subTaskExpandedIndex}
							project={file}
						/>
						<StatusCell
							expandedIndex={fileExpandedIndex}
							index={fileIndex}
							isExpanded={projectExpandedIndex}
							isSubExpanded={subTaskExpandedIndex}
							project={file}
						/>
					</Tr>
				))}
			</Tbody>
		</Table>
	);
};
export default FilesOverView;
