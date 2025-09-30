import { useToast } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import TextTitle from "components/ui/text/TextTitle";
import { useState } from "react";
import SettingService from "services/SettingService";

const RoleForm = ({
	formData,
	setFormData,
	setOptionDataRefresh,
	handleClose,
	editingId,
	setRoleList,
}) => {
	const toast = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};
	const handleRoleSubmit = async () => {
		setIsSubmitting(true);
		try {
			const { data } = await SettingService.addRole(formData);
			toast({
				title: "Role added successfully",
				status: "success",
				duration: 1500,
				isClosable: true,
			});
			setRoleList((prev) => [data, ...prev]);
			if (handleClose) handleClose();
			if (setOptionDataRefresh) setOptionDataRefresh((prev) => !prev);
		} catch (error) {
			toast({
				title: "Error",
				description: error?.response?.data?.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			console.log("An error occurred. Please try again.", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleUpdate = async () => {
		try {
			await SettingService.updateRole(formData, editingId);
			setRoleList((prev) =>
				prev.map((cc) =>
					cc._id === editingId
						? {
								...cc,
								name: formData?.name,
								description: formData?.description,
						  }
						: cc,
				),
			);
			toast({
				title: "Success",
				description: "Role updated successfully",
				status: "success",
				duration: 3000,
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
		}
	};
	return (
		<>
			<TextTitle size="lg" title={`${editingId ? "Update" : "Add New"} Role`} />
			<InputFormControl
				label={"Name"}
				size={"sm"}
				name="name"
				valueText={formData?.name}
				handleChange={handleChange}
				required
				placeholder="Enter Role Name"
			/>
			<InputFormControl
				size={"sm"}
				label={"Description"}
				name="description"
				valueText={formData?.description}
				handleChange={handleChange}
				placeholder="Enter Role Description"
			/>
			<ActionButtonGroup
				isDisabled={!formData?.name}
				submitBtnName={`${editingId ? "Save" : "Add"}`}
				closeLabel={editingId ? "Cancel" : ""}
				onClose={handleClose}
				onOpen={editingId ? handleUpdate : handleRoleSubmit}
				size="sm"
				justifyContent="end"
				isLoading={isSubmitting}
			/>
		</>
	);
};

export default RoleForm;
