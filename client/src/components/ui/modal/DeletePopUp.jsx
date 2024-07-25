import ActionButtonGroup from "../form/ActionButtonGroup";
import TextTitle from "../text/TextTitle";
import ModalLayout from "./ModalLayout";

const DeletePopUp = ({ headerTitle, textTitle, isOpen, onClose, onOpen }) => {
	return (
		<ModalLayout
			title={headerTitle}
			size="sm"
			isOpen={isOpen}
			onClose={onClose}
		>
			<TextTitle weight="normal" whiteSpace="wrap" title={textTitle} />
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
