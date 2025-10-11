import { VStack } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import SelectFormControl from "components/ui/form/SelectFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import { useState } from "react";
import BudgetService from "services/BudgetService";

const AddBudgetAccountModal = ({ company, isOpen, setShowModal, setRefresh, crews }) => {
	const handleClose = () => {
		setShowModal(false);
	};

	const defaultUserInfo = {
		accCode: "",
		accountName: "",
		companyName: company,
		crew: "",
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
		try {
			await BudgetService.addAccount(formData);
			handleClose();
			setRefresh((prev) => !prev);
		} catch (error) {}
	};

	return (
		<ModalLayout title={"New Account"} size="lg" isOpen={isOpen} onClose={handleClose}>
			<VStack>
				<SelectFormControl
					placeholder={"Select Department"}
					valueParam="name"
					name="crew"
					label=""
					valueText={formData?.crew}
					handleChange={handleChange}
					options={crews}
				/>
				<InputFormControl
					required
					label="Account Code"
					name="accCode"
					placeholder="Enter Account Code"
					valueText={formData?.accCode}
					handleChange={handleChange}
					maxLength={10}
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

export default AddBudgetAccountModal;
