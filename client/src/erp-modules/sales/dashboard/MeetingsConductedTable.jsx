import {
	Avatar,
	Button,
	Flex,
	Table,
	Tbody,
	Td,
	Text,
	Thead,
	Tr,
} from "@chakra-ui/react";
import SortableTh from "components/ui/table/SortableTh";
import useSortableData from "hooks/useSortableData";

// TABLE-SORT: sort by what each cell shows (stable function keys)
const byMeetingDate = (meeting) => {
	const time = Date.parse(meeting.meetingDate);
	return Number.isNaN(time) ? meeting.meetingDate : time;
};
const byDuration = (meeting) => meeting.duration.hours * 60 + Number(meeting.duration.minutes);
const byStatus = (meeting) => (meeting.status === "completed" ? "Completed" : "Scheduled");

const MeetingsConductedTable = ({ meetingsData }) => {
	const { sortedItems, sortConfig, requestSort } = useSortableData(meetingsData);
	return (
		<Table color={"var(--nav_color)"} bg={"var(--primary_bg)"} size={"small"}>
			<Thead>
				<Tr fontSize={"xs"}>
					<SortableTh sortKey="customerName" sortConfig={sortConfig} onSort={requestSort} p={0}>
						Customer Name
					</SortableTh>
					<SortableTh sortKey={byMeetingDate} sortConfig={sortConfig} onSort={requestSort}>
						Meeting Date
					</SortableTh>
					<SortableTh sortKey={byDuration} sortConfig={sortConfig} onSort={requestSort}>
						Duration
					</SortableTh>
					<SortableTh sortKey={byStatus} sortConfig={sortConfig} onSort={requestSort}>
						Status
					</SortableTh>
				</Tr>
			</Thead>
			<Tbody border={"none"} color={"var(--nav_color)"}>
				{sortedItems.map((meeting, index) => (
					<Tr key={`${meeting.customerName}-${meeting.meetingDate}`}>
						<Td p={0} fontSize={"xs"} py={0}>
							<Flex align="center">
								<Avatar
									size={"sm"}
									src={meeting.profilePic}
									name={meeting.customerName}
								/>
								<Text ml="2">{meeting.customerName}</Text>
							</Flex>
						</Td>
						<Td fontSize={"xs"} py={0}>
							{meeting.meetingDate}
						</Td>
						<Td
							fontSize={"xs"}
							py={0}
						>{`${String(meeting.duration.hours).padStart(2, "0")}:${String(meeting.duration.minutes).padStart(2, "0")}h`}</Td>
						<Td py={1} fontSize={"xs"}>
							<Button
								bg={"var(--tint_slate)"}
								color={meeting.status === "completed" ? "#8d8fb3" : "#8d8fb3"}
								size="xs"
								_hover={{ color: "var(--main_color_black)" }}
							>
								{meeting.status === "completed" ? "Completed" : "Scheduled"}
							</Button>
						</Td>
					</Tr>
				))}
			</Tbody>
		</Table>
	);
};

export default MeetingsConductedTable;
