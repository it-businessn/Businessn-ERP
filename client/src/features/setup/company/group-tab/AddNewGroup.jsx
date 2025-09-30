import ModalLayout from "components/ui/modal/ModalLayout";
import PaygroupForm from "features/configuration/paygroup/PaygroupForm";
import { useState } from "react";

const AddNewGroup = ({ isOpen, onClose, setRefresh, modules, managers, company }) => {
	const [message, setMessage] = useState(false);

	return (
		<ModalLayout
			title={"Add New Group"}
			isOpen={isOpen}
			size="lg"
			onClose={onClose}
			error={message}
		>
			<PaygroupForm
				onClose={onClose}
				company={company}
				modules={modules}
				managers={managers}
				setMessage={setMessage}
				setRefresh={setRefresh}
			/>
		</ModalLayout>
	);
};

export default AddNewGroup;
