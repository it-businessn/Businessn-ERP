import { Stack, useDisclosure } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import { useState } from "react";
import SettingService from "services/SettingService";

const RolesPanel = ({
	showAddRoles,
	setShowAddRoles,
	setOptionDataRefresh,
	companyName,
}) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [roleName, setRoleName] = useState("");
	const [roleDescription, setRoleDescription] = useState("");

	const { onClose } = useDisclosure();

	const handleClose = () => {
		onClose();
		setShowAddRoles(false);
	};

	const handleRoleSubmit = async () => {
		setIsSubmitting(true);
		try {
			await SettingService.addRole({
				name: roleName,
				description: roleDescription,
				companyName,
			});
			setOptionDataRefresh((prev) => !prev);
			setRoleName("");
			setRoleDescription("");
			handleClose();
		} catch (error) {
			console.log("An error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<ModalLayout
			title={"Add new role"}
			size="md"
			isOpen={showAddRoles}
			onClose={handleClose}
		>
			<Stack spacing={4}>
				<InputFormControl
					label={"Name"}
					name="roleName"
					valueText={roleName}
					handleChange={(e) => setRoleName(e.target.value)}
					required
					placeholder="Enter Role Name"
				/>
				<InputFormControl
					label={"Description"}
					name="roleDescription"
					valueText={roleDescription}
					handleChange={(e) => setRoleDescription(e.target.value)}
					required
					placeholder="Enter Role Description"
				/>
				<ActionButtonGroup
					submitBtnName={"Add Role"}
					isDisabled={roleName === "" || roleDescription === ""}
					isLoading={isSubmitting}
					onClose={handleClose}
					onOpen={handleRoleSubmit}
				/>
			</Stack>
		</ModalLayout>
	);
};

export default RolesPanel;
