import ActionButtonGroup from "../form/ActionButtonGroup";
import NormalTextTitle from "../NormalTextTitle";
import ModalLayout from "./ModalLayout";

const DeletePopUp = ({ headerTitle, textTitle, isOpen, onClose, onOpen }) => {
	return (
		<ModalLayout
			title={headerTitle}
			size="sm"
			isOpen={isOpen}
			onClose={onClose}
		>
			<NormalTextTitle whiteSpace="wrap" title={textTitle} />
			<ActionButtonGroup
				submitBtnName={"Yes"}
				closeLabel="No"
				onClose={onClose}
				onOpen={onOpen}
				size="sm"
			/>
		</ModalLayout>
	);
};

export default DeletePopUp;
