import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as api from "services";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    fetchTasks();
  }, []);
  const [dueDate, setDueDate] = useState(null);
  const [taskName, setTaskName] = useState("");
  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await api.addTask({
        name: taskName,
        dueDate,
        status: "Open",
      });
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckboxChange = async (checked, task) => {
    task.status = checked ? "Closed" : "Open";
    try {
      await api.updateTask(task, task._id);
      fetchTasks();
    } catch (error) {
      console.error("Error adding opportunity:", error);
    }
  };
  const fetchTasks = async () => {
    try {
      const response = await api.getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <VStack spacing={4}>
        <FormControl id="taskName" isRequired>
          <FormLabel>Task Name</FormLabel>
          <Input
            type="text"
            placeholder="Enter task name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
        </FormControl>

        <FormControl id="dueDate" isRequired>
          <FormLabel>Due Date</FormLabel>
          <ReactDatePicker
            selected={dueDate}
            onChange={(date) => setDueDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select due date"
          />
        </FormControl>

        <Button
          isDisabled={taskName === ""}
          colorScheme="teal"
          onClick={handleAddTask}
        >
          Add Task
        </Button>
        <Box w="100%">
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Tasklist
          </Text>
          <VStack spacing={4} w="100%">
            {tasks.length > 0 &&
              tasks.map((task, index) => (
                <Card key={index} borderWidth="1px" borderRadius="lg" w="100%">
                  <CardBody>
                    <VStack alignItems="start" spacing={4}>
                      <Badge colorScheme="teal">{task.status}</Badge>
                      <Flex w={"100%"}>
                        <HStack spacing={4}>
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
                          <Text>{task.name}</Text>
                        </HStack>
                        <Spacer />
                        <Text color="brand.400">
                          Due Date:{" "}
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

export default Tasks;
