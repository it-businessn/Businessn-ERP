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
    <Table color={"brand.nav_color"} bg={"brand.primary_bg"}>
      <Thead>
        <Tr fontSize={"sm"}>
          <Th>Customer Name</Th>
          <Th>Meeting Date</Th>
          <Th>Duration</Th>
          <Th>Status</Th>
        </Tr>
      </Thead>
      <Tbody border={"none"} color={"brand.nav_color"}>
        {meetingsData.map((meeting, index) => (
          <Tr key={index} fontSize={"sm"}>
            <Td py={0}>
              <Flex align="center">
                <Avatar
                  size={"sm"}
                  src={meeting.profilePic}
                  name={meeting.customerName}
                />
                <Text ml="2">{meeting.customerName}</Text>
              </Flex>
            </Td>
            <Td py={0}>{meeting.meetingDate}</Td>
            <Td
              py={0}
            >{`0${meeting.duration.hours}:${meeting.duration.minutes}h`}</Td>
            <Td p={1}>
              <Button
                bg={"#d8dce9"}
                color={meeting.status === "completed" ? "#8d8fb3" : "#8d8fb3"}
                size="sm"
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
