import { EditIcon } from "@chakra-ui/icons";
import { HStack, IconButton, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";

const AccountsList = ({ accounts, handleEdit }) => {
	return (
		<Table variant="simple" size="sm">
			<Thead>
				<Tr>
					<Th>Account Code</Th>
					<Th>Account Name</Th>
					<Th>Department</Th>
					<Th>Action</Th>
				</Tr>
			</Thead>
			<Tbody>
				{(!accounts || accounts?.length === 0) && <EmptyRowRecord data={accounts} colSpan={3} />}
				{accounts?.map((acc) => (
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
