import { HStack, Td, VStack } from "@chakra-ui/react";
import { renderPriorityBars } from "utils";

const PriorityCell = ({
	project,
	index,
	expandedIndex,
	isExpanded,
	isSubExpanded,
}) => {
	const PriorityBar = () => (
		<HStack spacing="1">{renderPriorityBars(2)}</HStack>
	);
	return (
		<Td fontSize={"xs"} p={"1em"} w={"150px"}>
			<VStack alignItems={"start"} spacing={5}>
				<PriorityBar />
				{expandedIndex === index &&
					project?.tasks?.map((task, index) => (
						<VStack alignItems={"start"} spacing={5}>
							<PriorityBar />
							{isExpanded === index &&
								task?.subtasks?.length > 0 &&
								task?.subtasks?.map((subtask, index) => (
									<VStack alignItems={"start"} spacing={5}>
										<PriorityBar />
										{isSubExpanded === index &&
											subtask?.subtasks?.length > 0 &&
											subtask?.subtasks?.map((item) => <PriorityBar />)}
									</VStack>
								))}
						</VStack>
					))}
			</VStack>
		</Td>
	);
};

export default PriorityCell;
