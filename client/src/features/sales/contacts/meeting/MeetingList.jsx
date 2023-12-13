import {
  Badge,
  Box,
  Card,
  CardBody,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";
import { Link } from "react-router-dom";

const MeetingList = ({ meetings }) => {
  return (
    <Box w="100%">
      <VStack spacing={4} w="100%">
        {meetings.map((meeting, index) => (
          <Card key={index} borderWidth="1px" borderRadius="lg" w="100%">
            <CardBody>
              <HStack justifyContent="space-between">
                <Badge colorScheme="teal">{meeting.type}</Badge>
                <Text fontSize="sm" color="gray.500">
                  {moment(meeting.date).format("MMM DD, YYYY hh:mm A Z")}
                </Text>
              </HStack>
              <Text mt={2}>Description: {meeting.description}</Text>
              <Text>Attendees: {meeting.attendees} </Text>
              <Text>Location: {meeting.location} </Text>
              <Text>
                Meeting Date: {moment(meeting.fromDate).format("MMM DD, YYYY ")}
                {meeting.fromTime}
              </Text>
              <Text>
                Meeting Link:{" "}
                <Link href={meeting.meetingLink} isexternal>
                  <Text as="span" color="blue.400">
                    {meeting.meetingLink}
                  </Text>
                </Link>
              </Text>
            </CardBody>
          </Card>
        ))}
      </VStack>
    </Box>
  );
};

export default MeetingList;
