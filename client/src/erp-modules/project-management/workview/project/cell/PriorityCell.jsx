import { HStack, Td, VStack } from "@chakra-ui/react";
import { renderPriorityBars } from "utils";

const PriorityCell = ({
	project,
	index,
	expandedIndex,
	isExpanded,
	isSubExpanded,
}) => {
	const PriorityBar = ({ priority }) => (
		<HStack spacing="1">{renderPriorityBars(priority)}</HStack>
	);
	return (
		<Td fontSize={"xs"} p={"1em"} w={"150px"}>
			<VStack alignItems={"start"} spacing={5}>
				<PriorityBar priority={project.priority} />
				{expandedIndex === index &&
					project?.tasks?.map((task, index) => (
						<VStack alignItems={"start"} spacing={5}>
							<PriorityBar priority={task.priority} />
							{isExpanded === index &&
								task?.subtasks?.length > 0 &&
								task?.subtasks?.map((subtask, index) => (
									<VStack alignItems={"start"} spacing={5}>
										<PriorityBar priority={subtask.priority} />
										{isSubExpanded === index &&
											subtask?.subtasks?.length > 0 &&
											subtask?.subtasks?.map((item) => (
												<PriorityBar priority={item?.priority || "low"} />
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
