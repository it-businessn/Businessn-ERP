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
	Text,
} from "@chakra-ui/react";
import MultiSelectBox from "components/ui/form/select/MultiSelectBox";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import SettingService from "services/SettingService";

const AddNewGroup = ({ isOpen, onClose, setRefresh, modules, admins }) => {
	const defaultGroup = {
		name: "",
		baseModule: [],
		admin: [],
	};

	const [isSubmitting, setSubmitting] = useState(false);
	const [message, setMessage] = useState(false);
	const [formData, setFormData] = useState(defaultGroup);

	const [selectedTeams, setSelectedTeams] = useState([]);
	const [selectedModule, setSelectedModule] = useState([]);
	const [openTeamMenu, setOpenTeamMenu] = useState(false);
	const [openModuleMenu, setOpenModuleMenu] = useState(false);

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
			admin: selectedOptions,
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
		setSubmitting(true);
		try {
			await SettingService.addGroup(formData);
			onClose();
			setFormData(defaultGroup);
			setRefresh((prev) => !prev);
		} catch (error) {
			setMessage("An error occurred. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Modal isCentered size={"2xl"} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Add New Group</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Stack spacing="5">
						<form onSubmit={handleSubmit}>
							<Stack>
								<HStack>
									<FormControl>
										<FormLabel>Group Name</FormLabel>
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
								</HStack>
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
												<MultiSelectBox
													data={modules}
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
											Select Admin(s)
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
												<MultiSelectBox
													data={admins}
													openMenu={openTeamMenu}
													handleCloseMenu={handleCloseTeamMenu}
													selectedOptions={selectedTeams}
													setSelectedOptions={setSelectedTeams}
												/>
											) : (
												<Text onClick={handleTeamMenuToggle}>
													{formData.admin?.length > 0
														? `${formData.admin?.length} admin(s)`
														: "Select Admin"}
												</Text>
											)}
										</Button>
									</FormControl>
								</HStack>
								<HStack justifyContent={"end"}>
									<Button
										isLoading={isSubmitting}
										type="submit"
										bg="brand.logo_bg"
										isDisabled={formData.name === ""}
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

export default AddNewGroup;
