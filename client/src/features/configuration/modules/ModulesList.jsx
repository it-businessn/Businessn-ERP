import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { HStack, IconButton, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";

export const ModulesList = ({ modules, handleEdit, handleDelete }) => {
	return (
		<Table variant="simple" size="sm">
			<Thead>
				<Tr>
					<Th>Name</Th>
					<Th>Action</Th>
				</Tr>
			</Thead>
			<Tbody>
				{(!modules || modules?.length === 0) && <EmptyRowRecord data={modules} colSpan={2} />}
				{modules?.map((module) => (
					<Tr key={module?._id}>
						<Td>{module?.name}</Td>
						<Td>
							<HStack spacing={2}>
								<IconButton
									aria-label="Edit "
									icon={<EditIcon />}
									size="sm"
									onClick={() => handleEdit(module)}
									color="var(--banner_bg)"
									_hover={{
										bg: "var(--banner_bg)",
										color: "white",
									}}
								/>
								<IconButton
									aria-label="Delete "
									icon={<DeleteIcon />}
									size="sm"
									color="var(--banner_bg)"
									_hover={{
										bg: "var(--banner_bg)",
										color: "white",
									}}
									onClick={() => handleDelete(module?._id)}
								/>
							</HStack>
						</Td>
					</Tr>
				))}
			</Tbody>
		</Table>
	);
};
