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
    Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import ProjectService from "services/ProjectService";
import MultiCheckboxMenu from "../MultiCheckboxMenu";

const AddNewSubTask = ({
	isOpen,
	onClose,
	setRefresh,
	currentTask,
	managers,
}) => {
	const defaultTask = {
		projectId: currentTask?.projectId,
		taskId: currentTask?.taskId,
		subTaskId: currentTask?._id,
		taskName: currentTask?.taskName,
		subTaskSelectedAssignees: [],
		subTaskDueDate: null,
		subTaskTimeToComplete: 0,
		subTaskName: "",
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
			subTaskSelectedAssignees: selectedOptions,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			await ProjectService.addSubTask(formData, currentTask._id);
			onClose();
			setFormData(defaultTask);
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
				<ModalHeader>Add new task under {formData.taskName}</ModalHeader>
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
											name="subTaskName"
											value={formData.subTaskName}
											onChange={(e) =>
												setFormData((prevData) => ({
													...prevData,
													subTaskName: e.target.value,
												}))
											}
											required
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
												<MultiCheckboxMenu
													data={managers}
													openMenu={openAssigneeMenu}
													handleCloseMenu={handleCloseMenu}
													selectedOptions={selectedOptions}
													setSelectedOptions={setSelectedOptions}
												/>
											) : (
												<Text onClick={handleMenuToggle}>
													{formData.selectedAssignees?.length > 0
														? `${formData.selectedAssignees?.length} assignee(s)`
														: "Select Assignee"}
												</Text>
											)}
										</Button>
										{formData?.selectedAssignees?.length > 0 &&
											formData.selectedAssignees.map((name) => (
												<Avatar size={"sm"} name={name} src={name} />
											))}
									</FormControl>
								</HStack>
								<HStack>
									<FormControl>
										<FormLabel>Due date</FormLabel>
										<input
											className="date_picker"
											type="date"
											id="subTaskDueDate"
											name="subTaskDueDate"
											value={formData.subTaskDueDate}
											onChange={(e) =>
												setFormData((prevData) => ({
													...prevData,
													subTaskDueDate: e.target.value,
												}))
											}
											required
										/>
									</FormControl>
									<FormControl>
										<FormLabel>Time to complete (in hours)</FormLabel>
										<Input
											type="text"
											name="subTaskTimeToComplete"
											value={formData.subTaskTimeToComplete}
											onChange={(e) =>
												setFormData((prevData) => ({
													...prevData,
													subTaskTimeToComplete: e.target.value,
												}))
											}
											required
										/>
									</FormControl>
								</HStack>
								<HStack justifyContent={"end"}>
									<Button
										isLoading={isSubmitting}
										type="submit"
										bg="brand.logo_bg"
										isDisabled={formData.subTaskName === ""}
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
