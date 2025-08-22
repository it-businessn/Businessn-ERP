import { Box, HStack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { RenderPriorityBars } from "components/RenderPriorityBars";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import useSelectUser from "hooks/useSelectUser";
import { useEffect, useState } from "react";
import TaskService from "services/TaskService";
import { formatDate } from "utils/convertDate";

const UpcomingTaskTable = ({ cols, user, company }) => {
	const [tasks, setTasks] = useState(null);
	const { selectedUser } = useSelectUser(user);

	useEffect(() => {
		const fetchAllUserTasks = async () => {
			try {
				const { data } = await TaskService.getTaskByAssignee({
					name: selectedUser?.fullName,
					company,
				});
				setTasks(data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchAllUserTasks();
	}, [selectedUser]);

	return (
		<Box overflow="auto" height="30vh" css={tabScrollCss}>
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
								<HStack spacing="1">{RenderPriorityBars(priority)}</HStack>
							</Td>
							<Td fontSize={"xs"}>{dueDate && formatDate(dueDate)}</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</Box>
	);
};

export default UpcomingTaskTable;
