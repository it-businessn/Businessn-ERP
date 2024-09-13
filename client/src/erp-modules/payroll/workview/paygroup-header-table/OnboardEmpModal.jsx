import { useDisclosure } from "@chakra-ui/react";
import ModalLayout from "components/ui/modal/ModalLayout";
import Employees from "erp-modules/payroll/employees";

const OnboardEmpModal = ({
	showExtraPayrun,
	setShowExtraPayrun,
	setRefresh,
	company,
	selectedPayGroupId,
	selectedPayGroup,
	closestRecord,
}) => {
	const { onClose } = useDisclosure();

	const handleClose = () => {
		onClose();
		setShowExtraPayrun(false);
	};

	return (
		<ModalLayout
			title={"Onboard employee"}
			size="7xl"
			isOpen={showExtraPayrun}
			onClose={handleClose}
		>
			<Employees isOnboarding />
		</ModalLayout>
	);
};

export default OnboardEmpModal;
