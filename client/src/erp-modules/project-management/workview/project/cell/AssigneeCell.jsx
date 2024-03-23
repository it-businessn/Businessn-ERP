import { Avatar, HStack, Td, VStack } from "@chakra-ui/react";

const AssigneeCell = ({
	project,
	index,
	expandedIndex,
	isExpanded,
	isSubExpanded,
}) => {
	const AssigneeList = ({ assignees }) => (
		<HStack>
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
		<Td fontSize={"xs"} p={"0.5em"} w={"200px"}>
			<VStack alignItems={"start"} spacing={4}>
				<AssigneeList assignees={project?.selectedAssignees} />
				{console.log(expandedIndex === index, isExpanded, isSubExpanded)}
				{expandedIndex === index &&
					project?.tasks?.map((task, index) => (
						<VStack alignItems={"start"} spacing={4}>
							<AssigneeList assignees={task.selectedAssignees} />
							{isExpanded === index &&
								task?.subtasks?.length > 0 &&
								task?.subtasks?.map((subtask, index) => (
									<VStack alignItems={"start"} spacing={4}>
										<AssigneeList assignees={subtask.selectedAssignees} />

										{isSubExpanded === index &&
											subtask?.subtasks?.length > 0 &&
											subtask?.subtasks?.map((item) => (
												<AssigneeList
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
