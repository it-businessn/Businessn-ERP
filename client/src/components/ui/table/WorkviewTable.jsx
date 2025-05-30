import { Box, Table, Th, Thead, Tr } from "@chakra-ui/react";
import { ALIGN_COLS, COLS, TITLE_COLS } from "constant";
import TextTitle from "../text/TextTitle";

const WorkviewTable = ({ cols, isSmall, height, whiteSpace, children, overflowX }) => {
	const hideLabel = (text, label) => text.startsWith(label);
	return (
		<Box overflow="auto" maxH={height} overflowX={overflowX}>
			<Table variant={"simple"}>
				<Thead position="sticky" zIndex="docked" top={-1} textAlign="center">
					<Tr>
						{cols?.map((col, index) => (
							<Th
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
							</Th>
						))}
					</Tr>
				</Thead>
				{children}
			</Table>
		</Box>
	);
};

export default WorkviewTable;
