import { EditIcon } from "@chakra-ui/icons";
import { HStack, IconButton, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";

export const CompaniesList = ({ companies, handleEdit }) => {
	return (
		<Table variant="simple" size="sm">
			<Thead>
				<Tr>
					<Th>Name</Th>
					<Th>Registration Number</Th>
					<Th>Action</Th>
				</Tr>
			</Thead>
			<Tbody>
				{(!companies || companies?.length === 0) && <EmptyRowRecord data={companies} colSpan={2} />}
				{companies?.map((company) => (
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
