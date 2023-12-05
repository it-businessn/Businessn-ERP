import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";

const LogActivityList = ({ activities, showLogForm }) => {
  return (
    <Box w="100%">
      <Flex justifyContent="flex-end" mb={2}>
        <Button onClick={() => showLogForm(true)} colorScheme="teal">
          Add New Log
        </Button>
      </Flex>
      <VStack spacing={4} w="100%">
        {activities.map((activity, index) => (
          <Card key={index} borderWidth="1px" borderRadius="lg" w="100%">
            <CardBody>
              <HStack justifyContent="space-between">
                <Badge colorScheme="teal">{activity.type}</Badge>
                <Text fontSize="sm" color="gray.500">
                  {moment(activity.date).format("MMM DD, YYYY hh:mm A Z")}
                </Text>
              </HStack>
              <Text mt={2}>{activity.description}</Text>
              <Text mt={2}>Number of Phone Calls: {activity.phoneCalls}</Text>
              <Text>Duration: {activity.duration} minutes</Text>
            </CardBody>
          </Card>
        ))}
      </VStack>
    </Box>
  );
};

export default LogActivityList;
