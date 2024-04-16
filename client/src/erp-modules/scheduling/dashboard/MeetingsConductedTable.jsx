import {
	Avatar,
	Button,
	Flex,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";

const MeetingsConductedTable = ({ meetingsData }) => {
	return (
		<Table color={"brand.nav_color"} bg={"brand.primary_bg"} size={"small"}>
			<Thead>
				<Tr fontSize={"xs"}>
					<Th p={0}>Customer Name</Th>
					<Th>Meeting Date</Th>
					<Th>Duration</Th>
					<Th>Status</Th>
				</Tr>
			</Thead>
			<Tbody border={"none"} color={"brand.nav_color"}>
				{meetingsData.map((meeting, index) => (
					<Tr key={meeting}>
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
						>{`0${meeting.duration.hours}:${meeting.duration.minutes}h`}</Td>
						<Td py={1} fontSize={"xs"}>
							<Button
								bg={"#d8dce9"}
								color={meeting.status === "completed" ? "#8d8fb3" : "#8d8fb3"}
								size="xs"
								_hover={{ color: "brand.600" }}
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
