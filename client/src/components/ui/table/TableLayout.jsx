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
	autoScroll,
	specifyPaddingCols,
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
								pl={
									(isTimesheet && index === 0 && "1em !important") ||
									(specifyPaddingCols?.includes(col) && 0)
								}
								key={`${col}_${index}`}
								// width={
								// 	isEarning && index === 1 ? width2 : index === 2 && width2
								// }
							>
								<TextTitle
									width={
										col === "Hours" || col.includes("Current")
											? "50px"
											: isEarning && index === 0
											? width1
											: isEarning && index > 2
											? width2
											: !isEarning && index === 0
											? width1
											: !isEarning && index === 1
											? width2
											: width3
									}
									whiteSpace={col.includes("Hours") ? "wrap" : whiteSpace}
									size={textSize}
									title={col}
									align={
										autoScroll && (col === "Action" || col === "Status")
											? "center"
											: isEarning || isInfo
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
