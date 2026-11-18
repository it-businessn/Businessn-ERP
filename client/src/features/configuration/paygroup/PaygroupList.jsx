import { EditIcon } from "@chakra-ui/icons";
import { HStack, IconButton, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import SortableTh from "components/ui/table/SortableTh";
import useSortableData from "hooks/useSortableData";

const sortByPayrollActivated = (paygroup) => (paygroup?.payrollActivated ? "Yes" : "No");

export const PaygroupList = ({ allPaygroup, handleEdit }) => {
	const { sortedItems, sortConfig, requestSort } = useSortableData(allPaygroup);
	return (
		<Table variant="simple" size="sm">
			<Thead>
				<Tr>
					<SortableTh sortKey="name" sortConfig={sortConfig} onSort={requestSort}>
						Name
					</SortableTh>
					<SortableTh sortKey={sortByPayrollActivated} sortConfig={sortConfig} onSort={requestSort}>
						Payroll Activated
					</SortableTh>
					<Th>Action</Th>
				</Tr>
			</Thead>
			<Tbody>
				{(!allPaygroup || allPaygroup?.length === 0) && (
					<EmptyRowRecord data={allPaygroup} colSpan={3} />
				)}
				{sortedItems?.map((paygroup) => (
					<Tr key={paygroup?._id}>
						<Td>{paygroup?.name}</Td>
						<Td>{paygroup?.payrollActivated ? "Yes" : "No"}</Td>
						<Td>
							<HStack spacing={2}>
								<IconButton
									aria-label="Edit "
									icon={<EditIcon />}
									size="sm"
									onClick={() => handleEdit(paygroup)}
									color="var(--banner_bg)"
									_hover={{
										bg: "var(--banner_bg)",
										color: "white",
									}}
								/>
								{/* <IconButton
												aria-label="Delete "
												icon={<DeleteIcon />}
												size="sm"
												color="var(--banner_bg)"
												_hover={{
													bg: "var(--banner_bg)",
													color: "white",
												}}
												onClick={() => confirmDelete(paygroup?._id)}
											/> */}
							</HStack>
						</Td>
					</Tr>
				))}
			</Tbody>
		</Table>
	);
};
