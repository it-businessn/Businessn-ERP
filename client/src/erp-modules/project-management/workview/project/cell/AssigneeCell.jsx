import { Avatar, Button, HStack, Td, VStack } from "@chakra-ui/react";
import { useState } from "react";

const AssigneeCell = ({
	project,
	index,
	expandedIndex,
	isExpanded,
	isSubExpanded,
}) => {
	const [showAllAssignees, setShowAllAssignees] = useState(false);
	const AssigneeList = ({ assignees, main, task, sub }) => (
		<HStack
			gap={0}
			// top={main ? "3em" : task ? "5.5em" : "8em"}
			// pos={"relative"}
			marginTop={main ? "2.5em" : task ? "0.9em" : sub ? "0.2em" : 0}
		>
			{assignees?.map((assignee, index) =>
				index < 3 && !showAllAssignees ? (
					<Avatar
						key={assignee}
						name={assignee}
						size={{ base: "xs", md: "sm" }}
						src={assignee}
					/>
				) : null,
			)}
			{assignees && assignees.length > 3 && !showAllAssignees && (
				<Button
					size={"xs"}
					bg={"var(--primary_button_bg)"}
					borderRadius={"50%"}
				>
					+{assignees.length - 3}
				</Button>
			)}
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
