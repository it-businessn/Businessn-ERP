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
import { useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import ProjectService from "services/ProjectService";
import { getDefaultDate } from "utils";
import MultiCheckboxMenu from "../../../../components/ui/MultiCheckboxMenu";
import { PROJECT_ASSIGNEES } from "../project/data";

const AddNewSubTask = ({
	isOpen,
	onClose,
	setRefresh,
	allProjects,
	isFiltered,
	allProjectTasks,
	task,
}) => {
	const defaultTask = {
		activities: task?.activities,
		dueDate: task?.dueDate && getDefaultDate(task?.dueDate),
		selectedAssignees: task?.selectedAssignees,
		subtasks: task?.subtasks,
		taskId: task?._id,
		taskName: task?.taskName,
		timeToComplete: task?.timeToComplete || 0,
	};

	const [formData, setFormData] = useState(defaultTask);

	const defaultChecklist = {
		taskName: "",
		selectedAssignee: "",
		dueDate: null,
		timeToComplete: 0,
	};

	const [hasChecklist, setHasChecklist] = useState(false);
	const [todoItem, setTodoItem] = useState(defaultChecklist);
	const [todoItems, setTodoItems] = useState(task.activities || []);

	const defaultSubtask = {
		taskName: "",
		selectedAssignees: [],
		dueDate: null,
		timeToComplete: 0,
	};

	const [subtask, setSubTask] = useState(defaultSubtask);
	const [subtaskAdded, setSubTaskAdded] = useState(false);
	const [subTasks, setSubTasks] = useState(task.subtasks || []);

	const [isSubmitting, setSubmitting] = useState(false);
	const [message, setMessage] = useState(false);
	const [selectedOptions, setSelectedOptions] = useState([]);

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

	const handleAddTodoItem = () => {
		setTodoItems([...todoItems, todoItem]);
		setTodoItem(defaultChecklist);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		// setSubmitting(true);
		formData.subtasks = subTasks;
		formData.activities = todoItems;

		// if (formData.taskId) {
		// 	try {
		// 		await ProjectService.addTaskActivity(formData, formData.taskId);
		// 		onClose();
		// 		setFormData(defaultTask);
		// 		setSubTasks([]);
		// 		setRefresh(true);
		// 	} catch (error) {
		// 		setMessage("An error occurred. Please try again.");
		// 	} finally {
		// 		setSubmitting(false);
		// 	}
		// } else {
		try {
			await ProjectService.addProjectSubTask(formData, task.projectId);
			onClose();
			// setFormData(defaultTask);
			// setSubTasks([]);
			setRefresh((prev) => !prev);
		} catch (error) {
			setMessage("An error occurred. Please try again.");
		} finally {
			setSubmitting(false);
		}
		// }
	};
	useEffect(() => {
		setFormData(defaultTask);
	}, [task]);

	return (
		<Modal isCentered size={"4xl"} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>
					Add New Activity {isFiltered ? "" : "/ Subtask"}
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Stack spacing="5">
						<form onSubmit={handleSubmit}>
							<Stack spacing={4}>
								<HStack>
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
									<FormControl>
										<FormLabel>Task Assignees</FormLabel>

										{formData?.selectedAssignees?.length > 0 &&
											formData.selectedAssignees.map((name) => (
												<Avatar
													size={"sm"}
													name={name}
													src={name}
													mr={2}
													key={name}
												/>
											))}
									</FormControl>
								</HStack>
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
								{!isFiltered && (
									<>
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
												<FormLabel
													visibility={openAssigneeMenu ? "" : "hidden"}
												>
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
														<MultiCheckboxMenu
															openMenu={openAssigneeMenu}
															handleCloseMenu={handleCloseMenu}
															selectedOptions={selectedOptions}
															setSelectedOptions={setSelectedOptions}
														/>
													) : (
														<Text onClick={handleMenuToggle}>
															{subtask.selectedAssignees?.length > 0
																? `${subtask.selectedAssignees?.length} assignee(s)`
																: "Select Assignee"}
														</Text>
													)}
												</Button>
												{subtask?.selectedAssignees?.length > 0 &&
													subtask.selectedAssignees.map((name) => (
														<Avatar
															size={"sm"}
															name={name}
															src={name}
															key={name}
														/>
													))}
											</FormControl>
										</HStack>
										<HStack>
											<FormControl>
												<FormLabel>Subtask due date</FormLabel>
												<input
													className="date_picker"
													type="date"
													id="dueDate"
													name="dueDate"
													value={subtask?.dueDate}
													onChange={(e) =>
														setSubTask((prevTask) => ({
															...prevTask,
															dueDate: e.target.value,
														}))
													}
													required
												/>
											</FormControl>
											<FormControl>
												<FormLabel>
													Time to complete subtask (in hours)
												</FormLabel>
												<Input
													type="text"
													name="timeToComplete"
													value={subtask?.timeToComplete}
													onChange={(e) =>
														setSubTask((prevTask) => ({
															...prevTask,
															timeToComplete: e.target.value,
														}))
													}
													required
												/>
											</FormControl>
											<Button
												onClick={(e) => {
													e.preventDefault();
													setSubTaskAdded(true);
													setSubTasks([...subTasks, subtask]);
													setSubTask(defaultSubtask);
												}}
												size="sm"
												px={"2em"}
												leftIcon={<SmallAddIcon />}
												mt={5}
												justifyContent={"center"}
												variant={"outline"}
											>
												Add
											</Button>
										</HStack>
									</>
								)}
								{subtaskAdded && (
									<FormControl>
										<Caption title={"All subtasks"} />
										<Table variant="unstyled" mt={4} size={"small"}>
											<Thead fontSize={"xs"}>
												<Th>Subtask </Th>
												<Th>Assignees</Th>
												<Th>Due Date</Th>
												<Th>Time to complete</Th>
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
														<Td>{getDefaultDate(task?.dueDate)}</Td>
														<Td>{task.timeToComplete}</Td>
													</Tr>
												))}
											</Tbody>
										</Table>
									</FormControl>
								)}
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
													<Tr key={todo}>
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

export default AddNewSubTask;
