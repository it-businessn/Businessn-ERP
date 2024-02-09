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
    <Table variant="striped" size="small">
      <Thead>
        <Tr>
          <Th>Customer Name</Th>
          <Th>Meeting Date</Th>
          <Th>Duration</Th>
          <Th>Status</Th>
        </Tr>
      </Thead>
      <Tbody>
        {meetingsData.map((meeting, index) => (
          <Tr key={index}>
            <Td>
              <Flex align="center">
                <Avatar src={meeting.profilePic} name={meeting.customerName} />
                <Text ml="2">{meeting.customerName}</Text>
              </Flex>
            </Td>
            <Td>{meeting.meetingDate}</Td>
            <Td>{`${meeting.duration.hours}:${meeting.duration.minutes}h`}</Td>
            <Td>
              <Button
                colorScheme={meeting.status === "completed" ? "green" : "blue"}
                size="sm"
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
