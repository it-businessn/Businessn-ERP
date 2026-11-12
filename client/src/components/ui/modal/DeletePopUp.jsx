import { useState } from "react";
import ActionButtonGroup from "../form/ActionButtonGroup";
import NormalTextTitle from "../NormalTextTitle";
import ModalLayout from "./ModalLayout";

const DeletePopUp = ({ headerTitle, textTitle, isOpen, onClose, onOpen }) => {
	// "Yes" shows a spinner and ignores further clicks until the delete returns
	// (a double click used to send the delete twice and show "Failed to delete")
	const [isBusy, setIsBusy] = useState(false);
	const handleYes = async (...args) => {
		if (isBusy) return;
		setIsBusy(true);
		try {
			await onOpen?.(...args);
		} finally {
			setIsBusy(false);
		}
	};
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
				onOpen={handleYes}
				isLoading={isBusy}
				size="sm"
			/>
		</ModalLayout>
	);
};

export default DeletePopUp;
