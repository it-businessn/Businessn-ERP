import { Stack, useDisclosure } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import { useState } from "react";
import SettingService from "services/SettingService";

const AddNewShiftRole = ({ showAddNewRole, setShowAddNewRole, setRefresh, company }) => {
	const [roleName, setRoleName] = useState("");
	const [roleDescription, setRoleDescription] = useState("");
	const [isSubmitting, setSubmitting] = useState(false);
	const { onClose } = useDisclosure();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);

		try {
			await SettingService.addPositionRole({
				name: roleName,
				description: roleDescription,
				companyName: company,
			});
			setRefresh((prev) => !prev);
			setSubmitting(false);
			onClose();
			setShowAddNewRole(false);
		} catch (error) {
			setSubmitting(false);
			onClose();
			setShowAddNewRole(false);
		}
	};
	const handleClose = () => {
		onClose();
		setShowAddNewRole(false);
	};
	return (
		<ModalLayout title="Role Info" size="md" isOpen={showAddNewRole} onClose={handleClose}>
			<form onSubmit={handleSubmit}>
				<Stack spacing={4}>
					<InputFormControl
						size="sm"
						label={"Name"}
						name="name"
						valueText={roleName}
						handleChange={(e) => setRoleName(e.target.value)}
						required
					/>
					<InputFormControl
						size="sm"
						label={"Description"}
						name="roleDescription"
						valueText={roleDescription}
						handleChange={(e) => setRoleDescription(e.target.value)}
						required
						placeholder="Enter Role Description"
					/>
					<ActionButtonGroup
						size="sm"
						submitBtnName={"Add"}
						isDisabled={roleName === ""}
						isLoading={isSubmitting}
						onClose={handleClose}
					/>
				</Stack>
			</form>
		</ModalLayout>
	);
};

export default AddNewShiftRole;
