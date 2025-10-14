import { useToast, VStack } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import SelectFormControl from "components/ui/form/SelectFormControl";
import TextTitle from "components/ui/text/TextTitle";
import { useState } from "react";
import AccountService from "services/AccountService";

const AccountForm = ({ editingId, onClose, setAccounts, formData, setFormData, dept }) => {
	const toast = useToast();

	const [isSubmitting, setSubmitting] = useState(false);

	const handleAdd = async () => {
		setSubmitting(true);
		try {
			const { data } = await AccountService.addAccount(formData);
			toast({
				title: "Account added successfully",
				status: "success",
				duration: 1500,
				isClosable: true,
			});
			setAccounts((prev) => [data, ...prev]);
			setFormData((prevData) => ({
				...prevData,
				accCode: "",
				accountName: "",
				department: "",
			}));
		} catch (error) {
			toast({
				title: "Error",
				description: error?.response?.data?.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setSubmitting(false);
		}
	};

	const handleUpdate = async () => {
		setSubmitting(true);
		try {
			const { data } = await AccountService.updateAccount(formData, editingId);
			setAccounts((prev) =>
				prev.map((acc) =>
					acc._id === editingId
						? {
								...acc,
								department: data?.department,
								accountName: data?.accountName,
						  }
						: acc,
				),
			);
			toast({
				title: "Account updated successfully",
				status: "success",
				duration: 1500,
				isClosable: true,
			});
		} catch (error) {
			toast({
				title: "Error",
				description: error?.response?.data?.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setSubmitting(false);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<>
			<TextTitle size="lg" title={`${editingId ? "Update" : "Add New"} Account`} />
			<VStack>
				<InputFormControl
					label="Account Code"
					name="accCode"
					size={"sm"}
					placeholder="Enter Account Code"
					valueText={formData?.accCode}
					handleChange={handleChange}
					readOnly={editingId ? true : false}
				/>
				<SelectFormControl
					placeholder={"Select Department"}
					valueParam="name"
					name="department"
					size={"sm"}
					label="Select department"
					valueText={formData?.department}
					handleChange={handleChange}
					options={dept}
				/>
				<InputFormControl
					required
					label="Account Name"
					name="accountName"
					size={"sm"}
					placeholder="Enter Account Name"
					valueText={formData?.accountName}
					handleChange={handleChange}
				/>
			</VStack>
			<ActionButtonGroup
				isDisabled={!formData?.accCode || !formData?.accountName}
				submitBtnName={editingId ? "Update" : "Add"}
				closeLabel={editingId ? "Cancel" : ""}
				onClose={onClose}
				onOpen={editingId ? handleUpdate : handleAdd}
				size="sm"
				justifyContent="end"
				isLoading={isSubmitting}
			/>
		</>
	);
};

export default AccountForm;
