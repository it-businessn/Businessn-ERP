import { Box, HStack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import { formatDate, renderPriorityBars } from "utils";

const TaskTable = ({ cols, tasks }) => {
	return (
		<Box overflow="auto">
			<Table variant="simple" size={"small"}>
				<Thead>
					<Tr>
						{cols.map((_) => (
							<Th key={_} fontSize={"12px"}>
								{_}
							</Th>
						))}
					</Tr>
				</Thead>
				<Tbody>
					{(!tasks || tasks?.length === 0) && (
						<EmptyRowRecord data={tasks} colSpan={cols?.length} />
					)}
					{tasks?.map(({ _id, taskName, priority, dueDate }) => (
						<Tr key={_id}>
							<Td fontSize={"xs"}>{taskName}</Td>
							<Td fontSize={"xs"}>
								<HStack spacing="1">{renderPriorityBars(priority)}</HStack>
							</Td>
							<Td fontSize={"xs"}>{formatDate(dueDate)}</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</Box>
	);
};

export default TaskTable;
