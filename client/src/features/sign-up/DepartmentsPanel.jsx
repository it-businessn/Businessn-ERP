import { useDisclosure } from "@chakra-ui/react";
import ModalLayout from "components/ui/modal/ModalLayout";
import DeptForm from "features/configuration/DeptForm";

const DepartmentsPanel = ({
	showAddDepartments,
	setShowAddDepartments,
	setOptionDataRefresh,
	companyName,
}) => {
	const { onClose } = useDisclosure();

	const handleClose = () => {
		onClose();
		setShowAddDepartments(false);
	};

	return (
		<ModalLayout
			title={"Add new department"}
			size="md"
			isOpen={showAddDepartments}
			onClose={handleClose}
		>
			<DeptForm
				companyName={companyName}
				setOptionDataRefresh={setOptionDataRefresh}
				handleClose={handleClose}
			/>
		</ModalLayout>
	);
};

export default DepartmentsPanel;
