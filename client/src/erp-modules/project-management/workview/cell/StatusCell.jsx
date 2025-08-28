import { HStack, Td, Text, VStack } from "@chakra-ui/react";
import { statusColor } from "utils";

const StatusCell = ({ file, index, expandedIndex, isExpanded, isTaskExpanded, isSubExpanded }) => {
	const TaskStatus = ({ status }) => (
		<HStack
			justifyContent={"space-around"}
			spacing={0}
			fontWeight={"bold"}
			color={statusColor(status).color}
			bgColor={statusColor(status).bg}
			p={"5px"}
			pt={0}
			borderRadius={"8px"}
		>
			<Text> {status}d</Text>
		</HStack>
	);
	return (
		<Td fontSize={"12px"} w="100%" display={"flex"} py={0} px={0}>
			<VStack alignItems={"start"}>
				<TaskStatus status={file?.status} />

				{expandedIndex === index &&
					file?.projects?.map((project, project_index) => (
						<VStack alignItems={"start"} key={project._id}>
							<TaskStatus status={project.status} />

							{isExpanded === project_index &&
								project?.tasks?.length > 0 &&
								project?.tasks?.map((task, task_index) => (
									<VStack alignItems={"start"} key={task._id}>
										<TaskStatus status={task.status} />

										{isTaskExpanded === task_index &&
											task?.subtasks?.length > 0 &&
											task?.subtasks?.map((subtask, subtask_index) => (
												<VStack alignItems={"start"} key={subtask._id}>
													<TaskStatus status={subtask.status} />

													{isSubExpanded === subtask_index &&
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
