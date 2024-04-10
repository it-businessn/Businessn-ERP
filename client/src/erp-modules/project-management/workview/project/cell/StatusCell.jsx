import { HStack, Td, Text, VStack } from "@chakra-ui/react";
import { statusColor } from "../..";

const StatusCell = ({
	project,
	index,
	expandedIndex,
	isExpanded,
	isSubExpanded,
}) => {
	const TaskStatus = ({ status, main }) => (
		<HStack
			gap={0}
			marginTop={main ? "2.8em" : "2em"}
			// top={main ? "2.5em" : "5em"}
			// pos={"relative"}
			justifyContent={"space-around"}
			spacing={0}
			fontWeight={"bold"}
			color={statusColor(status).color}
			bgColor={statusColor(status).bg}
			p={"5px"}
			pt={0}
			borderRadius={"8px"}
		>
			<Text> {status || 0}d</Text>
		</HStack>
	);
	return (
		<Td fontSize={"12px"} display={"flex"} py={0} w={"120px"} px={0}>
			<VStack alignItems={"start"} gap={0} w={"100%"}>
				<TaskStatus status={project.status} main />
				{expandedIndex === index &&
					project?.tasks?.map((task, task_index) => (
						<VStack alignItems={"start"} gap={0} w={"100%"} key={task}>
							<TaskStatus status={task.status} />
							{isExpanded === task_index &&
								task?.subtasks?.length > 0 &&
								task?.subtasks?.map((subtask, subtask_index) => (
									<VStack alignItems={"start"} gap={0} w={"100%"} key={subtask}>
										<TaskStatus status={subtask.status} />
										{isSubExpanded === subtask_index &&
											subtask?.subtasks?.length > 0 &&
											subtask?.subtasks?.map((item) => (
												<TaskStatus status={item.status} key={item} />
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
