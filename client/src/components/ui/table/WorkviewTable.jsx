import { Box, Table, Th, Thead, Tr } from "@chakra-ui/react";
import TextTitle from "../text/TextTitle";

const WorkviewTable = ({
	cols,
	isSmall,
	height,
	whiteSpace,
	children,
	overflowX,
}) => {
	const hideLabel = (text, label) => text.startsWith(label);
	return (
		<Box overflow="auto" height={height} overflowX={overflowX}>
			<Table variant={"simple"}>
				<Thead position="sticky" zIndex="docked" top={-1} textAlign="center">
					<Tr>
						{cols?.map((col, index) => (
							<Th
								p={isSmall ? 1 : "auto"}
								key={`${col}_${index}`}
								width={"98px"}
							>
								<TextTitle
									width={"98px"}
									visibility={
										(hideLabel(col, "detail") ||
											hideLabel(col, "amount") ||
											hideLabel(col, "ee") ||
											hideLabel(col, "er")) &&
										"hidden"
									}
									whiteSpace={whiteSpace}
									title={col}
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
