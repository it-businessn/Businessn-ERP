import ModalLayout from "components/ui/modal/ModalLayout";
import SignUp from "features/sign-up";

const AddNewUser = ({ isOpen, onClose, setRefresh }) => {
	return (
		<ModalLayout
			title={"Add New User"}
			size="7xl"
			isOpen={isOpen}
			onClose={onClose}
		>
			<SignUp isModal setRefresh={setRefresh} onClose={onClose} hideCompany />
		</ModalLayout>
	);
};

export default AddNewUser;
