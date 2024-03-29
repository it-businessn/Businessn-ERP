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
import { useEffect, useState } from "react";
import { FaSort } from "react-icons/fa";
import AddProject from "./AddProject";
import AssigneeCell from "./cell/AssigneeCell";
import DateCell from "./cell/DateCell";
import ManagerCell from "./cell/ManagerCell";
import PriorityCell from "./cell/PriorityCell";
import ProjectActionCell from "./cell/ProjectActionCell";
import StatusCell from "./cell/StatusCell";

const ProjectTable = ({ data, setRefresh, managers }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [projects, setProjects] = useState([]);

	const [openEditTask, setOpenEditTask] = useState(false);
	const [task, setTask] = useState(null);
	const [project, setProject] = useState(null);
	const [projectId, setProjectId] = useState(null);
	const [expandedIndex, setExpandedIndex] = useState(null);
	const [assignees, setAssignees] = useState(null);

	useEffect(() => {
		setProjects(data);
	}, [data]);

	const handleAddProject = () => {
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

	const PROJECT_CELLS = [
		{ name: "Project name", width: "400px" },
		{ name: "Assignee(s)", width: "130px" },
		{ name: "Priority", width: "100px" },
		{ name: "Start Date", width: "110px" },
		{ name: "Due Date", width: "110px" },
		{ name: "Manager", width: "130px" },
		{ name: "Last Updated", width: "110px" },
		{ name: "Status", width: "120px" },
	];
	return (
		<>
			<Flex>
				<Text fontWeight="bold">Projects</Text>
				<Spacer />
				<Button
					onClick={handleAddProject}
					color={"brand.100"}
					bg={"brand.primary_button_bg"}
					borderRadius={"8px"}
					size={"sm"}
					px={"2em"}
				>
					Add new project
				</Button>
			</Flex>

			<AddProject
				managers={managers}
				isOpen={isOpen}
				onClose={onClose}
				setRefresh={setRefresh}
			/>
			<Table color={"brand.nav_color"} bg={"brand.primary_bg"}>
				<Thead>
					<Tr display={"flex"} alignItems={"center"}>
						{PROJECT_CELLS.map(({ name, width }) => (
							<Th
								key={name}
								w={width}
								fontWeight={"bolder"}
								fontSize={"xs"}
								p={"10px"}
								pl={"1em"}
							>
								<Flex alignItems={"center"} gap={0.5}>
									{name}
									<FaSort sx={{ width: "5px" }} />
								</Flex>
							</Th>
						))}
					</Tr>
				</Thead>
				<Tbody>
					{projects?.map((project, index) => (
						<Tr
							key={project._id}
							className={`parent_div_${index}`}
							display={"flex"}
							justifyContent={"start"}
						>
							<ProjectActionCell
								expandedIndex={expandedIndex}
								handleSubTaskToggle={handleSubTaskToggle}
								handleTaskToggle={handleTaskToggle}
								handleToggle={handleToggle}
								index={index}
								isExpanded={isTaskExpandedIndex}
								isSubExpanded={isSubExpandedIndex}
								managers={managers}
								project={project}
								projectId={projectId}
								setProject={setProject}
								setProjectId={setProjectId}
								setRefresh={setRefresh}
							/>
							<AssigneeCell
								expandedIndex={expandedIndex}
								index={index}
								isExpanded={isTaskExpandedIndex}
								isSubExpanded={isSubExpandedIndex}
								project={project}
							/>
							<PriorityCell
								expandedIndex={expandedIndex}
								index={index}
								isExpanded={isTaskExpandedIndex}
								isSubExpanded={isSubExpandedIndex}
								project={project}
							/>
							<DateCell
								date={"createdOn"}
								expandedIndex={expandedIndex}
								index={index}
								isExpanded={isTaskExpandedIndex}
								isSubExpanded={isSubExpandedIndex}
								project={project}
							/>
							<DateCell
								date={"dueDate"}
								expandedIndex={expandedIndex}
								index={index}
								isExpanded={isTaskExpandedIndex}
								isSubExpanded={isSubExpandedIndex}
								project={project}
							/>
							<ManagerCell
								expandedIndex={expandedIndex}
								index={index}
								isExpanded={isTaskExpandedIndex}
								isSubExpanded={isSubExpandedIndex}
								project={project}
							/>
							<DateCell
								date={"updatedOn"}
								expandedIndex={expandedIndex}
								index={index}
								isExpanded={isTaskExpandedIndex}
								isSubExpanded={isSubExpandedIndex}
								project={project}
							/>
							<StatusCell
								expandedIndex={expandedIndex}
								index={index}
								isExpanded={isTaskExpandedIndex}
								isSubExpanded={isSubExpandedIndex}
								project={project}
							/>
						</Tr>
					))}
				</Tbody>
			</Table>
		</>
	);
};

export default ProjectTable;
