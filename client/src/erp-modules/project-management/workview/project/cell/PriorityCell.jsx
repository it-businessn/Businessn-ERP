import { HStack, Td, VStack } from "@chakra-ui/react";
import { renderPriorityBars } from "utils";

const PriorityCell = ({
	project,
	index,
	expandedIndex,
	isExpanded,
	isSubExpanded,
}) => {
	// top={main ? "0" : "3.5em"} pos={"relative"}
	const PriorityBar = ({ priority, main, task }) => (
		<HStack spacing="1" marginTop={main ? "3em" : "1.4em"}>
			{renderPriorityBars(priority)}
		</HStack>
	);
	return (
		<Td fontSize={"xs"} p={"1em"} w={"100px"} display={"flex"} py={0}>
			<VStack alignItems={"start"} w={"100%"}>
				<PriorityBar priority={project.priority} main />
				{expandedIndex === index &&
					project?.tasks?.map((task, index) => (
						<VStack alignItems={"start"} w={"100%"} key={task}>
							<PriorityBar priority={task.priority} task />
							{isExpanded === index &&
								task?.subtasks?.length > 0 &&
								task?.subtasks?.map((subtask, index) => (
									<VStack alignItems={"start"} w={"100%"} key={subtask}>
										<PriorityBar priority={subtask.priority} sub />
										{isSubExpanded === index &&
											subtask?.subtasks?.length > 0 &&
											subtask?.subtasks?.map((item) => (
												<PriorityBar
													key={item}
													priority={item?.priority || "low"}
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

export default PriorityCell;
