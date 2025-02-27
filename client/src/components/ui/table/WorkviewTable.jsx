import { Box, Table, Th, Thead, Tr } from "@chakra-ui/react";
import TextTitle from "../text/TextTitle";

const WorkviewTable = ({ cols, isSmall, height, whiteSpace, children, overflowX }) => {
	const hideLabel = (text, label) => text.startsWith(label);
	return (
		<Box overflow="auto" height={height} overflowX={overflowX} width={"80vw"}>
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
									weight={["Employee Name", "Total Hours", "Total Amount"].includes(col) && 800}
									width={col === "Employee Name" ? "150px" : "98px"}
									visibility={
										(hideLabel(col, "detail") ||
											hideLabel(col, "amount") ||
											hideLabel(col, "ee") ||
											hideLabel(col, "er")) &&
										"hidden"
									}
									whiteSpace={whiteSpace}
									title={col}
									align={
										[
											"Union Dues",
											"Employer Pension Plan (EE)",
											"Employer Health Plan (EE)",
											"ER Pension Plan",
											"ER Health Plan",
											"Payrate",
										].includes(col) && "end"
									}
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
