import { useDisclosure, VStack } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import { useState } from "react";

const ShiftModal = ({ company, setShowModal, showModal, setIsRefresh }) => {
	const { onClose } = useDisclosure();

	const handleClose = () => {
		onClose();
		setShowModal(false);
	};
	const defaultUserInfo = {
		accCode: "",
		accountName: "",
		credit: "",
		companyName: company,
	};

	const [formData, setFormData] = useState(defaultUserInfo);
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async () => {
		// await AccountService.addAccount(formData);
		handleClose();
		// if (setIsRefresh) setIsRefresh((prev) => !prev);
	};

	return (
		<ModalLayout title="Add New Shift" size="lg" isOpen={showModal} onClose={handleClose}>
			<VStack>
				<InputFormControl
					required
					label="Select Role"
					name="role"
					placeholder="Enter Role"
					valueText={formData.accCode}
					handleChange={handleChange}
				/>
				<InputFormControl
					required
					label="Select Location"
					name="location"
					placeholder="Enter Location"
					valueText={formData.accountName}
					handleChange={handleChange}
				/>
			</VStack>
			<ActionButtonGroup
				submitBtnName="Add"
				onClose={handleClose}
				onOpen={handleSubmit}
				size="sm"
			/>
		</ModalLayout>
	);
};

export default ShiftModal;
