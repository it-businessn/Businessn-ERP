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
			<LeftIconButton
				name={"New"}
				handleClick={() => setShowEventForm(true)}
				icon={<BsPlus />}
			/>

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
			<Table variant="simple" size={"small"}>
				<Thead>
					<Tr>
						{cols?.map((col) =>
							col === "hideCol1" || col === "hideCol2" ? (
								<Th fontSize={"12px"} key={col} />
							) : (
								<Th fontSize={"12px"} key={col}>
									{col}
								</Th>
							),
						)}
					</Tr>
				</Thead>
				<Tbody>
					{(!data || data?.length === 0) && (
						<EmptyRowRecord data={data} colSpan={cols?.length} />
					)}
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
