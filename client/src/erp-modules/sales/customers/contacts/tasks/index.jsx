import {
	Badge,
	Box,
	Card,
	CardBody,
	Checkbox,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Spacer,
	Text,
	VStack,
} from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import InputFormControl from "components/ui/form/InputFormControl";
import TextTitle from "components/ui/text/TextTitle";
import moment from "moment";
import { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TaskService from "services/TaskService";

const Tasks = ({ contactId }) => {
	const [tasks, setTasks] = useState([]);
	const [dueDate, setDueDate] = useState(null);
	const [taskName, setTaskName] = useState("");

	useEffect(() => {
		fetchTasksByContactId(contactId);
	}, [contactId]);

	const handleAddTask = async (e) => {
		e.preventDefault();
		try {
			await TaskService.addTask({
				name: taskName,
				dueDate,
				status: "Open",
				contactId,
			});
			fetchTasksByContactId(contactId);
			setTaskName("");
			setDueDate(null);
		} catch (error) {
			console.error(error);
		}
	};

	const handleCheckboxChange = async (checked, task) => {
		task.status = checked ? "Closed" : "Open";
		try {
			await TaskService.updateTask(task, task._id);
			fetchTasksByContactId(contactId);
		} catch (error) {
			console.error("Error adding opportunity:", error);
		}
	};
	const fetchTasksByContactId = async (contact) => {
		try {
			const response = await TaskService.getTaskByContactId(contact);
			setTasks(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Box>
			<VStack spacing={4}>
				<form className="tab-form">
					<InputFormControl
						label={"Task Name"}
						valueText={taskName}
						placeholder="Enter task name"
						handleChange={(e) => setTaskName(e.target.value)}
						required
					/>

					<FormControl id="dueDate" isRequired>
						<FormLabel>Due Date</FormLabel>
						<ReactDatePicker
							className="date-picker"
							selected={dueDate}
							onChange={(date) => setDueDate(date)}
							dateFormat="yyyy-MM-dd"
							placeholderText="Select due date"
						/>
					</FormControl>
					<PrimaryButton
						name={"Add Task"}
						size={"sm"}
						mt={4}
						isDisabled={taskName === ""}
						onOpen={handleAddTask}
					/>
				</form>
				<Box w="100%">
					{/* <Text fontSize="xl" fontWeight="bold" mb={4}>
            Tasklist
          </Text> */}
					<VStack spacing={4} w="100%">
						{tasks.length > 0 &&
							tasks.map((task) => (
								<Card key={task} borderWidth="1px" borderRadius="lg" w="100%">
									<CardBody>
										<VStack alignItems="start" spacing={4}>
											<Badge bg="brand.logo_bg">{task.status}</Badge>
											<Flex w={"100%"}>
												<HStack spacing={4} w="70%">
													<Checkbox
														colorScheme="facebook"
														isChecked={task.status === "Closed"}
														onChange={(e) =>
															handleCheckboxChange(e.target.checked, task)
														}
														borderRadius="full"
														borderColor="brand.logo_b"
														iconColor="brand.logo_bg"
														size="md"
													/>
													<Text>{task.name}</Text>
												</HStack>
												<Spacer />
												<TextTitle
													color="brand.400"
													weight="normal"
													title={`Due Date: ${moment(task?.dueDate).format(
														"MMM DD, YYYY hh:mm A Z",
													)}`}
												/>
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
