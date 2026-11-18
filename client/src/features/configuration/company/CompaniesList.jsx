import { EditIcon } from "@chakra-ui/icons";
import { HStack, IconButton, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import SortableTh from "components/ui/table/SortableTh";
import useSortableData from "hooks/useSortableData";

export const CompaniesList = ({ companies, handleEdit }) => {
	const { sortedItems, sortConfig, requestSort } = useSortableData(companies);
	return (
		<Table variant="simple" size="sm">
			<Thead>
				<Tr>
					<SortableTh sortKey="name" sortConfig={sortConfig} onSort={requestSort}>
						Name
					</SortableTh>
					<SortableTh sortKey="registration_number" sortConfig={sortConfig} onSort={requestSort}>
						Registration Number
					</SortableTh>
					<Th>Action</Th>
				</Tr>
			</Thead>
			<Tbody>
				{(!companies || companies?.length === 0) && <EmptyRowRecord data={companies} colSpan={3} />}
				{sortedItems?.map((company) => (
					<Tr key={company._id}>
						<Td>{company.name}</Td>
						<Td>{company.registration_number}</Td>
						<Td>
							<HStack spacing={2}>
								<IconButton
									aria-label="Edit"
									icon={<EditIcon />}
									size="sm"
									onClick={() => handleEdit(company)}
									color="var(--banner_bg)"
									_hover={{
										bg: "var(--banner_bg)",
										color: "white",
									}}
								/>
								{/* <IconButton
											aria-label="Delete"
											icon={<DeleteIcon />}
											size="sm"
											color="var(--banner_bg)"
											_hover={{
												bg: "var(--banner_bg)",
												color: "white",
											}}
											onClick={() => {
												// setShowConfirmationPopUp(true);
												// setDeleteRecordId(holiday._id);
											}}
										/> */}
							</HStack>
						</Td>
					</Tr>
				))}
			</Tbody>
		</Table>
	);
};
