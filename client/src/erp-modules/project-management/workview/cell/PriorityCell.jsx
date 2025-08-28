import { HStack, Td, VStack } from "@chakra-ui/react";
import { RenderPriorityBars } from "components/RenderPriorityBars";

const PriorityBar = ({ priority }) => (
	<HStack _hover={{ bg: "var(--phoneCall_bg_light)" }} spacing="1">
		{RenderPriorityBars(priority)}
	</HStack>
);

const PriorityCell = ({
	file,
	index,
	expandedIndex,
	isExpanded,
	isTaskExpanded,
	isSubExpanded,
}) => {
	return (
		<Td fontSize={"xs"} w="100%" p={"1em"} py={0}>
			<VStack alignItems={"start"}>
				<PriorityBar priority={file?.priority} />

				{expandedIndex === index &&
					file?.projects?.map((project, project_index) => (
						<VStack alignItems={"start"} w={"100%"} key={project._id}>
							<PriorityBar priority={project.priority} />

							{isExpanded === project_index &&
								project?.tasks?.length > 0 &&
								project?.tasks?.map((task, task_index) => (
									<VStack alignItems={"start"} w={"100%"} key={task._id}>
										<PriorityBar priority={task.priority} />

										{isTaskExpanded === task_index &&
											task?.subtasks?.length > 0 &&
											task?.subtasks?.map((subtask, subtask_index) => (
												<VStack alignItems={"start"} w={"100%"} key={subtask._id}>
													<PriorityBar priority={subtask?.priority} />

													{isSubExpanded === subtask_index &&
														subtask?.subtasks?.length > 0 &&
														subtask?.subtasks?.map((grandSubtask, grand_subtask_index) => (
															<VStack
																alignItems={"start"}
																w={"100%"}
																key={`grand_subtask_id_*${grand_subtask_index}`}
															>
																<PriorityBar priority={grandSubtask?.priority} />
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

export default PriorityCell;
