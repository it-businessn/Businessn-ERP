import {
	Badge,
	Box,
	Card,
	CardBody,
	Checkbox,
	Flex,
	FormControl,
	FormLabel,
	VStack,
} from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import InputFormControl from "components/ui/form/InputFormControl";
import NormalTextTitle from "components/ui/NormalTextTitle";
import { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LogTaskService from "services/LogTaskService";
import { longTimeFormat } from "utils";

const Tasks = ({ contactId, user, company }) => {
	const [tasks, setTasks] = useState([]);
	const [refresh, setRefresh] = useState(false);

	const initialFormData = {
		dueDate: null,
		description: "",
		createdBy: user?._id,
		contactId,
		companyName: company,
	};
	const [task, setTask] = useState(initialFormData);

	useEffect(() => {
		const fetchTasksByContactId = async () => {
			try {
				const response = await LogTaskService.getTaskByContactId(contactId);
				setTasks(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchTasksByContactId();
	}, [contactId, refresh]);

	const handleAddTask = async () => {
		try {
			await LogTaskService.addTask(task);
			setRefresh((prev) => !prev);
			setTask(initialFormData);
		} catch (error) {
			console.error(error);
		}
	};

	const handleCheckboxChange = async (checked, id) => {
		try {
			await LogTaskService.updateTask({ checked }, id);
			setRefresh((prev) => !prev);
		} catch (error) {
			console.error("Error adding opportunity:", error);
		}
	};

	const handleInputChange = (e) => {
		setTask({ ...task, [e.target.name]: e.target.value });
	};
	return (
		<Box>
			<VStack spacing={4}>
				<form className="tab-form">
					<InputFormControl
						label={"Task Name"}
						name="description"
						valueText={task.description}
						placeholder="Enter task name"
						handleChange={handleInputChange}
						required
					/>

					<FormControl id="dueDate" isRequired>
						<FormLabel>Due Date</FormLabel>
						<ReactDatePicker
							name="dueDate"
							className="date-picker"
							selected={task.dueDate}
							onChange={(date) => {
								setTask({ ...task, dueDate: date });
							}}
							dateFormat="yyyy-MM-dd"
							placeholderText="Select due date"
						/>
					</FormControl>
					<PrimaryButton
						name={"Add Task"}
						size={"sm"}
						mt={4}
						isDisabled={task.description === ""}
						onOpen={(e) => {
							e.preventDefault();
							handleAddTask();
						}}
					/>
				</form>
				<Box w="100%">
					{/* <Text fontSize="xl" fontWeight="bold" mb={4}>
            Tasklist
          </Text> */}
					<VStack spacing={4} w="100%">
						{tasks?.map(({ _id, status, description, dueDate }) => (
							<Card key={_id} borderWidth="1px" borderRadius="lg" w="100%">
								<CardBody>
									<Flex justifyContent="space-between">
										<Badge
											bg="var(--primary_bg)"
											color="var(--primary_button_bg)"
										>
											{status}
										</Badge>
										<NormalTextTitle
											size="sm"
											// title={moment(createdOn).format("MMM DD, YYYY hh:mm A Z")}
											title={longTimeFormat(dueDate)}
											color="gray.500"
											align="end"
										/>
									</Flex>
									<Flex w={"100%"} gap={3}>
										<Checkbox
											colorScheme="facebook"
											isChecked={status === "Closed"}
											onChange={(e) =>
												handleCheckboxChange(e.target.checked, _id)
											}
											size="md"
										/>
										<NormalTextTitle title={description} />
									</Flex>
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
