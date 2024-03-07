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
import React, { useState } from "react";
import { FaCaretDown, FaFilter } from "react-icons/fa";
import { generateLighterShade } from "utils";

const TaskTable = ({ data }) => {
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
	// useEffect(() => {
	// 	if (filter) {
	// 		setTasks(tasksData.filter((task) => task.checklist));
	// 	}
	// }, [filter]);
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
				{data?.map((task, index) => {
					task.taskStatus = "Pending";
					return (
						<React.Fragment key={task._id}>
							<Tr key={task.taskName}>
								<Td
									onClick={() => handleToggle(index)}
									cursor={task?.todoItems.length > 0 ? "pointer" : "default"}
								>
									<HStack spacing={3}>
										<Text>{task.taskName}</Text>
										{task?.todoItems.length > 0 && <FaCaretDown />}
									</HStack>
								</Td>
								<Td>
									<HStack>
										{task.selectedAssignees.map((assignee) => (
											<Avatar
												key={assignee.name}
												name={assignee.name}
												size={{ base: "xs", md: "md" }}
												src={assignee.avatarUrl}
											/>
										))}
									</HStack>
								</Td>
								<Td>{task.projectName}</Td>
								<Td>
									{new Date(task.date).toLocaleDateString()}{" "}
									{new Date(task.date).toLocaleTimeString()}
								</Td>
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
							{task?.todoItems.length > 0 && (
								<Collapse in={expandedIndex === index}>
									<Tr>
										<Td colSpan={5}>
											<Box mt={2}>
												<Text fontWeight="bold">Checklist:</Text>
												{task?.todoItems?.map((task, i) => (
													<Table key={i} ml={4} size={"small"}>
														<Tbody>
															<Tr>
																<Td>
																	<Checkbox isChecked={true} isDisabled>
																		{task.taskName}
																	</Checkbox>
																</Td>
																<Td>
																	<Avatar
																		key={task.taskName}
																		name={task.assignee}
																		size={{ base: "xs", md: "md" }}
																		src={task.avatarUrl}
																	/>
																</Td>
															</Tr>
														</Tbody>
													</Table>
												))}
											</Box>
										</Td>
									</Tr>
								</Collapse>
							)}
						</React.Fragment>
					);
				})}
			</Tbody>
		</Table>
	);
};

export default TaskTable;
