import {
  Badge,
  Box,
  Card,
  CardBody,
  Checkbox,
  Flex,
  HStack,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import * as api from "services";

const TaskByDate = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchAllTasksByDate();
  }, []);

  const handleCheckboxChange = async (checked, task) => {
    task.status = checked ? "Closed" : "Open";
    try {
      await api.updateEvent(task, task._id);
      fetchAllTasksByDate();
    } catch (error) {
      console.error("Error adding opportunity:", error);
    }
  };

  const fetchAllTasksByDate = async () => {
    try {
      const response = await api.getEvents();
      const tasksByDate = response.data.filter(
        (task) => task.taskDueDate !== null
      );
      tasksByDate.map((task) => (task.status = "Open"));
      setTasks(tasksByDate);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <VStack spacing={4}>
        <Box w="98%">
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Tasks
          </Text>
          <VStack spacing={4} w="100%">
            {tasks.length > 0 &&
              tasks.map((task, index) => (
                <Card key={index} borderWidth="1px" borderRadius="lg" w="100%">
                  <CardBody>
                    <VStack alignItems="start" spacing={4}>
                      <Badge colorScheme="teal">{task.status}</Badge>
                      <Flex w={"100%"}>
                        <HStack spacing={4} w="70%">
                          <Checkbox
                            isChecked={task.status === "Closed"}
                            onChange={(e) =>
                              handleCheckboxChange(e.target.checked, task)
                            }
                            borderRadius="full"
                            borderColor="teal.500"
                            iconColor="teal.500"
                            size="md"
                          />
                          <Text>{task.description}</Text>
                        </HStack>
                        <Spacer />
                        <Text color="brand.400">
                          Due Date:
                          {moment(task?.dueDate).format(
                            "MMM DD, YYYY hh:mm A Z"
                          )}
                        </Text>
                      </Flex>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default TaskByDate;
