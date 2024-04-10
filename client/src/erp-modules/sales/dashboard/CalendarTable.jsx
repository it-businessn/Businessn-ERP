import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { formatDate } from "utils";

const CalendarTable = ({ cols, data }) => {
	return (
		<Box overflow="auto" fontWeight={"normal"}>
			<Table variant="simple">
				<Thead>
					<Tr>
						{cols?.map((col) =>
							col === "s" || col === "s1" ? (
								<Th key={col} />
							) : (
								<Th key={col}>{col}</Th>
							),
						)}
					</Tr>
				</Thead>
				<Tbody>
					{data?.map((item) => (
						<Tr key={item._id}>
							<Td fontSize={"xs"}>{item.description}</Td>
							<Td fontSize={"xs"}>{`${formatDate(item.fromDate)} ${
								item.fromTime
							}`}</Td>
							<Td fontSize={"xs"}>
								<Td fontSize={"xs"}>{`${formatDate(item.toDate)} ${
									item.toTime
								}`}</Td>
							</Td>
							<Td fontSize={"xs"}>{item.eventLink}</Td>
							<Td fontSize={"xs"}>{item.location}</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</Box>
	);
};

export default CalendarTable;
