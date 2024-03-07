import { AddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import {
	Alert,
	AlertIcon,
	Avatar,
	Button,
	Checkbox,
	FormControl,
	FormLabel,
	HStack,
	IconButton,
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
	Tr,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import ProjectService from "services/ProjectService";
import { PROJECT_ASSIGNEES, RANDOM_PEOPLE_ICON } from "./data";

const AddNewTask = ({ isOpen, onClose }) => {
	const defaultTask = {
		projectName: "",
		taskName: "",
		selectedAssignees: [],
		hasChecklist: false,
		todoItems: [],
	};
	const randomImgIndex = Math.floor(Math.random() * RANDOM_PEOPLE_ICON.length);
	const defaultChecklist = {
		taskName: "",
		assignee: "",
		avatarUrl: RANDOM_PEOPLE_ICON[randomImgIndex].url,
	};

	const [isSubmitting, setSubmitting] = useState(false);
	const [message, setMessage] = useState(false);
	const [formData, setFormData] = useState(defaultTask);
	const [projectName, setProjectName] = useState(defaultTask.projectName);
	const [taskName, setTaskName] = useState(defaultTask.taskName);
	const [selectedAssignees, setSelectedAssignees] = useState(
		defaultTask.selectedAssignees,
	);
	const [hasChecklist, setHasChecklist] = useState(defaultTask.hasChecklist);
	const [todoItems, setTodoItems] = useState(defaultTask.todoItems);
	const [todoItem, setTodoItem] = useState(defaultChecklist);

	const handleMultiAssigneesChange = (event) => {
		if (event.target.value === "") {
			return;
		}
		const selectedAssignee = {};
		selectedAssignee.name = event.target.value;
		selectedAssignee.avatarUrl = RANDOM_PEOPLE_ICON[randomImgIndex].url;
		if (
			selectedAssignees.length === 0 ||
			!selectedAssignees.some(
				(assignee) => assignee.name === selectedAssignee.name,
			)
		) {
			setSelectedAssignees((prevAssignees) => [
				...prevAssignees,
				selectedAssignee,
			]);
		}
	};

	const handleRemoveAssignee = (assigneeToRemove) => {
		setSelectedAssignees((prevAssignees) =>
			prevAssignees.filter(
				(assignee) => assignee.name !== assigneeToRemove.name,
			),
		);
	};

	const handleAddTodoItem = () => {
		todoItem.avatarUrl = RANDOM_PEOPLE_ICON[randomImgIndex].url;

		setTodoItems([...todoItems, todoItem]);
		setTodoItem(defaultChecklist);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setSubmitting(true);

		// const data = new FormData();
		// data.append("name", formData.name);
		// data.append("email", formData.email);
		// data.append("phoneNumber", formData.phoneNumber);
		// data.append("resume", formData.resume);

		try {
			await ProjectService.addTask({
				projectName,
				taskName,
				selectedAssignees,
				hasChecklist,
				todoItems,
			});
			onClose();
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
				<ModalHeader>Add New Task</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Stack spacing="5">
						<form onSubmit={handleSubmit}>
							<Stack spacing={4}>
								<FormControl>
									<FormLabel>Project name</FormLabel>
									<Input
										type="text"
										name="projectName"
										value={projectName}
										onChange={(e) => setProjectName(e.target.value)}
										required
									/>
								</FormControl>
								<FormControl>
									<FormLabel>Task name</FormLabel>
									<Input
										type="text"
										name="taskName"
										value={taskName}
										onChange={(e) => setTaskName(e.target.value)}
										required
									/>
								</FormControl>

								<FormControl>
									<FormLabel> Assignees</FormLabel>
									<Select
										icon={<FaCaretDown />}
										borderRadius="10px"
										size="sm"
										onChange={handleMultiAssigneesChange}
										placeholder="Select Assignee"
									>
										{PROJECT_ASSIGNEES.map(({ name }) => (
											<option value={name} key={name}>
												{name}
											</option>
										))}
									</Select>
								</FormControl>
								<FormControl>
									<FormLabel>Selected Assignees</FormLabel>
									{selectedAssignees?.map((assignee) => (
										<Button
											key={assignee.name}
											ml="2"
											size="sm"
											variant="ghost"
											color="teal.500"
											rightIcon={<SmallCloseIcon />}
											onClick={() => handleRemoveAssignee(assignee)}
										>
											<Avatar name={assignee.name} src={assignee.avatarUrl} />

											{assignee.name}
										</Button>
									))}
								</FormControl>
								<FormControl>
									<FormLabel>Has To-Do Checklist</FormLabel>
									<Checkbox
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
												<FormLabel>Task Name</FormLabel>
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
												<FormLabel>Select Assignee</FormLabel>
												<Select
													icon={<FaCaretDown />}
													borderRadius="10px"
													value={todoItem.assignee}
													onChange={(e) => {
														if (e.target.value !== "") {
															setTodoItem((prev) => ({
																...prev,
																assignee: e.target.value,
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
											<IconButton
												icon={<AddIcon />}
												isDisabled={
													todoItem.taskName === "" || todoItem.assignee === ""
												}
												onClick={handleAddTodoItem}
												variant={"ghost"}
												size={"xs"}
												mt={5}
											/>
										</HStack>
										{todoItems.length > 0 && (
											<FormControl>
												<FormLabel>Checklist</FormLabel>
												<Table
													variant="unstyled"
													ml={4}
													size={"small"}
													w={"75%"}
												>
													<Tbody>
														{todoItems?.map((todo) => (
															<Tr>
																<Td>
																	<Checkbox isChecked={true} isDisabled>
																		{todo.taskName}
																	</Checkbox>
																</Td>
																<Td>
																	<Avatar
																		name={todo.assignee}
																		size={"sm"}
																		src={todo.avatarUrl}
																	/>
																</Td>
															</Tr>
														))}
													</Tbody>
												</Table>
											</FormControl>
										)}
									</>
								)}
								<HStack justifyContent={"end"}>
									<Button
										isLoading={isSubmitting}
										type="submit"
										bg="brand.logo_bg"
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

export default AddNewTask;
