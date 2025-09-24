import { useDisclosure, VStack } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import { useState } from "react";
import AccountService from "services/AccountService";

const AddAccountModal = ({ company, setShowOnboard, showOnboard, setIsRefresh }) => {
	const { onClose } = useDisclosure();

	const handleClose = () => {
		onClose();
		setShowOnboard(false);
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
		await AccountService.addAccount(formData);
		handleClose();
		if (setIsRefresh) setIsRefresh((prev) => !prev);
	};

	return (
		<ModalLayout title="Add New Account" size="lg" isOpen={showOnboard} onClose={handleClose}>
			<VStack>
				<InputFormControl
					required
					label="Account Code"
					name="accCode"
					placeholder="Enter Account Code"
					valueText={formData?.accCode}
					handleChange={handleChange}
				/>
				<InputFormControl
					required
					label="Account Name"
					name="accountName"
					placeholder="Enter Account Name"
					valueText={formData?.accountName}
					handleChange={handleChange}
				/>
			</VStack>
			<ActionButtonGroup
				isDisabled={!formData?.accCode || !formData?.accountName}
				submitBtnName={"Add"}
				onClose={handleClose}
				onOpen={handleSubmit}
				size="sm"
			/>
		</ModalLayout>
	);
};

export default AddAccountModal;
