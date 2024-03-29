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
	Text,
} from "@chakra-ui/react";
import MultiCheckboxMenu from "erp-modules/project-management/workview/MultiCheckboxMenu";
import { useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import SettingService from "services/SettingService";

const AddNewUser = ({ isOpen, onClose, setRefresh }) => {
	const defaultUser = {
		name: "",
		email: "",
		baseModule: [],
		team: [],
		role: "",
	};

	const [selectedTeams, setSelectedTeams] = useState([]);
	const [selectedModule, setSelectedModule] = useState([]);

	const [isSubmitting, setSubmitting] = useState(false);
	const [message, setMessage] = useState(false);
	const [formData, setFormData] = useState(defaultUser);
	const [roles, setRoles] = useState(false);

	const [openTeamMenu, setOpenTeamMenu] = useState(false);
	const [openModuleMenu, setOpenModuleMenu] = useState(false);
	useEffect(() => {
		const fetchAllRoles = async () => {
			try {
				const response = await SettingService.getAllRoles();
				setRoles(response.data);
			} catch (error) {
				console.error(error);
			}
		};

		// const fetchAllManagers = async () => {
		// 	try {
		// 		const response = await UserService.getAllManagers();
		// 		setManagers(response.data);
		// 	} catch (error) {
		// 		console.error(error);
		// 	}
		// };
		// fetchAllManagers();
		fetchAllRoles();
	}, []);
	const handleTeamMenuToggle = () => {
		setOpenTeamMenu((prev) => !prev);
	};

	const handleModuleMenuToggle = () => {
		setOpenModuleMenu((prev) => !prev);
	};

	const handleCloseTeamMenu = (selectedOptions) => {
		setOpenTeamMenu(false);
		setFormData((prevTask) => ({
			...prevTask,
			team: selectedOptions,
		}));
	};

	const handleCloseModuleMenu = (selectedOptions) => {
		setOpenModuleMenu(false);
		setFormData((prevTask) => ({
			...prevTask,
			baseModule: selectedOptions,
		}));
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(formData);
		// setSubmitting(true);
		// try {
		// 	await ProjectService.addProjectTask(formData, "projectId");
		// 	onClose();
		// 	setFormData(defaultUser);
		// 	setRefresh((prev) => !prev);
		// } catch (error) {
		// 	setMessage("An error occurred while submitting the application.");
		// } finally {
		// 	setSubmitting(false);
		// }
	};

	return (
		<Modal isCentered size={"2xl"} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Add New User</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Stack spacing="5">
						<form onSubmit={handleSubmit}>
							<Stack spacing={4}>
								<HStack>
									<FormControl>
										<FormLabel>Name</FormLabel>
										<Input
											type="text"
											name="name"
											value={formData.name}
											onChange={(e) =>
												setFormData((prevData) => ({
													...prevData,
													name: e.target.value,
												}))
											}
											required
										/>
									</FormControl>
									<FormControl>
										<FormLabel>Email</FormLabel>
										<Input
											type="text"
											name="email"
											value={formData.email}
											onChange={(e) =>
												setFormData((prevData) => ({
													...prevData,
													email: e.target.value,
												}))
											}
											required
										/>
									</FormControl>
								</HStack>{" "}
								<HStack>
									<FormControl>
										<FormLabel visibility={openModuleMenu ? "" : "hidden"}>
											Select Base Module(s)
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
											{openModuleMenu ? (
												<MultiCheckboxMenu
													// data={managers}
													openMenu={openModuleMenu}
													handleCloseMenu={handleCloseModuleMenu}
													selectedOptions={selectedModule}
													setSelectedOptions={setSelectedModule}
												/>
											) : (
												<Text onClick={handleModuleMenuToggle}>
													{formData.baseModule?.length > 0
														? `${formData.baseModule?.length} module(s)`
														: "Select Base Module"}
												</Text>
											)}
										</Button>
									</FormControl>
									<FormControl>
										<FormLabel visibility={openTeamMenu ? "" : "hidden"}>
											Select Team(s)
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
											{openTeamMenu ? (
												<MultiCheckboxMenu
													// data={managers}
													openMenu={openTeamMenu}
													handleCloseMenu={handleCloseTeamMenu}
													selectedOptions={selectedTeams}
													setSelectedOptions={setSelectedTeams}
												/>
											) : (
												<Text onClick={handleTeamMenuToggle}>
													{formData.team?.length > 0
														? `${formData.team?.length} team(s)`
														: "Select Team"}
												</Text>
											)}
										</Button>
									</FormControl>
								</HStack>
								{roles && (
									<FormControl mb={4}>
										<FormLabel>Type of Role</FormLabel>
										<Select
											name="role"
											value={formData.role}
											bg={"brand.100"}
											onChange={(e) =>
												setFormData((prevData) => ({
													...prevData,
													role: e.target.value,
												}))
											}
											placeholder="Select role"
										>
											{roles?.map((role) => (
												<option key={role._id} value={role.name}>
													{role.name}
												</option>
											))}
										</Select>
									</FormControl>
								)}
								<HStack justifyContent={"end"}>
									<Button
										isLoading={isSubmitting}
										type="submit"
										bg="brand.logo_bg"
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

export default AddNewUser;
