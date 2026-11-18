import { Box, Table, Thead, Tr } from "@chakra-ui/react";
import { ALIGN_COLS, COLS, TITLE_COLS } from "constant";
import TextTitle from "../text/TextTitle";
import SortableTh from "./SortableTh";

// TABLE-SORT: optional sortKeys ({ [column title]: key }), sortConfig and onSort
// from hooks/useSortableData, as in TableLayout
const WorkviewTable = ({
	cols,
	isSmall,
	height,
	whiteSpace,
	children,
	overflowX,
	css,
	sortKeys,
	sortConfig,
	onSort,
}) => {
	const hideLabel = (text, label) => text.startsWith(label);

	return (
		<Box overflow="auto" maxH={height} overflowX={overflowX} css={css}>
			<Table variant={"simple"}>
				<Thead position="sticky" zIndex="docked" top={-1} textAlign="center">
					<Tr>
						{cols?.map((col, index) => (
							<SortableTh
								sortKey={sortKeys?.[col]}
								sortConfig={sortConfig}
								onSort={onSort}
								position={index === 0 && "sticky"}
								left={index === 0 && "0"}
								zIndex={index === 0 && 1}
								p={isSmall ? 1 : "auto"}
								key={`${col}_${index}`}
								width={"98px"}
							>
								<TextTitle
									weight={TITLE_COLS.includes(col) && 800}
									width={col === COLS.EMP_NAME ? "150px" : "98px"}
									visibility={
										(hideLabel(col, "detail") ||
											hideLabel(col, "amount") ||
											hideLabel(col, "ee") ||
											hideLabel(col, "er")) &&
										"hidden"
									}
									whiteSpace={whiteSpace}
									title={col}
									align={ALIGN_COLS.includes(col) && "end"}
								/>
							</SortableTh>
						))}
					</Tr>
				</Thead>
				{children}
			</Table>
		</Box>
	);
};

export default WorkviewTable;
