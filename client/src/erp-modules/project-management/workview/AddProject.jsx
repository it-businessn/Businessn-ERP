import { SmallAddIcon } from "@chakra-ui/icons";
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
import MultiCheckboxMenu from "./MultiCheckboxMenu";

const AddProject = ({ isOpen, onClose, setRefresh }) => {
	const defaultProject = {
		projectName: "",
		tasks: [],
		dueDate: null,
		timeToComplete: 0,
	};
	const defaultTask = { taskName: "", selectedAssignees: [] };

	const [isSubmitting, setSubmitting] = useState(false);
	const [message, setMessage] = useState(false);
	const [formData, setFormData] = useState(defaultProject);

	const [task, setTask] = useState(defaultTask);

	const [tasks, setTasks] = useState([]);

	const [taskAdded, setTaskAdded] = useState(false);

	const [openMenu, setOpenMenu] = useState(false);
	const [assigneeText, setAssigneeText] = useState("Select Assignee");

	const handleMenuToggle = () => {
		setOpenMenu((prev) => !prev);
	};

	const handleCloseMenu = (selectedOptions) => {
		setOpenMenu(false);

		setAssigneeText(`${selectedOptions.length} assignees`);
		setTask((prevTask) => ({
			...prevTask,
			selectedAssignees: selectedOptions,
		}));
	};

	const handleTaskNameChange = (e) => {
		const updatedTaskName = e.target.value;
		setTask((prevTask) => ({
			...prevTask,
			taskName: updatedTaskName,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		formData.tasks = tasks;
		try {
			await ProjectService.addProject(formData);
			onClose();
			setFormData(defaultProject);
			setTasks([]);
			setRefresh(true);
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
				<ModalHeader>Add New Project</ModalHeader>
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
										value={formData.projectName}
										onChange={(e) =>
											setFormData((prevData) => ({
												...prevData,
												projectName: e.target.value,
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
										<FormLabel>Task Name</FormLabel>
										<Input
											type="text"
											name="taskName"
											value={task.taskName}
											onChange={handleTaskNameChange}
										/>
									</FormControl>
									<FormControl>
										<FormLabel visibility={openMenu ? "" : "hidden"}>
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
											{openMenu ? (
												<MultiCheckboxMenu
													openMenu={openMenu}
													handleCloseMenu={handleCloseMenu}
												/>
											) : (
												<Text onClick={handleMenuToggle}>{assigneeText}</Text>
											)}
										</Button>{" "}
										<Button
											rightIcon={<SmallAddIcon />}
											isDisabled={formData.projectName === ""}
											onClick={(e) => {
												e.preventDefault();
												setTaskAdded(true);
												setTasks((prev) => [...prev, task]);
												setTask(defaultTask);
											}}
											color={"brand.primary_button_bg"}
											border={"1px solid var(--primary_button_bg)"}
											variant={"outline"}
											size={"xs"}
										>
											Add
										</Button>
									</FormControl>
								</HStack>
								{taskAdded && (
									<FormControl>
										<Caption title={"All tasks"} />
										<Table variant="unstyled" mt={4} size={"small"}>
											<Thead fontSize={"xs"}>
												<Th>Task </Th>
												<Th>Assignees</Th>
											</Thead>
											<Tbody>
												{tasks?.map((task, index) => (
													<Tr key={`task_${index}`}>
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
								<HStack justifyContent={"end"}>
									<Button
										isLoading={isSubmitting}
										type="submit"
										bg="brand.logo_bg"
										isDisabled={tasks.length === 0}
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

export default AddProject;
