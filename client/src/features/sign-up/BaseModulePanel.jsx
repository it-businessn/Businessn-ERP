import { useDisclosure } from "@chakra-ui/react";
import ModalLayout from "components/ui/modal/ModalLayout";
import ModuleForm from "features/configuration/modules/ModuleForm";

const BaseModulePanel = ({
	showAddModules,
	setShowAddModules,
	setOptionDataRefresh,
	companyName,
}) => {
	const { onClose } = useDisclosure();

	const handleClose = () => {
		onClose();
		setShowAddModules(false);
	};

	return (
		<ModalLayout
			title={"Add new base module"}
			size="md"
			isOpen={showAddModules}
			onClose={handleClose}
		>
			<ModuleForm
				companyName={companyName}
				setOptionDataRefresh={setOptionDataRefresh}
				handleClose={handleClose}
			/>
		</ModalLayout>
	);
};

export default BaseModulePanel;
