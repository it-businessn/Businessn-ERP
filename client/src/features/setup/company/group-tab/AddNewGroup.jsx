import {
	Button,
	Checkbox,
	FormControl,
	FormLabel,
	HStack,
	Stack,
	Text,
} from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import MultiSelectBox from "components/ui/form/select/MultiSelectBox";
import ModalLayout from "components/ui/modal/ModalLayout";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import SettingService from "services/SettingService";

const AddNewGroup = ({
	isOpen,
	onClose,
	setRefresh,
	modules,
	admins,
	company,
}) => {
	const defaultGroup = {
		name: "",
		baseModule: [],
		admin: [],
		company,
		payrollActivated: false,
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
		<ModalLayout
			title={"Add New Group"}
			isOpen={isOpen}
			size="lg"
			onClose={onClose}
			error={message}
		>
			<Stack spacing={1}>
				<InputFormControl
					label={"Group Name"}
					name="name"
					valueText={formData.name}
					handleChange={(e) =>
						setFormData((prevData) => ({
							...prevData,
							name: e.target.value,
						}))
					}
					required
				/>
				<HStack spacing={2}>
					<FormControl>
						<FormLabel visibility={openModuleMenu ? "" : "hidden"}>
							Select Base Module(s)
						</FormLabel>
						<Button
							rightIcon={<FaCaretDown />}
							bg={"var(--primary_bg)"}
							color={"var(--primary_button_bg)"}
							_hover={{
								bg: "var(--primary_bg)",
								color: "var(--primary_button_bg)",
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
							bg={"var(--primary_bg)"}
							color={"var(--primary_button_bg)"}
							_hover={{
								bg: "var(--primary_bg)",
								color: "var(--primary_button_bg)",
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
				<Checkbox
					colorScheme={"facebook"}
					isChecked={formData.payrollActivated}
					onChange={() =>
						setFormData((prevData) => ({
							...prevData,
							payrollActivated: !formData.payrollActivated,
						}))
					}
				>
					Is Payroll Activated?
				</Checkbox>
				<ActionButtonGroup
					submitBtnName={"Add"}
					isDisabled={formData.name === ""}
					isLoading={isSubmitting}
					onClose={onClose}
					onOpen={handleSubmit}
				/>
			</Stack>
		</ModalLayout>
	);
};

export default AddNewGroup;
