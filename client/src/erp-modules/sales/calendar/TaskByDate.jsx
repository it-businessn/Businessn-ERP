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
import CalendarService from "services/CalendarService";

const TaskByDate = () => {
	const [tasks, setTasks] = useState([]);

	useEffect(() => {
		fetchAllTasksByDate();
	}, []);

	const handleCheckboxChange = async (checked, task) => {
		task.status = checked ? "Closed" : "Open";
		try {
			await CalendarService.updateEvent(task, task._id);
			fetchAllTasksByDate();
		} catch (error) {
			console.error("Error adding opportunity:", error);
		}
	};

	const fetchAllTasksByDate = async () => {
		try {
			const { data } = await CalendarService.getEvents();
			const tasksByDate = data.filter((task) => task.taskDueDate !== null);
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
								<Card key={task} borderWidth="1px" borderRadius="lg" w="100%">
									<CardBody>
										<VStack alignItems="start" spacing={4}>
											<Badge bg="var(--logo_bg)">{task.status}</Badge>
											<Flex w={"100%"}>
												<HStack spacing={4} w="70%">
													<Checkbox
														isChecked={task.status === "Closed"}
														onChange={(e) => handleCheckboxChange(e.target.checked, task)}
														colorScheme="facebook"
														borderRadius="full"
														borderColor="var(--logo_bg)"
														iconColor="var(--logo_bg)"
														size="md"
													/>
													<Text>{task.description}</Text>
												</HStack>
												<Spacer />
												<Text color="var(--gray2_color)">
													Due Date:
													{moment(task?.dueDate).format("MMM DD, YYYY hh:mm A Z")}
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
