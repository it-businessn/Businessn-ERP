import { Box, HStack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import TaskService from "services/TaskService";
import { formatDate, renderPriorityBars } from "utils";

const TaskTable = ({ user }) => {
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
						<Th fontSize={"12px"}>Name</Th>
						<Th fontSize={"12px"}>Priority</Th>
						<Th fontSize={"12px"}>Due date</Th>
					</Tr>
				</Thead>
				<Tbody>
					{tasks?.map((task) => (
						<Tr key={task._id}>
							<Td fontSize={"xs"}>{task.taskName}</Td>
							<Td fontSize={"xs"}>
								<HStack spacing="1">{renderPriorityBars(task.priority)}</HStack>
							</Td>
							<Td fontSize={"xs"}>{formatDate(task.dueDate)}</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</Box>
	);
};

export default TaskTable;
