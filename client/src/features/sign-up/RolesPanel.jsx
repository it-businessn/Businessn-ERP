import { useDisclosure } from "@chakra-ui/react";
import ModalLayout from "components/ui/modal/ModalLayout";
import RoleForm from "features/configuration/RoleForm";

const RolesPanel = ({ showAddRoles, setShowAddRoles, setOptionDataRefresh, companyName }) => {
	const { onClose } = useDisclosure();

	const handleClose = () => {
		onClose();
		setShowAddRoles(false);
	};

	return (
		<ModalLayout title="Add new role" size="md" isOpen={showAddRoles} onClose={handleClose}>
			<RoleForm
				companyName={companyName}
				setOptionDataRefresh={setOptionDataRefresh}
				handleClose={handleClose}
			/>
		</ModalLayout>
	);
};

export default RolesPanel;
