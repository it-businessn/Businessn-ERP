import { Box, Button, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useState } from "react";
import { BsPlus } from "react-icons/bs";
import { formatDate } from "utils";
import AddEvent from "../calendar/AddEvent";

const CalendarTable = ({ cols, data, setIsRefresh }) => {
	const [showEventForm, setShowEventForm] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	return (
		<Box overflow="auto" fontWeight={"normal"}>
			<Button
				size={"xs"}
				onClick={() => setShowEventForm(true)}
				color={"brand.100"}
				bg={"var(--primary_button_bg)"}
				variant={"outline"}
				fontWeight={"bold"}
				_hover={{ bg: "transparent", color: "brand.600" }}
				leftIcon={<BsPlus />}
			>
				New
			</Button>

			{showEventForm && (
				<AddEvent
					setIsRefresh={setIsRefresh}
					isLoading={isLoading}
					setIsLoading={setIsLoading}
					isOpen={showEventForm}
					onClose={() => {
						setShowEventForm(false);
					}}
				/>
			)}
			<Table variant="simple" size={"small"}>
				<Thead>
					<Tr>
						{cols?.map((col) =>
							col === "s" || col === "s1" ? (
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
