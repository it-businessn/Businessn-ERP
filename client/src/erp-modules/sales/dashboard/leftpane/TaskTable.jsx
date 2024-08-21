import { Box, HStack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import useCompany from "hooks/useCompany";
import useSelectUser from "hooks/useSelectUser";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import TaskService from "services/TaskService";
import { formatDate, renderPriorityBars } from "utils";

const TaskTable = ({ cols }) => {
	const { company } = useCompany(
		LocalStorageService.getItem("selectedCompany"),
	);
	const [tasks, setTasks] = useState([]);
	const { selectedUser } = useSelectUser(
		LocalStorageService.getItem("selectedUser"),
	);

	useEffect(() => {
		const fetchAllUserTasks = async () => {
			try {
				const response = await TaskService.getTaskByAssignee({
					name: selectedUser?.fullName,
					company,
				});

				setTasks(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllUserTasks();
	}, [selectedUser, company]);

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
					{!tasks?.length && <EmptyRowRecord />}
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
