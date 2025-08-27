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
import { ACTION } from "../files";
import { PRIORITY } from "./data";

const EditProject = ({ isOpen, onClose, handleProjectUpdate, project, managers }) => {
	const defaultTask = {
		projectName: project?.projectName,
		projectId: project?._id,
		selectedAssignees: project?.selectedAssignees || [],
		dueDate: project?.dueDate && getDefaultDate(project?.dueDate),
		timeToComplete: project?.timeToComplete || 0,
		priority: project.priority,
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
			const { data } = await ProjectService.updateProject(formData, project?._id);
			onClose();
			handleProjectUpdate(data, ACTION.EDIT);
			setFormData(defaultTask);
		} catch (error) {
			setMessage("An error occurred. Please try again.", error);
		} finally {
			setSubmitting(false);
		}
	};

	useEffect(() => {
		setFormData(defaultTask);
	}, [project]);

	return (
		<Modal isCentered size={"4xl"} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Edit Project</ModalHeader>
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
										value={formData?.projectName}
										onChange={(e) =>
											setFormData((prevData) => ({
												...prevData,
												projectName: e.target.value,
											}))
										}
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
											value={formData?.dueDate}
											onChange={(e) =>
												setFormData((prevData) => ({
													...prevData,
													dueDate: e.target.value,
												}))
											}
										/>
									</FormControl>
									{/* <FormControl>
										<FormLabel>Time to complete (in hours)</FormLabel>
										<Input
											type="text"
											name="timeToComplete"
											value={formData?.timeToComplete}
											onChange={(e) =>
												setFormData((prevData) => ({
													...prevData,
													timeToComplete: e.target.value,
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
											{PRIORITY?.map((item) => (
												<option value={item} key={item}>
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

export default EditProject;
