import { useDisclosure } from "@chakra-ui/react";
import ModalLayout from "components/ui/modal/ModalLayout";
import Employees from "erp-modules/payroll/employees";

const OnboardEmpModal = ({
	showOnboard,
	setShowOnboard,
	selectedPayGroupName,
	title,
}) => {
	const { onClose } = useDisclosure();

	const handleClose = () => {
		onClose();
		setShowOnboard(false);
	};

	return (
		<ModalLayout
			title={title}
			size="7xl"
			isOpen={showOnboard}
			onClose={handleClose}
		>
			<Employees isOnboarding selectedPayGroupName={selectedPayGroupName} />
		</ModalLayout>
	);
};

export default OnboardEmpModal;