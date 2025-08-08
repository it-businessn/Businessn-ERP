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
} from "@chakra-ui/react";
import MultiSelectButton from "components/ui/form/MultiSelectButton";
import { useState } from "react";
import ProjectService from "services/ProjectService";

const AddNewTask = ({ isOpen, onClose, setRefresh, currentTask, managers, company }) => {
	const defaultTask = {
		fileId: currentTask?.fileId,
		projectId: currentTask?._id,
		projectName: currentTask?.projectName,
		selectedAssignees: [],
		dueDate: null,
		timeToComplete: 0,
		taskName: "",
		companyName: company,
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
			await ProjectService.addTask(formData, currentTask._id);
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
				<ModalHeader>Add Task - {formData?.projectName}</ModalHeader>
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
											value={formData?.taskName ?? ""}
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
								<HStack>
									<FormControl>
										<FormLabel>Due date</FormLabel>
										<input
											className="date_picker"
											type="date"
											id="dueDate"
											name="dueDate"
											value={formData?.dueDate ?? ""}
											onChange={(e) =>
												setFormData((prevData) => ({
													...prevData,
													dueDate: e.target.value,
												}))
											}
										/>
									</FormControl>
									<FormControl>
										<FormLabel>Time to complete (in hours)</FormLabel>
										<Input
											type="text"
											name="timeToComplete"
											value={formData?.timeToComplete ?? ""}
											onChange={(e) =>
												setFormData((prevData) => ({
													...prevData,
													timeToComplete: e.target.value,
												}))
											}
										/>
									</FormControl>
								</HStack>
								<HStack justifyContent={"end"}>
									<Button
										isLoading={isSubmitting}
										type="submit"
										bg="var(--logo_bg)"
										isDisabled={formData?.taskName === ""}
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
