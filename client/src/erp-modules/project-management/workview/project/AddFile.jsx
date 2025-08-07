import {
	Alert,
	AlertIcon,
	Button,
	FormControl,
	FormLabel,
	HStack,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Select,
	Stack,
} from "@chakra-ui/react";
import DateTimeFormControl from "components/ui/form/DateTimeFormControl";
import InputFormControl from "components/ui/form/InputFormControl";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import ProjectService from "services/ProjectService";
import { getDefaultDate } from "utils/convertDate";

const AddFile = ({ isOpen, onClose, setRefresh, managers, company }) => {
	const defaultFile = {
		fileName: "",
		startDate: getDefaultDate(),
		dueDate: getDefaultDate(),
		timeToComplete: 0,
		managerName: "",
		managerId: "",
		companyName: company,
	};
	const [isSubmitting, setSubmitting] = useState(false);
	const [error, setError] = useState(false);
	const [formData, setFormData] = useState(defaultFile);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			await ProjectService.addProject(formData);
			onClose();
			setFormData(defaultFile);
			setRefresh((prev) => !prev);
		} catch (error) {
			setError("An error occurred. Please try again.", error);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Modal isCentered size={"3xl"} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Add New File</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Stack spacing="5">
						<form onSubmit={handleSubmit}>
							<Stack spacing={4}>
								<InputFormControl
									label={"File name"}
									name="fileName"
									valueText={formData?.fileName}
									handleChange={(e) =>
										setFormData((prevData) => ({
											...prevData,
											fileName: e.target.value,
										}))
									}
									required
								/>
								<FormControl>
									<FormLabel>Project Manager</FormLabel>
									<Select
										icon={<FaCaretDown />}
										borderRadius="10px"
										value={formData?.managerId ?? ""}
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
									<DateTimeFormControl
										label={"Start date"}
										className="date_picker"
										valueText1={formData?.startDate}
										name1="startDate"
										handleChange={(e) =>
											setFormData((prevData) => ({
												...prevData,
												startDate: e.target.value,
											}))
										}
										required
									/>
									<DateTimeFormControl
										label={"Due date"}
										className="date_picker"
										valueText1={formData?.dueDate}
										name1="dueDate"
										handleChange={(e) =>
											setFormData((prevData) => ({
												...prevData,
												dueDate: e.target.value,
											}))
										}
										required
									/>
									<InputFormControl
										label={"Time to complete (in hours)"}
										name="timeToComplete"
										valueText={formData?.timeToComplete}
										handleChange={(e) =>
											setFormData((prevData) => ({
												...prevData,
												timeToComplete: e.target.value,
											}))
										}
										required
									/>
								</HStack>

								<HStack justifyContent={"end"}>
									<Button
										isLoading={isSubmitting}
										type="submit"
										bg="var(--logo_bg)"
										isDisabled={formData?.fileName === ""}
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

export default AddFile;
