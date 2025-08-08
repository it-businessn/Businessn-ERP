import {
	Button,
	Flex,
	Spacer,
	Table,
	Tbody,
	Text,
	Th,
	Thead,
	Tr,
	useDisclosure,
} from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import { useState } from "react";
import { FaSort } from "react-icons/fa";
import AddFile from "./AddFile";
import AssigneeCell from "./cell/AssigneeCell";
import DateCell from "./cell/DateCell";
import FileProjectActionCell from "./cell/FileProjectActionCell";
import PriorityCell from "./cell/PriorityCell";
import StatusCell from "./cell/StatusCell";
import { PROJECT_TABLE_CELLS } from "./data";

const ProjectTable = ({ files, setRefresh, managers, company }) => {
	const FILE_OVERVIEW_COLS = [
		{ name: "File name" },
		{ name: "Assignee(s)" },
		{ name: "Priority" },
		{ name: "Due Date" },
		{ name: "Status" },
	];
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [openEditTask, setOpenEditTask] = useState(false);
	const [task, setTask] = useState(null);
	const [file, setFile] = useState(null);
	const [fileId, setFileId] = useState(null);
	const [expandedIndex, setExpandedIndex] = useState(null);
	const [assignees, setAssignees] = useState(null);

	const handleAddFile = () => {
		onOpen();
	};

	const handleToggle = (index) => {
		setExpandedIndex(expandedIndex === index ? null : index);
	};

	const [isSubExpandedIndex, setSubExpandedIndex] = useState(null);

	const handleSubTaskToggle = (index) => {
		setSubExpandedIndex(isSubExpandedIndex === index ? null : index);
	};

	const [isTaskExpandedIndex, setTaskExpandedIndex] = useState(null);
	const handleTaskToggle = (index) => {
		setTaskExpandedIndex(isTaskExpandedIndex === index ? null : index);
	};

	return (
		<>
			<Flex>
				<Text fontWeight="bold">Files</Text>
				<Spacer />
				<Button
					onClick={handleAddFile}
					color={"var(--main_color)"}
					bg={"var(--primary_button_bg)"}
					borderRadius={"8px"}
					size={"sm"}
					px={"2em"}
				>
					Add new file
				</Button>
			</Flex>

			{isOpen && (
				<AddFile
					managers={managers}
					isOpen={isOpen}
					onClose={onClose}
					setRefresh={setRefresh}
					company={company}
				/>
			)}
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
						<EmptyRowRecord data={files} colSpan={PROJECT_TABLE_CELLS.length} />
					)}
					{files?.map((file, index) => (
						<Tr
							key={file._id}
							className={`parent_div_${index}`}
							display={"flex"}
							justifyContent={"start"}
							alignItems={"center"}
							mb={1}
						>
							<FileProjectActionCell
								expandedIndex={expandedIndex}
								handleSubTaskToggle={handleSubTaskToggle}
								handleTaskToggle={handleTaskToggle}
								handleToggle={handleToggle}
								index={index}
								isExpanded={isTaskExpandedIndex}
								isSubExpanded={isSubExpandedIndex}
								managers={managers}
								file={file}
								fileId={fileId}
								setFile={setFile}
								setFileId={setFileId}
								setRefresh={setRefresh}
								company={company}
							/>
							<AssigneeCell
								expandedIndex={expandedIndex}
								index={index}
								isExpanded={isTaskExpandedIndex}
								isSubExpanded={isSubExpandedIndex}
								project={file}
							/>
							<PriorityCell
								expandedIndex={expandedIndex}
								index={index}
								isExpanded={isTaskExpandedIndex}
								isSubExpanded={isSubExpandedIndex}
								project={file}
							/>
							<DateCell
								date={"dueDate"}
								expandedIndex={expandedIndex}
								index={index}
								isExpanded={isTaskExpandedIndex}
								isSubExpanded={isSubExpandedIndex}
								project={file}
							/>
							<StatusCell
								expandedIndex={expandedIndex}
								index={index}
								isExpanded={isTaskExpandedIndex}
								isSubExpanded={isSubExpandedIndex}
								project={file}
							/>
						</Tr>
					))}
				</Tbody>
			</Table>
		</>
	);
};

export default ProjectTable;
