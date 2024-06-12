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
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import ProjectService from "services/ProjectService";

const AddProject = ({ isOpen, onClose, setRefresh, managers, company }) => {
	const defaultProject = {
		projectName: "",
		startDate: null,
		dueDate: null,
		timeToComplete: 0,
		managerName: "",
		managerId: "",
		companyName: company,
	};
	const [isSubmitting, setSubmitting] = useState(false);
	const [error, setError] = useState(false);
	const [formData, setFormData] = useState(defaultProject);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			await ProjectService.addProject(formData);
			onClose();
			setFormData(defaultProject);
			setRefresh((prev) => !prev);
		} catch (error) {
			setError("An error occurred. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Modal isCentered size={"3xl"} isOpen={isOpen} onClose={onClose}>
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
										value={formData?.projectName || ""}
										onChange={(e) =>
											setFormData((prevData) => ({
												...prevData,
												projectName: e.target.value,
											}))
										}
										required
									/>
								</FormControl>
								<FormControl>
									<FormLabel> Project Manager</FormLabel>
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
											value={formData.startDate}
											onChange={(e) =>
												setFormData((prevData) => ({
													...prevData,
													startDate: e.target.value,
												}))
											}
											required
										/>
									</FormControl>
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

								<HStack justifyContent={"end"}>
									<Button
										isLoading={isSubmitting}
										type="submit"
										bg="brand.logo_bg"
										isDisabled={formData.projectName === ""}
									>
										Add
									</Button>
									<Button onClick={onClose} colorScheme="gray">
										Cancel
									</Button>
								</HStack>
							</Stack>
						</form>
						{error && (
							<Alert status="error" mt={4}>
								<AlertIcon />
								{error}
							</Alert>
						)}
					</Stack>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default AddProject;
