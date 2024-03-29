import { Avatar, HStack, Td, VStack } from "@chakra-ui/react";

const AssigneeCell = ({
	project,
	index,
	expandedIndex,
	isExpanded,
	isSubExpanded,
}) => {
	const AssigneeList = ({ assignees, main, task, sub }) => (
		<HStack
			gap={0}
			// top={main ? "3em" : task ? "5.5em" : "8em"}
			// pos={"relative"}
			marginTop={main ? "2.5em" : task ? "0.8em" : sub ? "0" : 0}
		>
			{assignees?.map((assignee) => (
				<Avatar
					key={assignee}
					name={assignee}
					size={{ base: "xs", md: "sm" }}
					src={assignee}
				/>
			))}
		</HStack>
	);

	return (
		<Td fontSize={"xs"} p={"0.5em"} w={"130px"} display={"flex"} py={0}>
			<VStack w={"100%"}>
				<AssigneeList assignees={project?.selectedAssignees} main />
				{expandedIndex === index &&
					project?.tasks?.map((task, index) => (
						<VStack w={"100%"}>
							<AssigneeList assignees={task.selectedAssignees} task />
							{isExpanded === index &&
								task?.subtasks?.length > 0 &&
								task?.subtasks?.map((subtask, index) => (
									<VStack w={"100%"}>
										<AssigneeList assignees={subtask.selectedAssignees} sub />

										{isSubExpanded === index &&
											subtask?.subtasks?.length > 0 &&
											subtask?.subtasks?.map((item) => (
												<AssigneeList
													sub
													key={item.taskName}
													assignees={item.selectedAssignees}
												/>
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
