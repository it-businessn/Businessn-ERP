import { Stack, useDisclosure } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import { useState } from "react";
import SettingService from "services/SettingService";

const EmploymentPanel = ({
	showAddEmpTypes,
	setShowAddEmpTypes,
	setOptionDataRefresh,
	companyName,
}) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [empType, setEmpType] = useState("");
	const [empTypeDesc, setEmpTypeDesc] = useState("");

	const { onClose } = useDisclosure();

	const handleClose = () => {
		onClose();
		setShowAddEmpTypes(false);
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);
		try {
			await SettingService.addEmploymentType({
				name: empType,
				description: empTypeDesc,
				companyName,
			});
			setOptionDataRefresh((prev) => !prev);
			setEmpType("");
			setEmpTypeDesc("");
			handleClose();
		} catch (error) {
			console.log("An error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};
	return (
		<ModalLayout
			title={"Add new employment type"}
			size="md"
			isOpen={showAddEmpTypes}
			onClose={handleClose}
		>
			<Stack spacing={4}>
				<InputFormControl
					label={"Name"}
					name="empType"
					valueText={empType}
					handleChange={(e) => setEmpType(e.target.value)}
					required
					placeholder="Enter Employment Type Name"
				/>
				<InputFormControl
					label={"Description"}
					name="empTypeDesc"
					valueText={empTypeDesc}
					handleChange={(e) => setEmpTypeDesc(e.target.value)}
					required
					placeholder="Enter Employment Type Description"
				/>
				<ActionButtonGroup
					submitBtnName={"Add Employment Type"}
					isDisabled={empType === "" || empTypeDesc === ""}
					isLoading={isSubmitting}
					onClose={handleClose}
					onOpen={handleSubmit}
				/>
			</Stack>
		</ModalLayout>
	);
};

export default EmploymentPanel;
