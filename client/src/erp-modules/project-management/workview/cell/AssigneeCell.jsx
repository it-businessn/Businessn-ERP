import { Avatar, Box, Button, HStack, Td, VStack } from "@chakra-ui/react";

const AssigneeList = ({ assignees, showAllAssignees = false }) => (
	<HStack justifyContent={"center"}>
		{assignees.length < 1 && <Box height={"24px"} />}
		{assignees?.map(
			(assignee, index) =>
				index < 1 &&
				!showAllAssignees && (
					<Avatar
						key={`${assignee}_io${index}`}
						name={assignee}
						size={{ base: "xs", md: "xs" }}
						src={assignee}
					/>
				),
		)}
		{assignees && assignees.length > 1 && !showAllAssignees && (
			<Button
				w={"24px"}
				minW={"unset"}
				h={"24px"}
				fontSize={"1em"}
				p={0}
				bg={"var(--primary_button_bg)"}
				borderRadius={"100%"}
			>
				+{assignees.length - 1}
			</Button>
		)}
	</HStack>
);

const AssigneeCell = ({
	file,
	index,
	expandedIndex,
	isExpanded,
	isTaskExpanded,
	isSubExpanded,
}) => {
	return (
		<Td fontSize={"xs"} w="100%" p={"0.5em"} display={"flex"} py={0}>
			<VStack w="50%">
				<AssigneeList assignees={file?.selectedAssignees} />

				{expandedIndex === index &&
					file?.projects?.map((project, project_index) => (
						<VStack key={project._id}>
							<AssigneeList assignees={project.selectedAssignees} />

							{isExpanded === project_index &&
								project?.tasks?.length > 0 &&
								project?.tasks?.map((task, task_index) => (
									<VStack key={task._id}>
										<AssigneeList assignees={task.selectedAssignees} />

										{isTaskExpanded === task_index &&
											task?.subtasks?.length > 0 &&
											task?.subtasks?.map((subtask, subtask_index) => (
												<VStack key={subtask._id}>
													<AssigneeList sub assignees={subtask.selectedAssignees} />

													{isSubExpanded === subtask_index &&
														subtask?.subtasks?.length > 0 &&
														subtask?.subtasks?.map((grand_subtask, grand_subtask_index) => (
															<VStack
																alignItems={"start"}
																key={`grand_subtask_id_*${grand_subtask_index}_${subtask._id}`}
															>
																<AssigneeList sub assignees={grand_subtask.selectedAssignees} />
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

export default AssigneeCell;
