import { AddIcon } from "@chakra-ui/icons";
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
import MultiSelectBox from "../../../../components/ui/select/MultiSelectBox";
import { PROJECT_ASSIGNEES } from "../project/data";

const AddNewProjectTask = ({
	isOpen,
	onClose,
	task,
	projectId,
	setRefresh,
}) => {
	const defaultTask = {
		taskId: task._id,
		taskName: task.taskName,
		subtasks: task?.subtasks,
		selectedAssignees: task?.selectedAssignees,
		hasChecklist: false,
		action: [],
		dueDate: task?.dueDate && getDefaultDate(task?.dueDate),
		timeToComplete: task?.timeToComplete || 0,
	};
	const defaultChecklist = {
		taskName: "",
		selectedAssignee: "",
	};
	const [hasChecklist, setHasChecklist] = useState(defaultTask.hasChecklist);
	const defaultSubtask = { taskName: "", selectedAssignees: [] };

	const [isSubmitting, setSubmitting] = useState(false);
	const [message, setMessage] = useState(false);
	const [formData, setFormData] = useState(defaultTask);
	const [subtask, setSubTask] = useState(defaultSubtask);
	const [subTasks, setSubTasks] = useState([]);
	const [todoItem, setTodoItem] = useState(defaultChecklist);

	const [subtaskAdded, setSubTaskAdded] = useState(false);
	const [openAssigneeMenu, setOpenAssigneeMenu] = useState(false);

	const handleMenuToggle = () => {
		setOpenAssigneeMenu((prev) => !prev);
	};

	const handleCloseMenu = (selectedOptions) => {
		setOpenAssigneeMenu(false);
		setSubTask((prevTask) => ({
			...prevTask,
			selectedAssignees: selectedOptions,
		}));
	};
	const handleSubTaskNameChange = (e) => {
		const updatedTaskName = e.target.value;
		setSubTask((prevTask) => ({
			...prevTask,
			taskName: updatedTaskName,
		}));
	};
	const [todoItems, setTodoItems] = useState(defaultTask.action);

	const handleAddTodoItem = () => {
		setTodoItems([...todoItems, todoItem]);
		setTodoItem(defaultChecklist);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		formData.subtasks = subTasks;
		formData.hasChecklist = hasChecklist;
		formData.action = todoItems;
		try {
			await ProjectService.addProjectTask(formData, projectId);
			onClose();
			setFormData(defaultTask);
			setSubTasks([]);
			setRefresh((prev) => !prev);
		} catch (error) {
			setMessage("An error occurred. Please try again.");
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
									<FormLabel>Task name</FormLabel>
									<Input
										type="text"
										name="taskName"
										value={formData.taskName}
										onChange={(e) =>
											setFormData((prevData) => ({
												...prevData,
												taskName: e.target.value,
											}))
										}
										required
									/>
								</FormControl>
								<HStack>
									<FormControl>
										<FormLabel>Due date</FormLabel>
										<input
											className="date_picker"
											type="date"
											id="dueDate"
											name="dueDate"
											value={formData.dueDate}
											onChange={(e) =>
												setFormData((prevData) => ({
													...prevData,
													dueDate: e.target.value,
												}))
											}
											required
										/>
									</FormControl>
									<FormControl>
										<FormLabel>Time to complete (in hours)</FormLabel>
										<Input
											type="text"
											name="timeToComplete"
											value={formData.timeToComplete}
											onChange={(e) =>
												setFormData((prevData) => ({
													...prevData,
													timeToComplete: e.target.value,
												}))
											}
											required
										/>
									</FormControl>
								</HStack>
								<HStack spacing={4}>
									<FormControl>
										<FormLabel>Subtask Name</FormLabel>
										<Input
											type="text"
											value={subtask.taskName}
											onChange={handleSubTaskNameChange}
										/>
									</FormControl>
									<FormControl>
										<FormLabel visibility={openAssigneeMenu ? "" : "hidden"}>
											Select Assignee
										</FormLabel>
										<Button
											rightIcon={<FaCaretDown />}
											bg={"brand.primary_bg"}
											color={"brand.primary_button_bg"}
											_hover={{
												bg: "brand.primary_bg",
												color: "brand.primary_button_bg",
											}}
										>
											{openAssigneeMenu ? (
												<MultiSelectBox
													openMenu={openAssigneeMenu}
													handleCloseMenu={handleCloseMenu}
												/>
											) : (
												<Text onClick={handleMenuToggle}>
													{subtask.selectedAssignees?.length > 0
														? `${subtask.selectedAssignees?.length} assignees`
														: "Select Assignee"}
												</Text>
											)}
										</Button>
									</FormControl>

									<IconButton
										icon={<AddIcon />}
										isDisabled={formData.taskName === ""}
										onClick={(e) => {
											e.preventDefault();
											setSubTaskAdded(true);
											setSubTasks([...subTasks, subtask]);
											setSubTask(defaultSubtask);
										}}
										variant={"ghost"}
										size={"xs"}
										mt={5}
									/>
								</HStack>
								<FormControl>
									<FormLabel>Has To-Do Checklist</FormLabel>
									<Checkbox
										colorScheme={"facebook"}
										isChecked={hasChecklist}
										onChange={() => setHasChecklist(!hasChecklist)}
									>
										Yes
									</Checkbox>
								</FormControl>
								{hasChecklist && (
									<HStack spacing={4}>
										<FormControl>
											<FormLabel>Todo Task Name</FormLabel>
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
										<IconButton
											icon={<AddIcon />}
											isDisabled={
												todoItem.taskName === "" ||
												todoItem.selectedAssignee === ""
											}
											onClick={handleAddTodoItem}
											variant={"ghost"}
											size={"xs"}
											mt={5}
										/>
									</HStack>
								)}
								{subtaskAdded && (
									<FormControl>
										<Caption title={"All subtasks"} />
										<Table variant="unstyled" mt={4} size={"small"}>
											<Thead fontSize={"xs"}>
												<Th>Subtask </Th>
												<Th>Assignees</Th>
											</Thead>
											<Tbody>
												{subTasks?.map((task) => (
													<Tr key={task}>
														<Td>{task.taskName}</Td>
														<Td>
															<HStack>
																{task.selectedAssignees?.map((assignee) => (
																	<Avatar
																		key={assignee}
																		name={assignee}
																		size={"sm"}
																		src={assignee}
																	/>
																))}
															</HStack>
														</Td>
													</Tr>
												))}
											</Tbody>
										</Table>
									</FormControl>
								)}
								{todoItems.length > 0 && (
									<FormControl>
										<Caption title={"Checklist"} />
										<Table variant="unstyled" size={"small"} w={"80%"}>
											<Thead fontSize={"xs"}>
												<Th>To-do Task </Th>
												<Th>Assignee</Th>
											</Thead>
											<Tbody>
												{todoItems?.map((todo) => (
													<Tr key={todo}>
														<Td>
															<HStack>
																<Checkbox
																	isChecked={true}
																	isDisabled
																	colorScheme="facebook"
																/>
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
										isDisabled={subTasks.length === 0}
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

export default AddNewProjectTask;
