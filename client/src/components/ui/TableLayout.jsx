import { Box, Checkbox, Table, Th, Thead, Tr } from "@chakra-ui/react";

const TableLayout = ({
	hasMulti,
	cols,
	children,
	isSmall,
	isAllChecked,
	handleHeaderCheckboxChange,
}) => {
	return (
		<Box overflow="auto">
			<Table variant="simple">
				<Thead>
					<Tr>
						{hasMulti && (
							<Th>
								<Checkbox
									checked={isAllChecked}
									colorScheme="facebook"
									onChange={(e) => handleHeaderCheckboxChange(e)}
								/>
							</Th>
						)}
						{cols.map((col) => (
							<Th p={isSmall ? 1 : "auto"} key={col}>
								{col}
							</Th>
						))}
						{hasMulti && <Th>Action</Th>}
					</Tr>
				</Thead>
				{children}
			</Table>
		</Box>
	);
};

export default TableLayout;
//  {columns.map((column) => (
// 							<Th key={column}>
// 								<Menu>
// 									<MenuButton as={Text} cursor="pointer">
// 										{column}
// 									</MenuButton>
// 									<MenuList>
// 										<MenuItem onClick={() => handleColumnSelect(column)}>
// 											{selectedColumns.includes(column) ? "Hide" : "Show"}
// 										</MenuItem>
// 									</MenuList>
// 								</Menu>
// 							</Th>
// 						))}
