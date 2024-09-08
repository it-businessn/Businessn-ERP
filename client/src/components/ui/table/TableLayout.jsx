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
	textSize = "xs",
	textAlign,
	tableSize,
	whiteSpace,
	colBg,
	width1,
	width2,
	width3,
	isEarning,
	isInfo,
}) => {
	return (
		<Box overflow="auto" height={height} w={w}>
			<Table variant={variant} bg={bg} size={tableSize}>
				<Thead position={position} top={top} zIndex={zIndex}>
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
								bg={colBg}
								textAlign={index < 2 ? "left" : textAlign}
								p={isSmall ? 1 : "auto"}
								pl={isTimesheet && index === 0 && "1em !important"}
								key={`${col}_${index}`}
							>
								<TextTitle
									width={
										isEarning && index === 0
											? width1
											: isEarning && index > 2
											? width2
											: !isEarning && index === 0
											? width1
											: !isEarning && index === 1
											? width2
											: width3
									}
									whiteSpace={whiteSpace}
									size={textSize}
									title={col}
									align={
										isEarning || isInfo
											? index === 4
												? "right"
												: index === 0
												? "left"
												: "right"
											: "left"
									}
								/>
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
