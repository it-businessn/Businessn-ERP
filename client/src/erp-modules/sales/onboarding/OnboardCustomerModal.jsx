import { useDisclosure } from "@chakra-ui/react";
import ModalLayout from "components/ui/modal/ModalLayout";
import SalesOnboardUser from "erp-modules/sales/customers/onboard/SalesOnboardUser";

const OnboardCustomerModal = ({ showOnboard, setShowOnboard, title }) => {
	const { onClose } = useDisclosure();

	const handleClose = () => {
		onClose();
		setShowOnboard(false);
	};

	return (
		<ModalLayout title={title} size="7xl" isOpen={showOnboard} onClose={handleClose}>
			<SalesOnboardUser title={title} />
		</ModalLayout>
	);
};

export default OnboardCustomerModal;
