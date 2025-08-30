import { Box, Flex, Table, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
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
	const [fileExpandedIndex, setFileExpandedIndex] = useState(null);
	const [projectExpandedIndex, setProjectExpandedIndex] = useState(null);
	const [subTaskExpandedIndex, setSubTaskExpandedIndex] = useState(null);
	const [taskExpandedIndex, setTaskExpandedIndex] = useState(null);

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
