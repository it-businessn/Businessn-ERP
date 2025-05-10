import { useDisclosure } from "@chakra-ui/react";
import ModalLayout from "components/ui/modal/ModalLayout";
import AddUser from "../../payroll/workview/paygroup-header-table/AddUser";

const OnboardUserModal = ({ showOnboard, setShowOnboard, title, company }) => {
	const { onClose } = useDisclosure();

	const handleClose = () => {
		onClose();
		setShowOnboard(false);
	};

	return (
		<ModalLayout title={title} size="7xl" isOpen={showOnboard} onClose={handleClose}>
			<AddUser title={title} company={company} handleClose={handleClose} />
		</ModalLayout>
	);
};

export default OnboardUserModal;
