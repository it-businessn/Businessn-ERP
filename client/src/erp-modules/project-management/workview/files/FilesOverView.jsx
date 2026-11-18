import { Box, Flex, Table, Tbody, Thead, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import SortableTh from "components/ui/table/SortableTh";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import useSortableData from "hooks/useSortableData";
import { useState } from "react";
import AssigneeCell from "../cell/AssigneeCell";
import DateCell from "../cell/DateCell";
import FileActionCell from "../cell/FileActionCell";
import PriorityCell from "../cell/PriorityCell";
import StatusCell from "../cell/StatusCell";

// TABLE-SORT: priority shows as bars, assignees as avatars; sort by rank / names
const PRIORITY_RANK = { high: 3, medium: 2 };
const sortByPriority = (row) =>
	row?.priority ? PRIORITY_RANK[String(row.priority).toLowerCase()] || 1 : null;
const sortByAssignees = (row) => row?.selectedAssignees?.join(", ");

const FILE_OVERVIEW_COLS = [
	{ name: "File name", sortKey: "fileName" },
	{ name: "Assignee(s)", sortKey: sortByAssignees },
	{ name: "Priority", sortKey: sortByPriority },
	{ name: "Due Date", sortKey: "dueDate" },
	{ name: "Status", sortKey: "status" },
];

const FilesOverView = ({
	files,
	handleFileUpdate,
	handleProjectUpdate,
	handleSubTaskUpdate,
	handleInnerSubTaskUpdate,
	handleTaskUpdate,
	managers,
	company,
	isDashboard,
}) => {
	const { sortedItems, sortConfig, requestSort } = useSortableData(files);
	const [fileExpandedIndex, setFileExpandedIndex] = useState(null);
	const [projectExpandedIndex, setProjectExpandedIndex] = useState(null);
	const [subTaskExpandedIndex, setSubTaskExpandedIndex] = useState(null);
	const [taskExpandedIndex, setTaskExpandedIndex] = useState(null);
	// TABLE-SORT: open rows are remembered by position, so close them when the order changes
	const handleSort = (key) => {
		setFileExpandedIndex(null);
		setProjectExpandedIndex(null);
		setTaskExpandedIndex(null);
		setSubTaskExpandedIndex(null);
		requestSort(key);
	};

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
		<Box overflow="auto" p={0} css={tabScrollCss} w="100%" h={"calc(100vh - 220px)"}>
			<Table color={"var(--nav_color)"} className="pm-overview" bg={"var(--primary_bg)"}>
				<Thead position="sticky" zIndex={3} top={-1}>
					<Tr display={"flex"} alignItems={"center"}>
						{FILE_OVERVIEW_COLS.map(({ name, sortKey }, index) => (
							<SortableTh
								sortKey={sortKey}
								sortConfig={sortConfig}
								onSort={handleSort}
								w={"100%"}
								key={name}
								fontWeight={"bolder"}
								fontSize={"xs"}
								p={"10px"}
							>
								<Flex alignItems={"center"} gap={0.5} w={index === 0 ? "55em" : "100%"}>
									{name}
								</Flex>
							</SortableTh>
						))}
					</Tr>
				</Thead>

				<Tbody>
					{(!files || files?.length === 0) && (
						<EmptyRowRecord data={files} colSpan={FILE_OVERVIEW_COLS.length} />
					)}
					{sortedItems?.map((file, fileIndex) => (
						<Tr
							key={file._id}
							display={"flex"}
							justifyContent={"start"}
							alignItems={"start"}
							bg={"var(--main_color)"}
						>
							<FileActionCell
								isDashboard={isDashboard}
								index={fileIndex}
								expandedIndex={fileExpandedIndex}
								isExpanded={projectExpandedIndex}
								isTaskExpanded={taskExpandedIndex}
								isSubExpanded={subTaskExpandedIndex}
								managers={managers}
								file={file}
								company={company}
								handleFileUpdate={handleFileUpdate}
								handleProjectUpdate={handleProjectUpdate}
								handleSubTaskUpdate={handleSubTaskUpdate}
								handleTaskUpdate={handleTaskUpdate}
								handleFileToggle={handleFileToggle}
								handleProjectToggle={handleProjectToggle}
								handleSubTaskToggle={handleSubTaskToggle}
								handleTaskToggle={handleTaskToggle}
								handleInnerSubTaskUpdate={handleInnerSubTaskUpdate}
							/>
							<AssigneeCell
								isDashboard={isDashboard}
								index={fileIndex}
								expandedIndex={fileExpandedIndex}
								isExpanded={projectExpandedIndex}
								isTaskExpanded={taskExpandedIndex}
								isSubExpanded={subTaskExpandedIndex}
								file={file}
							/>
							<PriorityCell
								isDashboard={isDashboard}
								index={fileIndex}
								expandedIndex={fileExpandedIndex}
								isExpanded={projectExpandedIndex}
								isTaskExpanded={taskExpandedIndex}
								isSubExpanded={subTaskExpandedIndex}
								file={file}
							/>
							<DateCell
								isDashboard={isDashboard}
								date={"dueDate"}
								index={fileIndex}
								expandedIndex={fileExpandedIndex}
								isExpanded={projectExpandedIndex}
								isTaskExpanded={taskExpandedIndex}
								isSubExpanded={subTaskExpandedIndex}
								file={file}
							/>
							<StatusCell
								isDashboard={isDashboard}
								index={fileIndex}
								expandedIndex={fileExpandedIndex}
								isExpanded={projectExpandedIndex}
								isTaskExpanded={taskExpandedIndex}
								isSubExpanded={subTaskExpandedIndex}
								file={file}
							/>
						</Tr>
					))}
				</Tbody>
			</Table>
		</Box>
	);
};
export default FilesOverView;
