import { EditIcon } from "@chakra-ui/icons";
import { HStack, IconButton, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import SortableTh from "components/ui/table/SortableTh";
import useSortableData from "hooks/useSortableData";

const AccountsList = ({ accounts, handleEdit }) => {
	const { sortedItems, sortConfig, requestSort } = useSortableData(accounts);
	return (
		<Table variant="simple" size="sm">
			<Thead>
				<Tr>
					<SortableTh sortKey="accCode" sortConfig={sortConfig} onSort={requestSort}>
						Account Code
					</SortableTh>
					<SortableTh sortKey="accountName" sortConfig={sortConfig} onSort={requestSort}>
						Account Name
					</SortableTh>
					<SortableTh sortKey="department" sortConfig={sortConfig} onSort={requestSort}>
						Department
					</SortableTh>
					<Th>Action</Th>
				</Tr>
			</Thead>
			<Tbody>
				{(!accounts || accounts?.length === 0) && <EmptyRowRecord data={accounts} colSpan={4} />}
				{sortedItems?.map((acc) => (
					<Tr key={acc?._id}>
						<Td>{acc?.accCode}</Td>
						<Td>{acc?.accountName}</Td>
						<Td>{acc?.department}</Td>
						<Td>
							<HStack spacing={2}>
								<IconButton
									aria-label="Edit "
									icon={<EditIcon />}
									size="sm"
									onClick={() => handleEdit(acc)}
									color="var(--banner_bg)"
									_hover={{
										bg: "var(--banner_bg)",
										color: "white",
									}}
								/>
							</HStack>
						</Td>
					</Tr>
				))}
			</Tbody>
		</Table>
	);
};
export default AccountsList;
