import { useDisclosure } from "@chakra-ui/react";
import ModalLayout from "components/ui/modal/ModalLayout";
import Employees from "erp-modules/payroll/employees/pageview";
import SalesOnboardUser from "erp-modules/sales/customers/onboard/SalesOnboardUser";
import AddUser from "../../payroll/workview/paygroup-header-table/AddUser";

const OnboardEmpModal = ({
	showOnboard,
	setShowOnboard,
	selectedPayGroupName,
	title,
	company,
	isSalesOnboard,
}) => {
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
			) : isSalesOnboard ? (
				<SalesOnboardUser title={title} company={company} handleClose={handleClose} />
			) : (
				<AddUser title={title} company={company} handleClose={handleClose} />
			)}
		</ModalLayout>
	);
};

export default OnboardEmpModal;
