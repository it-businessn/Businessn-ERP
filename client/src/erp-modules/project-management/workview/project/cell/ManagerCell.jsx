import { Td, Text, VStack } from "@chakra-ui/react";

const ManagerCell = ({
	project,
	index,
	expandedIndex,
	isExpanded,
	isSubExpanded,
}) => {
	const Manager = () => <Text>{project.managerName}</Text>;
	return (
		<Td fontSize={"xs"} pl={"1em"} w={"150px"}>
			<VStack alignItems={"start"} spacing={7}>
				<Manager />
				{expandedIndex === index &&
					project?.tasks?.map((task, task_index) => (
						<VStack alignItems={"start"} spacing={7}>
							<Manager />
							{isExpanded === task_index &&
								task?.subtasks?.length > 0 &&
								task?.subtasks?.map((subtask, subtask_index) => (
									<VStack alignItems={"start"} spacing={7}>
										<Manager />
										{isSubExpanded === subtask_index &&
											subtask?.subtasks?.length > 0 &&
											subtask?.subtasks?.map((item) => <Manager />)}
									</VStack>
								))}
						</VStack>
					))}
			</VStack>
		</Td>
	);
};

export default ManagerCell;
