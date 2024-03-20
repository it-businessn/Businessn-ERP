import { SmallAddIcon } from "@chakra-ui/icons";
import {
	Alert,
	AlertIcon,
	Avatar,
	Button,
	Checkbox,
	FormControl,
	FormLabel,
	HStack,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Select,
	Stack,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import Caption from "erp-modules/sales/lead docket/Caption";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import ProjectService from "services/ProjectService";
import { getDefaultDate } from "utils";
import { PROJECT_ASSIGNEES } from "../project/data";

const AddNewActivity = ({
	isOpen,
	onClose,
	setRefresh,
	allProjects,
	allProjectTasks,
}) => {
	const defaultTask = {
		projectId: "",
		projectName: "",
		taskId: "",
		taskName: "",
		activities: [],
	};

	const defaultTodoItems = {
		taskName: "",
		selectedAssignee: "",
		dueDate: null,
		timeToComplete: 0,
	};
	const [todoItem, setTodoItem] = useState(defaultTodoItems);
	const [todoItems, setTodoItems] = useState([]);

	const [hasChecklist, setHasChecklist] = useState(false);

	const [isSubmitting, setSubmitting] = useState(false);
	const [message, setMessage] = useState(false);
	const [formData, setFormData] = useState(defaultTask);

	const handleAddTodoItem = () => {
		setTodoItems([...todoItems, todoItem]);
		setTodoItem(defaultTodoItems);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		formData.activities = todoItems;
		try {
			await ProjectService.addActivity(formData);
			onClose();
			setFormData(defaultTask);
			setTodoItems([]);
			setRefresh((prev) => !prev);
		} catch (error) {
			setMessage("An error occurred while submitting the application.");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Modal isCentered size={"4xl"} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Add New Activity</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Stack spacing="5">
						<form onSubmit={handleSubmit}>
							<Stack spacing={4}>
								<FormControl>
									<FormLabel>Select Project</FormLabel>
									<Select
										icon={<FaCaretDown />}
										borderRadius="10px"
										value={formData?.projectId || ""}
										placeholder="Select Project"
										onChange={(e) => {
											const selectedValue = e.target.value;
											if (selectedValue !== "") {
												const { id, projectName } = allProjects.find(
													(project) => project.id === selectedValue,
												);
												setFormData((prevData) => ({
													...prevData,
													projectName,
													projectId: id,
												}));
											}
										}}
									>
										{allProjects?.map(({ id, projectName }) => (
											<option value={id} key={id}>
												{projectName}
											</option>
										))}
									</Select>
								</FormControl>

								<FormControl>
									<FormLabel>Select Task</FormLabel>
									<Select
										icon={<FaCaretDown />}
										borderRadius="10px"
										value={formData?.taskId || ""}
										placeholder="Select Task"
										onChange={(e) => {
											const selectedValue = e.target.value;
											if (selectedValue !== "") {
												const { id, taskName } = allProjectTasks.find(
													(task) => task.id === selectedValue,
												);
												setFormData((prevData) => ({
													...prevData,
													taskName,
													taskId: id,
												}));
											}
										}}
									>
										{allProjectTasks?.map(({ id, taskName }) => (
											<option value={id} key={id}>
												{taskName}
											</option>
										))}
									</Select>
								</FormControl>
								<FormControl>
									<FormLabel>Do you want to add activity checklist?</FormLabel>
									<Checkbox
										colorScheme={"facebook"}
										isChecked={hasChecklist}
										onChange={() => setHasChecklist(!hasChecklist)}
									>
										Yes
									</Checkbox>
								</FormControl>
								{hasChecklist && (
									<>
										<HStack spacing={4}>
											<FormControl>
												<FormLabel>Activity Name</FormLabel>
												<Input
													type="text"
													name=""
													value={todoItem.taskName}
													onChange={(e) =>
														setTodoItem((prev) => ({
															...prev,
															taskName: e.target.value,
														}))
													}
												/>
											</FormControl>
											<FormControl>
												<FormLabel visibility={"hidden"}>
													Select Assignee
												</FormLabel>
												<Select
													icon={<FaCaretDown />}
													borderRadius="10px"
													value={todoItem.selectedAssignee}
													onChange={(e) => {
														if (e.target.value !== "") {
															setTodoItem((prev) => ({
																...prev,
																selectedAssignee: e.target.value,
															}));
														}
													}}
													placeholder="Select Assignee"
												>
													{PROJECT_ASSIGNEES.map(({ name }) => (
														<option value={name} key={name}>
															{name}
														</option>
													))}
												</Select>
											</FormControl>
										</HStack>
										<HStack>
											<FormControl>
												<FormLabel>Activity due date</FormLabel>
												<input
													className="date_picker"
													type="date"
													id="dueDate"
													name="dueDate"
													value={todoItem?.dueDate}
													onChange={(e) =>
														setTodoItem((prev) => ({
															...prev,
															dueDate: e.target.value,
														}))
													}
													required
												/>
											</FormControl>
											<FormControl>
												<FormLabel>
													Time to complete activity (in hours)
												</FormLabel>
												<Input
													type="text"
													name="timeToComplete"
													value={todoItem?.timeToComplete}
													onChange={(e) =>
														setTodoItem((prev) => ({
															...prev,
															timeToComplete: e.target.value,
														}))
													}
													required
												/>
											</FormControl>

											<Button
												isDisabled={todoItem.taskName === ""}
												onClick={handleAddTodoItem}
												size="sm"
												px={"2em"}
												leftIcon={<SmallAddIcon />}
												mt={6}
												justifyContent={"center"}
												variant={"outline"}
											>
												Add
											</Button>
										</HStack>
									</>
								)}
								{todoItems?.length > 0 && (
									<FormControl>
										<Caption title={"Checklist"} />
										<Table variant="unstyled" size={"small"} w={"80%"}>
											<Thead fontSize={"xs"}>
												<Th>To-do Task </Th>
												<Th>Assignee</Th>
												<Th>Due Date</Th>
												<Th>Time to complete</Th>
											</Thead>
											<Tbody>
												{todoItems?.map((todo) => (
													<Tr>
														<Td>
															<HStack>
																<Checkbox isDisabled colorScheme="facebook" />
																<Text fontSize={"xs"}>{todo.taskName}</Text>
															</HStack>
														</Td>

														<Td>
															<Avatar
																name={todo.selectedAssignee}
																size={"sm"}
																src={todo.selectedAssignee}
															/>
														</Td>
														<Td>{getDefaultDate(todo?.dueDate)}</Td>
														<Td>{todo?.timeToComplete}</Td>
													</Tr>
												))}
											</Tbody>
										</Table>
									</FormControl>
								)}
								<HStack justifyContent={"end"}>
									<Button
										isLoading={isSubmitting}
										type="submit"
										bg="brand.logo_bg"
										isDisabled={formData.taskName === ""}
									>
										Add
									</Button>
									<Button onClick={onClose} colorScheme="gray">
										Cancel
									</Button>
								</HStack>
							</Stack>
						</form>
						{message && (
							<Alert status="error" mt={4}>
								<AlertIcon />
								{message}
							</Alert>
						)}
					</Stack>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default AddNewActivity;
