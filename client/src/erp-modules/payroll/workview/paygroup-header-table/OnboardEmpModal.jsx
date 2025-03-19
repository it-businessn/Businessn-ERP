import { useDisclosure } from "@chakra-ui/react";
import ModalLayout from "components/ui/modal/ModalLayout";
import Employees from "erp-modules/payroll/employees/pageview";
import AddUser from "./AddUser";

const OnboardEmpModal = ({ showOnboard, setShowOnboard, selectedPayGroupName, title, company }) => {
	const { onClose } = useDisclosure();

	const handleClose = () => {
		onClose();
		setShowOnboard(false);
	};

	return (
		<ModalLayout title={title} size="7xl" isOpen={showOnboard} onClose={handleClose}>
			{selectedPayGroupName ? (
				<Employees
					isOnboarding
					selectedPayGroupName={selectedPayGroupName}
					handleClose={handleClose}
				/>
			) : (
				<AddUser title={title} company={company} handleClose={handleClose} />
			)}
		</ModalLayout>
	);
};

export default OnboardEmpModal;
