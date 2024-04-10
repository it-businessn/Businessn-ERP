import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

const CalendarTable = () => {
	return (
		<Box overflow="auto">
			<Table variant="simple">
				<Thead>
					<Tr>
						<Th>Name</Th>
						<Th>Description</Th>
					</Tr>
				</Thead>
				<Tbody>
					<Tr>
						<Td></Td>
						<Td></Td>
					</Tr>
				</Tbody>
			</Table>
		</Box>
	);
};

export default CalendarTable;
