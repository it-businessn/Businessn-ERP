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
	Select,
	Stack,
} from "@chakra-ui/react";
// import MultiSelectButton from "components/ui/form/MultiSelectButton";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import ProjectService from "services/ProjectService";
import { getDefaultDate } from "utils/convertDate";
import { PRIORITY } from "../project/data";

const EditFile = ({ isOpen, onClose, file, fileId, setRefresh, managers }) => {
	const defaultProjectFile = {
		fileName: file.fileName,
		startDate: file?.startDate && getDefaultDate(file.startDate),
		dueDate: file?.dueDate && getDefaultDate(file.dueDate),
		timeToComplete: file.timeToComplete || 0,
		managerName: file.managerName,
		managerId: file.managerId,
		priority: file.priority,
		selectedAssignees: file?.selectedAssignees || [],
	};

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

	const [isSubmitting, setSubmitting] = useState(false);
	const [message, setMessage] = useState(false);
	const [formData, setFormData] = useState(defaultProjectFile);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			await ProjectService.updateProjectFile(formData, fileId);
			onClose();
			setFormData(defaultProjectFile);
		} catch (error) {
			setMessage("An error occurred. Please try again.", error);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Modal isCentered size={"3xl"} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Edit File</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Stack spacing="5">
						<form onSubmit={handleSubmit}>
							<Stack spacing={4}>
								<FormControl>
									<FormLabel>File name</FormLabel>
									<Input
										type="text"
										name="fileName"
										value={formData?.fileName}
										onChange={(e) =>
											setFormData((prevData) => ({
												...prevData,
												fileName: e.target.value,
											}))
										}
										required
									/>
								</FormControl>
								<FormControl>
									<FormLabel>Project Manager</FormLabel>
									<Select
										icon={<FaCaretDown />}
										borderRadius="10px"
										value={formData?.managerId || ""}
										placeholder="Select Project Manager"
										onChange={(e) => {
											const selectedValue = e.target.value;
											if (selectedValue !== "") {
												const { _id, fullName } = managers.find(
													(manager) => manager._id === selectedValue,
												);
												setFormData((prevData) => ({
													...prevData,
													managerName: fullName,
													managerId: _id,
												}));
											}
										}}
									>
										{managers?.map(({ _id, fullName }) => (
											<option value={_id} key={_id}>
												{fullName}
											</option>
										))}
									</Select>
								</FormControl>
								<HStack>
									<FormControl>
										<FormLabel>Start date</FormLabel>
										<input
											className="date_picker"
											type="date"
											id="startDate"
											name="startDate"
											value={formData?.startDate}
											onChange={(e) =>
												setFormData((prevData) => ({
													...prevData,
													startDate: e.target.value,
												}))
											}
										/>
									</FormControl>
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
									{/* <FormControl>
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
									</FormControl> */}
								</HStack>
								<HStack justifyContent={"end"}>
									<Button isLoading={isSubmitting} type="submit" bg="var(--logo_bg)">
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

export default EditFile;
