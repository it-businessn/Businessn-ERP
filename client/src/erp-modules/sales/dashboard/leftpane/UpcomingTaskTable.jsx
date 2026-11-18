import { Box, HStack, Table, Tbody, Td, Thead, Tr } from "@chakra-ui/react";
import { RenderPriorityBars } from "components/RenderPriorityBars";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import SortableTh from "components/ui/table/SortableTh";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import useSelectUser from "hooks/useSelectUser";
import useSortableData from "hooks/useSortableData";
import { useEffect, useState } from "react";
import TaskService from "services/TaskService";
import { formatDate } from "utils/convertDate";

// TABLE-SORT: priority shows as bars, so sort low < medium < high
const PRIORITY_RANK = { low: 1, medium: 2, high: 3 };
const byPriority = ({ priority }) => (priority ? PRIORITY_RANK[priority.toLowerCase()] ?? 0 : null);
// keys follow the cell order of each row: Name, Priority, Due date
const SORT_KEYS_BY_INDEX = ["taskName", byPriority, "dueDate"];

const UpcomingTaskTable = ({ cols, user, company }) => {
	const [tasks, setTasks] = useState(null);
	const { sortedItems, sortConfig, requestSort } = useSortableData(tasks);
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
						{cols.map((_, index) => (
							<SortableTh
								key={_}
								sortKey={SORT_KEYS_BY_INDEX[index]}
								sortConfig={sortConfig}
								onSort={requestSort}
								fontSize={"12px"}
							>
								{_}
							</SortableTh>
						))}
					</Tr>
				</Thead>
				<Tbody>
					{(!tasks || tasks?.length === 0) && (
						<EmptyRowRecord data={tasks} colSpan={cols?.length} />
					)}
					{sortedItems?.map(({ _id, taskName, priority, dueDate }) => (
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
