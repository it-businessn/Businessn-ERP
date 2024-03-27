import { HStack, Td, Text, VStack } from "@chakra-ui/react";
import { statusColor } from "../..";

const StatusCell = ({
	project,
	index,
	expandedIndex,
	isExpanded,
	isSubExpanded,
}) => {
	const TaskStatus = ({ status }) => (
		<HStack
			justifyContent={"space-around"}
			spacing={0}
			fontWeight={"bold"}
			color={statusColor(status).color}
			bgColor={statusColor(status).bg}
			p={"5px"}
			borderRadius={"8px"}
		>
			<Text> {status || 0}d</Text>
		</HStack>
	);
	return (
		<Td fontSize={"12px"} w={"200px"}>
			<VStack alignItems={"start"} spacing={5}>
				<TaskStatus status={project.status} />
				{expandedIndex === index &&
					project?.tasks?.map((task, task_index) => (
						<VStack alignItems={"start"} spacing={5}>
							<TaskStatus status={task.status} />
							{isExpanded === task_index &&
								task?.subtasks?.length > 0 &&
								task?.subtasks?.map((subtask, subtask_index) => (
									<VStack alignItems={"start"} spacing={5}>
										<TaskStatus status={subtask.status} />
										{isSubExpanded === subtask_index &&
											subtask?.subtasks?.length > 0 &&
											subtask?.subtasks?.map((item) => (
												<TaskStatus status={item.status} />
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
