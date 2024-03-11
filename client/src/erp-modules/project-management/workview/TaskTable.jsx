import {
	Avatar,
	Box,
	Button,
	Checkbox,
	CircularProgress,
	CircularProgressLabel,
	Collapse,
	Flex,
	HStack,
	Icon,
	ListItem,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	UnorderedList,
	VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaCaretDown, FaSort } from "react-icons/fa";
import { GoTasklist } from "react-icons/go";
import { formatDate, generateLighterShade } from "utils";
import { COLORS } from "./data";

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

	const CircularProgressBarCell = ({ completionPercentage }) => {
		return (
			<CircularProgress
				value={completionPercentage}
				color={
					completionPercentage >= 75 ? "green.400" : "brand.primary_button_bg"
				}
			>
				<CircularProgressLabel>{`${completionPercentage}%`}</CircularProgressLabel>
			</CircularProgress>
		);
	};

	const TaskButton = ({ totalTasks }) => {
		return (
			<Button
				size="xxs"
				display={"flex"}
				p={"2px"}
				fontSize={"8px"}
				color={"brand.primary_button_bg"}
				border={`1px solid ${generateLighterShade(COLORS.primary, 0.5)}`}
				bg={generateLighterShade(COLORS.primary, 0.8)}
				leftIcon={
					<Icon
						as={GoTasklist}
						sx={{ marginRight: "-4px", fontsize: "10px" }}
					/>
				}
				rightIcon={
					<Icon
						as={FaCaretDown}
						sx={{ marginLeft: "-4px", fontsize: "10px" }}
					/>
				}
			>
				{totalTasks}
			</Button>
		);
	};
	const renderPriorityBars = (priority) => {
		const barCount = 3;
		const bars = [];

		for (let i = 0; i < barCount; i++) {
			const barColor =
				priority <= (i + 1) * 33.33 ? "brand.priority_medium" : "orange.400";
			bars.push(
				<Box key={i} h="2em" w="10px" bgColor={barColor} borderRadius="2px" />,
			);
		}

		return bars;
	};
	const workView_Table = {
		cols: [
			"Task name",
			"Assignee(s)",
			"Priority",
			"Project",
			"Last Updated",
			"Due Date",
			"Status",
		],
	};
	const headerCell = (key) => (
		<Th fontWeight={"bolder"} key={key} fontSize={"xs"}>
			<Flex alignItems={"center"} gap={0.5}>
				{key}
				<FaSort sx={{ width: "5px" }} />
			</Flex>
		</Th>
	);
	return (
		<Box overflow="auto">
			<Table color={"brand.nav_color"} bg={"brand.primary_bg"} size={"small"}>
				<Thead>
					<Tr>
						<Th>
							<Checkbox sx={{ verticalAlign: "middle" }} />
						</Th>
						{workView_Table.cols.map((col) => headerCell(col))}
					</Tr>
				</Thead>
				<Tbody>
					{data?.map((task, index) => {
						task.taskStatus = "Completed";

						return (
							<React.Fragment key={task._id}>
								<Tr key={task.taskName}>
									<Td
									// maxW="200px"
									// overflow="hidden"
									// textOverflow="ellipsis"
									// whiteSpace="nowrap"
									>
										<Checkbox
											sx={{ verticalAlign: "middle" }}
											// isChecked={checkedRows.includes(item.id)}
											// onChange={() => handleCheckboxChange(item.id)}
										/>
									</Td>
									<Td
										fontSize={"xs"}
										onClick={() => handleToggle(index)}
										cursor={task?.todoItems.length > 0 ? "pointer" : "default"}
									>
										<HStack spacing={3}>
											<CircularProgressBarCell completionPercentage={25} />
											<Text>{task.taskName}</Text>
											<TaskButton totalTasks={task?.todoItems.length} />
										</HStack>
									</Td>
									<Td fontSize={"xs"}>
										<HStack>
											{task.selectedAssignees.map((assignee) => (
												<Avatar
													key={assignee.name}
													name={assignee.name}
													size={{ base: "xs", md: "sm" }}
													src={assignee.avatarUrl}
												/>
											))}
										</HStack>
									</Td>
									<Td fontSize={"xs"}>
										<HStack spacing="1">{renderPriorityBars(2)}</HStack>
									</Td>
									<Td fontSize={"xs"}>{task.projectName}</Td>
									<Td fontSize={"xs"}>{formatDate(task.date)}</Td>
									<Td fontSize={"xs"}></Td>
									<Td
										fontSize={"12px"}
										// color={
										// 	task.taskStatus === "Completed"
										// 		? "#213622"
										// 		: task.taskStatus === "In Progress"
										// 		? "#cc4673"
										// 		: task.taskStatus === "Pending"
										// 		? "#d04a20"
										// 		: "#cc4673"
										// }
										// bgColor={
										// 	task.taskStatus === "Completed"
										// 		? "#e3ffe4"
										// 		: task.taskStatus === "In Progress"
										// 		? generateLighterShade("#ffe4e1", 0.8)
										// 		: task.taskStatus === "Pending"
										// 		? "#ffc5b2"
										// 		: generateLighterShade("#cc4673", 0.8)
										// }
									>
										<HStack
											justifyContent={"space-around"}
											spacing={0}
											fontWeight={"bold"}
											bg={generateLighterShade(COLORS.task_status, 0.9)}
											p={"5px"}
											borderRadius={"8px"}
											border={"1px solid var(--status_button_border)"}
											color="var(--status_button_border)"
										>
											<Text> {task.taskStatus}</Text>
											<Text>7d over</Text>
										</HStack>
									</Td>
								</Tr>
								<Tr>
									<Td colSpan="3" p={0} fontSize={"xs"}>
										<Collapse in={expandedIndex === index}>
											<VStack align="start" spacing={2} ml={"5em"} p={0} my={2}>
												<UnorderedList listStyleType={"none"}>
													{task?.todoItems?.map((task, i) => (
														<ListItem p={0} key={task.taskName}>
															<HStack align="center" spacing={2} p={0}>
																<Checkbox
																	isChecked={true}
																	onChange={(e) =>
																		console.log(e.target.checked)
																	}
																	sx={{
																		bgColor: "var(--primary_button_bg)",
																		color: "var(--main_color)",
																		borderRadius: "10px !important",
																	}}
																/>
																<Text>{task.taskName}</Text>
																<Avatar
																	key={task.taskName}
																	name={task.assignee}
																	size={{ base: "xs", md: "sm" }}
																	src={task.avatarUrl}
																/>
															</HStack>
														</ListItem>
													))}
												</UnorderedList>
											</VStack>
										</Collapse>
									</Td>
								</Tr>
							</React.Fragment>
						);
					})}
				</Tbody>
			</Table>
		</Box>
	);
};

export default TaskTable;
