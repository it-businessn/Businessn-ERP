import {
	Alert,
	AlertIcon,
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
import { useEffect, useState } from "react";
import ProjectService from "services/ProjectService";
import { getDefaultDate } from "utils";

const EditSubTask = ({
	isOpen,
	onClose,
	setRefresh,
	currentTask,
	managers,
}) => {
	const defaultTask = {
		subTaskName: currentTask?.taskName,
		subTaskId: currentTask?._id,
		selectedAssignees: currentTask?.selectedAssignees,
		subTaskDueDate:
			currentTask?.dueDate && getDefaultDate(currentTask?.dueDate),
		subTaskTimeToComplete: currentTask?.timeToComplete,
	};
	const [isSubmitting, setSubmitting] = useState(false);
	const [message, setMessage] = useState(false);
	const [formData, setFormData] = useState(defaultTask);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			await ProjectService.updateSubTask(formData, formData.subTaskId);
			onClose();
			setFormData(defaultTask);
			setRefresh((prev) => !prev);
		} catch (error) {
			setMessage("An error occurred while submitting the application.");
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
										isDisabled={formData.taskName === ""}
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
