import {
	Alert,
	AlertIcon,
	Avatar,
	Button,
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
} from "@chakra-ui/react";
import MultiSelectButton from "components/ui/form/MultiSelectButton";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import ProjectService from "services/ProjectService";

const AddNewTask = ({ isOpen, onClose, setRefresh, allProjects, isFiltered, allProjectTasks }) => {
	const defaultTask = {
		projectId: "",
		projectName: "",
		taskName: "",
		selectedAssignees: [],
		dueDate: null,
		timeToComplete: 0,
	};

	const [selectedOptions, setSelectedOptions] = useState([]);

	const [isSubmitting, setSubmitting] = useState(false);
	const [message, setMessage] = useState(false);
	const [formData, setFormData] = useState(defaultTask);

	const [openAssigneeMenu, setOpenAssigneeMenu] = useState(false);

	const handleMenuToggle = () => {
		setOpenAssigneeMenu((prev) => !prev);
	};

	const handleCloseMenu = (selectedOptions) => {
		setOpenAssigneeMenu(false);
		setFormData((prevTask) => ({
			...prevTask,
			selectedAssignees: selectedOptions,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			await ProjectService.addProjectTask(formData, formData.projectId);
			onClose();
			setFormData(defaultTask);
			setRefresh((prev) => !prev);
		} catch (error) {
			setMessage("An error occurred. Please try again.", error);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Modal isCentered size={"4xl"} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Add New {isFiltered ? "Activity" : "Task"}</ModalHeader>
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
								{isFiltered ? (
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
								) : (
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
											<FormLabel visibility={openAssigneeMenu ? "" : "hidden"}>
												Select Assignee
											</FormLabel>

											<MultiSelectButton
												handleMenuToggle={handleMenuToggle}
												assignees={formData.selectedAssignees}
												openAssigneeMenu={openAssigneeMenu}
												handleCloseMenu={handleCloseMenu}
												selectedOptions={selectedOptions}
												setSelectedOptions={setSelectedOptions}
											/>

											{formData?.selectedAssignees?.length > 0 &&
												formData.selectedAssignees.map((name) => (
													<Avatar size={"sm"} name={name} src={name} key={name} />
												))}
										</FormControl>
									</HStack>
								)}

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
								{/* {!isFiltered && (
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
												bg={"var(--primary_bg)"}
												color={"var(--primary_button_bg)"}
												_hover={{
													bg: "var(--primary_bg)",
													color: "var(--primary_button_bg)",
												}}
											>
												{openAssigneeMenu ? (
													<MultiCheckboxMenu
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
												setSubTasks((prev) => [...prev, subtask]);
												setSubTask(defaultSubtask);
											}}
											variant={"ghost"}
											size={"xs"}
											mt={5}
										/>
									</HStack>
								)}
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
											isDisabled={todoItem.taskName === ""}
											onClick={handleAddTodoItem}
											variant={"ghost"}
											size={"xs"}
											mt={5}
										/>
									</HStack>
								)}
								{subTaskAdded && (
									<FormControl>
										<Caption title={"All subtasks"} />
										<Table variant="unstyled" mt={4} size={"small"}>
											<Thead fontSize={"xs"}>
												<Th>Subtask </Th>
												<Th>Assignees</Th>
											</Thead>
											<Tbody>
												{subTasks?.map((task) => (
													<Tr>
														<Td>{task.taskName}</Td>
														<Td>
															<HStack>
																{task.selectedAssignees?.map((assignee) => (
																	<Avatar
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
													<Tr>
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
								)} */}
								<HStack justifyContent={"end"}>
									<Button
										isLoading={isSubmitting}
										type="submit"
										bg="var(--logo_bg)"
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

export default AddNewTask;
