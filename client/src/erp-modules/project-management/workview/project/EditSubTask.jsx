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
import { useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import ProjectService from "services/ProjectService";
import { getDefaultDate } from "utils/convertDate";
import { PRIORITY } from "./data";

const EditSubTask = ({ isOpen, onClose, setRefresh, currentTask, managers }) => {
	const defaultTask = {
		subTaskName: currentTask?.taskName,
		subTaskId: currentTask?._id,
		selectedAssignees: currentTask?.selectedAssignees || [],
		subTaskDueDate: currentTask?.dueDate && getDefaultDate(currentTask?.dueDate),
		subTaskTimeToComplete: currentTask?.timeToComplete || 0,
		priority: currentTask.priority,
		projectId: currentTask?.projectId,
		taskId: currentTask?.taskId,
	};
	const [isSubmitting, setSubmitting] = useState(false);
	const [message, setMessage] = useState(false);
	const [formData, setFormData] = useState(defaultTask);

	const [selectedOptions, setSelectedOptions] = useState([]);
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
			await ProjectService.updateSubTask(formData, formData?.subTaskId);
			onClose();
			setFormData(defaultTask);
		} catch (error) {
			setMessage("An error occurred. Please try again.", error);
		} finally {
			setSubmitting(false);
		}
	};

	useEffect(() => {
		setFormData(defaultTask);
	}, [currentTask]);

	return (
		<Modal isCentered size={"4xl"} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Edit Task</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Stack spacing="5">
						<form onSubmit={handleSubmit}>
							<Stack spacing={4}>
								<FormControl>
									<FormLabel>Task name</FormLabel>
									<Input
										type="text"
										name="subTaskName"
										value={formData?.subTaskName}
										onChange={(e) =>
											setFormData((prevData) => ({
												...prevData,
												subTaskName: e.target.value,
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
											id="subTaskDueDate"
											name="subTaskDueDate"
											value={formData?.subTaskDueDate}
											onChange={(e) =>
												setFormData((prevData) => ({
													...prevData,
													subTaskDueDate: e.target.value,
												}))
											}
										/>
									</FormControl>
									{/* <FormControl>
										<FormLabel>Time to complete (in hours)</FormLabel>
										<Input
											type="text"
											name="subTaskTimeToComplete"
											value={formData?.subTaskTimeToComplete}
											onChange={(e) =>
												setFormData((prevData) => ({
													...prevData,
													subTaskTimeToComplete: e.target.value,
												}))
											}
											required
										/>
									</FormControl> */}
								</HStack>
								<HStack>
									<FormControl>
										<FormLabel> Priority</FormLabel>
										<Select
											icon={<FaCaretDown />}
											borderRadius="10px"
											value={formData?.priority}
											placeholder="Select Priority"
											onChange={(e) =>
												setFormData((prevData) => ({
													...prevData,
													priority: e.target.value,
												}))
											}
										>
											{PRIORITY?.map((item, index) => (
												<option value={item} key={item + index}>
													{item}
												</option>
											))}
										</Select>
									</FormControl>
									<FormControl>
										<FormLabel visibility={openAssigneeMenu ? "" : "hidden"}>
											Select Assignee
										</FormLabel>

										<MultiSelectButton
											handleMenuToggle={handleMenuToggle}
											assignees={formData?.selectedAssignees}
											openAssigneeMenu={openAssigneeMenu}
											handleCloseMenu={handleCloseMenu}
											selectedOptions={selectedOptions}
											setSelectedOptions={setSelectedOptions}
											data={managers}
										/>

										{formData?.selectedAssignees?.length > 0 &&
											formData?.selectedAssignees.map((name) => (
												<Avatar size={"sm"} name={name} src={name} key={name} />
											))}
									</FormControl>
								</HStack>

								<HStack justifyContent={"end"}>
									<Button
										isLoading={isSubmitting}
										type="submit"
										bg="var(--logo_bg)"
										isDisabled={formData?.taskName === ""}
									>
										Save
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

export default EditSubTask;
