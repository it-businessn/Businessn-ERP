import { EditIcon } from "@chakra-ui/icons";
import { HStack, IconButton, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";

export const RolesList = ({ roleList, handleEdit }) => {
	return (
		<Table variant="simple" size="sm">
			<Thead>
				<Tr>
					<Th>Name</Th>
					<Th>Action</Th>
				</Tr>
			</Thead>
			<Tbody>
				{(!roleList || roleList?.length === 0) && <EmptyRowRecord data={roleList} colSpan={2} />}
				{roleList?.map((role) => (
					<Tr key={role?._id}>
						<Td>{role?.name}</Td>
						<Td>
							<HStack spacing={2}>
								<IconButton
									aria-label="Edit "
									icon={<EditIcon />}
									size="sm"
									onClick={() => handleEdit(role)}
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
