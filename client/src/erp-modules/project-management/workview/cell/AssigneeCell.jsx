import { Avatar, Button, HStack, Td, VStack } from "@chakra-ui/react";
import { useState } from "react";

const AssigneeCell = ({ project, index, expandedIndex, isExpanded, isSubExpanded }) => {
	const [showAllAssignees, setShowAllAssignees] = useState(false);
	const AssigneeList = ({ assignees, main, task, sub }) => (
		<HStack gap={0}>
			{assignees?.map((assignee, index) =>
				index < 1 && !showAllAssignees ? (
					<Avatar
						key={`${assignee}_io${index}`}
						name={assignee}
						size={{ base: "xs", md: "xs" }}
						src={assignee}
					/>
				) : null,
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

	return (
		<Td fontSize={"xs"} w="100%" p={"0.5em"} display={"flex"} py={0}>
			<VStack w={"100%"} spacing={0}>
				<AssigneeList assignees={project?.selectedAssignees} main />
				{expandedIndex === index &&
					project?.tasks?.map((task, index) => (
						<VStack
							spacing={0}
							w={"100%"}
							key={task._id}
							_hover={{ bg: "var(--phoneCall_bg_light)" }}
						>
							<AssigneeList assignees={task.selectedAssignees} task />
							{isExpanded === index &&
								task?.subtasks?.length > 0 &&
								task?.subtasks?.map((subtask, index) => (
									<VStack spacing={0} w={"100%"} key={subtask._id}>
										<AssigneeList assignees={subtask.selectedAssignees} sub />

										{isSubExpanded === index &&
											subtask?.subtasks?.length > 0 &&
											subtask?.subtasks?.map((item) => (
												<AssigneeList sub key={item.taskName} assignees={item.selectedAssignees} />
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
