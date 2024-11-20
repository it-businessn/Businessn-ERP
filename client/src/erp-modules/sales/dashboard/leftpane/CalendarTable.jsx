import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import LeftIconButton from "components/ui/button/LeftIconButton";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import { useState } from "react";
import { BsPlus } from "react-icons/bs";
import { formatDate } from "utils";
import AddEvent from "../../calendar/AddEvent";

const CalendarTable = ({ cols, data, setIsRefresh, filterText, filter }) => {
	const [showEventForm, setShowEventForm] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	return (
		<Box overflow="auto" fontWeight={"normal"}>
			<LeftIconButton name={"New"} handleClick={() => setShowEventForm(true)} icon={<BsPlus />} />

			{showEventForm && (
				<AddEvent
					filter={filter}
					filterText={filterText}
					isLoading={isLoading}
					isOpen={showEventForm}
					setIsLoading={setIsLoading}
					setIsRefresh={setIsRefresh}
					onClose={() => {
						setShowEventForm(false);
					}}
				/>
			)}
			<Table variant={"simple"} size={"small"}>
				<Thead>
					<Tr>
						{cols?.map((col) =>
							col === "hideCol1" || col === "hideCol2" ? (
								<Th fontSize={"xs"} key={col} />
							) : (
								<Th
									fontSize={"xs"}
									key={col}
									textAlign={
										col.includes("Link") || col.includes("Description") ? "left" : "center"
									}
								>
									{col}
								</Th>
							),
						)}
					</Tr>
				</Thead>
				<Tbody>
					{(!data || data?.length === 0) && <EmptyRowRecord data={data} colSpan={cols?.length} />}
					{data?.map((item) => (
						<Tr key={item._id}>
							<Td pl={5} fontSize={"xs"} whiteSpace={"wrap"} width={"100px"}>
								{item.description}
							</Td>
							<Td textAlign={"center"} fontSize={"xs"} width={"50px"}>{`${formatDate(
								item.fromDate,
							)} ${item.fromTime}`}</Td>
							<Td textAlign={"center"} width={"50px"} fontSize={"xs"}>{`${formatDate(
								item.toDate,
							)} ${item.toTime}`}</Td>
							<Td fontSize={"xs"} whiteSpace={"wrap"} width={"100px"}>
								{item.eventLink}
							</Td>
							<Td fontSize={"xs"} width={"80px"} textAlign={"center"}>
								{item.location}
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</Box>
	);
};

export default CalendarTable;
