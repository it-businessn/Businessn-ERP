import { Box, Checkbox, Table, Th, Thead, Tr } from "@chakra-ui/react";
import TextTitle from "../text/TextTitle";

const TableLayout = ({
	hasMulti,
	cols,
	children,
	isSmall,
	isAllChecked,
	handleHeaderCheckboxChange,
	isTimesheet,
	height,
	w,
	position,
	top,
	zIndex,
	variant = "simple",
	bg = "var(--lead_cards_bg)",
	inVisible,
	size = "xs",
}) => {
	return (
		<Box overflow="auto" height={height} w={w}>
			<Table variant={variant} bg={bg}>
				<Thead
					// position={position} top={top} zIndex={zIndex}
					position="sticky"
					top={-1}
					zIndex="docked"
				>
					<Tr display={inVisible && "none"}>
						{hasMulti && (
							<Th>
								<Checkbox
									checked={isAllChecked}
									colorScheme="facebook"
									onChange={(e) => handleHeaderCheckboxChange(e)}
								/>
							</Th>
						)}
						{cols?.map((col, index) => (
							<Th
								p={isSmall ? 1 : "auto"}
								pl={isTimesheet && index === 0 && "1em !important"}
								key={`${col}_${index}`}
							>
								<TextTitle size={size} title={col} />
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
