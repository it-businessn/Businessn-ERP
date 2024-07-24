import { Stack, useDisclosure } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import { useState } from "react";
import SettingService from "services/SettingService";

const DepartmentsPanel = ({
	showAddDepartments,
	setShowAddDepartments,
	setOptionDataRefresh,
	companyName,
}) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [deptName, setDeptName] = useState("");
	const [deptDescription, setDeptDescription] = useState("");

	const { onClose } = useDisclosure();

	const handleClose = () => {
		onClose();
		setShowAddDepartments(false);
	};

	const handleDepartmentSubmit = async () => {
		setIsSubmitting(true);
		try {
			await SettingService.addDepartment({
				name: deptName,
				description: deptDescription,
				companyName,
			});
			setOptionDataRefresh((prev) => !prev);
			setDeptName("");
			setDeptDescription("");
			handleClose();
		} catch (error) {
			console.log("An error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};
	return (
		<ModalLayout
			title={"Add new department"}
			size="md"
			isOpen={showAddDepartments}
			onClose={handleClose}
		>
			<Stack spacing={4}>
				<InputFormControl
					label={"Name"}
					name="deptName"
					valueText={deptName}
					handleChange={(e) => setDeptName(e.target.value)}
					required
					placeholder="Enter Department Name"
				/>
				<InputFormControl
					label={"Description"}
					name="deptDescription"
					valueText={deptDescription}
					handleChange={(e) => setDeptDescription(e.target.value)}
					required
					placeholder="Enter Department Description"
				/>
				<ActionButtonGroup
					submitBtnName={"Add Department"}
					isDisabled={deptName === "" || deptDescription === ""}
					isLoading={isSubmitting}
					onClose={handleClose}
					onOpen={handleDepartmentSubmit}
				/>
			</Stack>
		</ModalLayout>
	);
};

export default DepartmentsPanel;
