import {
	Avatar,
	Box,
	Checkbox,
	Collapse,
	HStack,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import { tasksData } from "data";
import React, { useEffect, useState } from "react";
import { FaCaretDown, FaFilter } from "react-icons/fa";
import { generateLighterShade } from "utils";

const TaskTable = ({ filter }) => {
	const [tasks, setTasks] = useState(tasksData);
	// const [filters, setFilters] = useState({
	// 	taskName: "",
	// 	assignee: "",
	// 	projectName: "",
	// 	status: "",
	// });
	// const handleFilterChange = (event, columnName) => {
	// 	console.log(`Filtering ${columnName} by ${event.target.value}`);
	// };
	const [expandedIndex, setExpandedIndex] = useState(null);
	const handleToggle = (index) => {
		setExpandedIndex(expandedIndex === index ? -1 : index);
	};
	useEffect(() => {
		if (filter) {
			setTasks(tasksData.filter((task) => task.checklist));
		}
	}, [filter]);
	return (
		<Table variant="simple">
			<Thead>
				<Tr>
					<Th>
						<HStack>
							<Text>Task Name</Text>
							<FaFilter />
							{/* <Input
								size="sm"
								placeholder="Filter"
								value={filters.taskName}
								onChange={(e) => handleFilterChange("taskName", e.target.value)}
							/> */}
						</HStack>
					</Th>
					<Th>
						<HStack>
							<Text>Assignee </Text>

							<FaFilter />
							{/* <Select
								size="sm"
								placeholder="Filter"
								value={filters.assignee}
								onChange={(e) => handleFilterChange("assignee", e.target.value)}
							>
							</Select> */}
						</HStack>
					</Th>
					<Th>
						<HStack>
							<Text> Project Name </Text>

							<FaFilter />
							{/* <Input
								size="sm"
								placeholder="Filter"
								value={filters.projectName}
								onChange={(e) =>
									handleFilterChange("projectName", e.target.value)
								}
							/> */}
						</HStack>
					</Th>
					<Th>
						<HStack>
							<Text> Last Updated </Text>

							<FaFilter />
							{/* <Input
								size="sm"
								type="date"
								placeholder="Filter"
								value={filters.lastUpdated}
								onChange={(e) =>
									handleFilterChange("lastUpdated", e.target.value)
								}
							/> */}
						</HStack>
					</Th>
					<Th>
						<HStack>
							<Text>Task Status </Text>

							<FaFilter />
							{/* <Select
								size="sm"
								placeholder="Filter"
								value={filters.status}
								onChange={(e) => handleFilterChange("status", e.target.value)}
							>
							</Select> */}
						</HStack>
						{/* <Select
							placeholder="Task Status"
							onChange={(e) => handleFilterChange(e, "taskStatus")}
						>
							<option value="In Progress">In Progress</option>
							<option value="Completed">Completed</option>
						</Select> */}
					</Th>
				</Tr>
			</Thead>
			<Tbody>
				{tasks.map((task, index) => (
					<React.Fragment key={task.taskName}>
						<Tr key={task.taskName}>
							<Td
								onClick={() => handleToggle(index)}
								cursor={task?.checklist ? "pointer" : "default"}
							>
								<HStack spacing={3}>
									<Text>{task.taskName}</Text>
									{task?.checklist && <FaCaretDown />}
								</HStack>
							</Td>
							<Td>
								<HStack>
									{task.assignees.map((assignee) => (
										<Avatar
											key={assignee.id}
											name={assignee.name}
											size={{ base: "xs", md: "md" }}
											src={assignee.avatarUrl}
										/>
									))}
								</HStack>
							</Td>
							<Td>{task.projectName}</Td>
							<Td>{task.lastUpdated}</Td>
							<Td
								color={
									task.taskStatus === "Completed"
										? "#213622"
										: task.taskStatus === "In Progress"
										? "#cc4673"
										: task.taskStatus === "Pending"
										? "#d04a20"
										: "#cc4673"
								}
								bgColor={
									task.taskStatus === "Completed"
										? "#e3ffe4"
										: task.taskStatus === "In Progress"
										? generateLighterShade("#ffe4e1", 0.8)
										: task.taskStatus === "Pending"
										? "#ffc5b2"
										: generateLighterShade("#cc4673", 0.8)
								}
							>
								{task.taskStatus}
							</Td>
						</Tr>
						<Collapse in={expandedIndex === index}>
							<Tr>
								<Td colSpan={5}>
									<Box mt={2}>
										<Text fontWeight="bold">Checklist:</Text>
										{task?.checklist?.map((item, i) => (
											<Box key={i} ml={4}>
												<Checkbox isChecked={item.completed} isDisabled>
													{item.item}
												</Checkbox>
											</Box>
										))}
									</Box>
								</Td>
							</Tr>
						</Collapse>
					</React.Fragment>
				))}
			</Tbody>
		</Table>
	);
};

export default TaskTable;
