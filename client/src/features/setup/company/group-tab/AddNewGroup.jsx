import { Checkbox, FormControl, FormLabel, HStack, Stack, useToast } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import MultiSelectButton from "components/ui/form/MultiSelectButton";
import ModalLayout from "components/ui/modal/ModalLayout";
import { useState } from "react";
import SettingService from "services/SettingService";

const AddNewGroup = ({ isOpen, onClose, setRefresh, modules, managers, company }) => {
	const toast = useToast();
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
			toast({
				title: "Group added successfully",
				status: "success",
				duration: 1500,
				isClosable: true,
			});
			setFormData(defaultGroup);
			if (setRefresh) setRefresh((prev) => !prev);
		} catch (error) {
			setMessage("An error occurred. Please try again.", error);
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
						<FormLabel visibility={openModuleMenu ? "" : "hidden"}>Select Base Module(s)</FormLabel>

						<MultiSelectButton
							handleMenuToggle={handleModuleMenuToggle}
							assignees={formData.baseModule}
							data={modules}
							openAssigneeMenu={openModuleMenu}
							handleCloseMenu={handleCloseModuleMenu}
							selectedOptions={selectedModule}
							setSelectedOptions={setSelectedModule}
							tag="module(s)"
							label="Select Base Module"
						/>
					</FormControl>
					<FormControl>
						<FormLabel visibility={openTeamMenu ? "" : "hidden"}>Select Admin(s)</FormLabel>
						<MultiSelectButton
							handleMenuToggle={handleTeamMenuToggle}
							assignees={formData.admin}
							data={managers}
							openAssigneeMenu={openTeamMenu}
							handleCloseMenu={handleCloseTeamMenu}
							selectedOptions={selectedTeams}
							setSelectedOptions={setSelectedTeams}
							tag="admin(s)"
							label="Select Admin"
						/>
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
