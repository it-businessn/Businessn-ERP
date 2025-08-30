import { Box, HStack, Td, VStack } from "@chakra-ui/react";

const StatusCell = ({
	file,
	index,
	expandedIndex,
	isExpanded,
	isTaskExpanded,
	isSubExpanded,
	isDashboard,
}) => {
	const TaskStatus = ({ status, main }) => (
		<HStack
			justifyContent={"space-around"}
			spacing={0}
			fontWeight={"bold"}
			// color={statusColor(status).color}
			// bgColor={statusColor(status).bg}
			p={"5px"}
			pt={0}
			borderRadius={"8px"}
		>
			{/* {status ? <Text> {status}d</Text> : <Box height={main ? "36px" : "20px"} />} */}
			<Box height={main ? "36px" : "20px"} />
		</HStack>
	);
	return (
		<Td fontSize={"12px"} w="100%" display={"flex"} py={0} px={0}>
			<VStack alignItems={"start"}>
				<TaskStatus status={file?.status} main />

				{(!isDashboard || expandedIndex === index) &&
					file?.projects?.map((project, project_index) => (
						<VStack alignItems={"start"} key={project._id}>
							<TaskStatus status={project.status} />

							{(!isDashboard || isExpanded === project_index) &&
								project?.tasks?.length > 0 &&
								project?.tasks?.map((task, task_index) => (
									<VStack alignItems={"start"} key={task._id}>
										<TaskStatus status={task.status} />

										{(!isDashboard || isTaskExpanded === task_index) &&
											task?.subtasks?.length > 0 &&
											task?.subtasks?.map((subtask, subtask_index) => (
												<VStack alignItems={"start"} key={subtask._id}>
													<TaskStatus status={subtask.status} />

													{(!isDashboard || isSubExpanded === subtask_index) &&
														subtask?.subtasks?.length > 0 &&
														subtask?.subtasks?.map((grandSubtask, grand_subtask_index) => (
															<VStack
																alignItems={"start"}
																w={"100%"}
																key={`grand_subtask_id_*${grand_subtask_index}_${subtask._id}`}
															>
																<TaskStatus status={grandSubtask.status} />
															</VStack>
														))}
												</VStack>
											))}
									</VStack>
								))}
						</VStack>
					))}
			</VStack>
		</Td>
	);
};

export default StatusCell;
