import { Box, HStack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import TaskService from "services/TaskService";
import { formatDate, renderPriorityBars } from "utils";

const TaskTable = ({ user, cols }) => {
	const [tasks, setTasks] = useState([]);
	useEffect(() => {
		const fetchAllUserTasks = async () => {
			try {
				const response = await TaskService.getTaskByAssignee(user?.fullName);

				setTasks(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllUserTasks();
	}, [user]);

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
