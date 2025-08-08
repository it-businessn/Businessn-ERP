import { HStack, Td, Text, VStack } from "@chakra-ui/react";
import { statusColor } from "utils";

const StatusCell = ({ project, index, expandedIndex, isExpanded, isSubExpanded }) => {
	const TaskStatus = ({ status, main }) =>
		status && (
			<HStack
				gap={0}
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
			<VStack alignItems={"start"} gap={0} w={"100%"}>
				<TaskStatus status={project.status} main />
				{expandedIndex === index &&
					project?.tasks?.map((task, task_index) => (
						<VStack alignItems={"start"} gap={0} w={"100%"} key={task._id}>
							<TaskStatus status={task.status} />
							{isExpanded === task_index &&
								task?.subtasks?.length > 0 &&
								task?.subtasks?.map((subtask, subtask_index) => (
									<VStack alignItems={"start"} gap={0} w={"100%"} key={subtask._id}>
										<TaskStatus status={subtask.status} />
										{isSubExpanded === subtask_index &&
											subtask?.subtasks?.length > 0 &&
											subtask?.subtasks?.map((item) => (
												<TaskStatus status={item.status} key={`status_${item}**${index}`} />
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
