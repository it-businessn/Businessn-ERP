import { useToast } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import TextTitle from "components/ui/text/TextTitle";
import { useState } from "react";
import SettingService from "services/SettingService";

const ModuleForm = ({
	setOptionDataRefresh,
	handleClose,
	formData,
	setFormData,
	editingId,
	setModuleList,
}) => {
	const toast = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async () => {
		setIsSubmitting(true);
		try {
			await SettingService.addBaseModule(formData);
			toast({
				title: "Module added successfully",
				status: "success",
				duration: 1500,
				isClosable: true,
			});
			if (setOptionDataRefresh) setOptionDataRefresh((prev) => !prev);
			if (handleClose) handleClose();
		} catch (error) {
			toast({
				title: "Error",
				description: error?.response?.data?.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleUpdate = async () => {
		try {
			await SettingService.updateModule(formData, editingId);
			setModuleList((prev) =>
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
				description: "Module updated successfully",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
			handleClose();
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
			<TextTitle size="lg" title={`${editingId ? "Update" : "Add New"} Module`} />
			<InputFormControl
				size={"sm"}
				label={"Name"}
				name="name"
				valueText={formData?.name}
				handleChange={handleChange}
				required
				placeholder="Enter Module Name"
			/>
			<InputFormControl
				size={"sm"}
				label={"Description"}
				name="description"
				valueText={formData?.description}
				handleChange={handleChange}
				placeholder="Enter Module Description"
			/>
			<ActionButtonGroup
				isDisabled={!formData?.name}
				submitBtnName={`${editingId ? "Save" : "Add"}`}
				closeLabel={editingId ? "Cancel" : ""}
				onClose={handleClose}
				onOpen={editingId ? handleUpdate : handleSubmit}
				size="sm"
				justifyContent="end"
				isLoading={isSubmitting}
			/>
		</>
	);
};

export default ModuleForm;
