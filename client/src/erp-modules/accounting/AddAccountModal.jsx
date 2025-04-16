import { HStack, useDisclosure } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import DateTimeFormControl from "components/ui/form/DateTimeFormControl";
import InputFormControl from "components/ui/form/InputFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import { useState } from "react";
import AccountService from "services/AccountService";
import { getDefaultDate } from "utils/convertDate";

const AddAccountModal = ({ company, setShowOnboard, showOnboard, setIsRefresh }) => {
	const { onClose } = useDisclosure();

	const handleClose = () => {
		onClose();
		setShowOnboard(false);
	};
	const defaultUserInfo = {
		accCode: "",
		accountName: "",
		description: "",
		transactionDate: null,
		debit: "",
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
		<ModalLayout title="Add New Account" size="3xl" isOpen={showOnboard} onClose={handleClose}>
			<HStack>
				<InputFormControl
					required
					label="Account Code"
					name="accCode"
					placeholder="Enter Account Code"
					valueText={formData.accCode}
					handleChange={handleChange}
				/>
				<InputFormControl
					required
					label="Account Name"
					name="accountName"
					placeholder="Enter Account Name"
					valueText={formData.accountName}
					handleChange={handleChange}
				/>
			</HStack>
			<InputFormControl
				required
				label="Description"
				name="description"
				placeholder="Enter Description"
				valueText={formData.description}
				handleChange={handleChange}
			/>
			<HStack>
				<DateTimeFormControl
					size="sm"
					label="Date"
					valueText1={formData.transactionDate ? getDefaultDate(formData.transactionDate) : ""}
					name1="transactionDate"
					handleChange={handleChange}
				/>
				<InputFormControl
					size="sm"
					label="Debit"
					type="number"
					name="debit"
					placeholder="Enter Debit"
					valueText={formData.debit}
					handleChange={handleChange}
				/>
				<InputFormControl
					size="sm"
					label="Credit"
					type="number"
					name="credit"
					placeholder="Enter Credit"
					valueText={formData.credit}
					handleChange={handleChange}
				/>
			</HStack>
			<ActionButtonGroup
				submitBtnName={"Add"}
				onClose={handleClose}
				onOpen={handleSubmit}
				size="sm"
			/>
		</ModalLayout>
	);
};

export default AddAccountModal;
