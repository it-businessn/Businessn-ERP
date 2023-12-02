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

const LogActivityList = ({ activities, showLogForm }) => {
  return (
    <Box w="100%">
      <Flex justifyContent="space-between">
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Activities
        </Text>
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
                  {activity.date.toLocaleString()}
                </Text>
              </HStack>
              <Text mt={2} fontSize="lg" fontWeight="bold">
                {activity.description}
              </Text>
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
