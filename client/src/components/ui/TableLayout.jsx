import { Box, Table, Th, Thead, Tr } from "@chakra-ui/react";

const TableLayout = ({ cols, children }) => {
	return (
		<Box overflow="auto">
			<Table variant="simple">
				<Thead>
					<Tr>
						{cols.map((col) => (
							<Th key={col}>{col}</Th>
						))}
					</Tr>
				</Thead>
				{children}
			</Table>
		</Box>
	);
};

export default TableLayout;
