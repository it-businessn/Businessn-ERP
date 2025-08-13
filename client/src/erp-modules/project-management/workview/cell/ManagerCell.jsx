import { HStack, Td, Text, VStack } from "@chakra-ui/react";

const ManagerCell = ({ project, index, expandedIndex, isExpanded, isSubExpanded }) => {
	const Manager = ({ main, task }) => (
		<HStack
			spacing="1"
			marginTop={main ? "3em" : "1.75em"}
			// top={main ? "3em" : task ? "6.5em" : "8em"}
			// pos={"relative"}
		>
			<Text>{project.managerName}</Text>
		</HStack>
	);
	return (
		<Td fontSize={"xs"} pl={"1em"} w={"130px"} display={"flex"} py={0}>
			<VStack alignItems={"start"} w={"100%"}>
				<Manager main />
				{expandedIndex === index &&
					project?.tasks?.map((task, task_index) => (
						<VStack
							alignItems={"start"}
							w={"100%"}
							key={task._id}
							// _hover={{ bg: "var(--phoneCall_bg_light)" }}
						>
							<Manager task />
							{isExpanded === task_index &&
								task?.subtasks?.length > 0 &&
								task?.subtasks?.map((subtask, subtask_index) => (
									<VStack alignItems={"start"} w={"100%"} key={subtask._id}>
										<Manager sub />
										{isSubExpanded === subtask_index &&
											subtask?.subtasks?.length > 0 &&
											subtask?.subtasks?.map((item, index) => (
												<Manager key={`manager_item_${item}**${index}`} />
											))}
									</VStack>
								))}
						</VStack>
					))}
			</VStack>
		</Td>
	);
};

export default ManagerCell;
