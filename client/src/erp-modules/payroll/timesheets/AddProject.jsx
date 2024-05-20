import { Alert, AlertIcon, Stack, useDisclosure } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import SelectFormControl from "components/ui/form/SelectFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import { useState } from "react";

const AddProject = ({ showAddProject, setShowAddProject, setRefresh }) => {
	const [error, setError] = useState(false);
	const [companyName, setCompanyName] = useState("");
	const [isSubmitting, setSubmitting] = useState(false);
	const { onClose } = useDisclosure();

	const handleSubmit = async (e) => {
		e.preventDefault();
		// setSubmitting(true);

		// try {
		// 	await LeadsService.addLeadCompany({ companyName });
		// 	setRefresh((prev) => !prev);
		// 	setSubmitting(false);
		// 	onClose();
		// 	setShowAddProject(false);
		// } catch (error) {
		// 	setSubmitting(false);
		// 	onClose();
		// 	setShowAddProject(false);
		// }
	};
	const handleClose = () => {
		onClose();
		setShowAddProject(false);
	};
	return (
		<ModalLayout
			title={"Select Project"}
			size="md"
			isOpen={showAddProject}
			onClose={handleClose}
		>
			<form onSubmit={handleSubmit}>
				<Stack spacing={4}>
					<SelectFormControl
						name="type"
						label={"Project"}
						// valueText={logActivity.type}
						// handleChange={handleInputChange}
						options={[
							{
								name: "Meeting",
								value: "meeting",
							},
							{
								name: "Email",
								value: "email",
							},
							{
								name: "Phone Call",
								value: "phoneCall",
							},
						]}
					/>
					<ActionButtonGroup
						submitBtnName={"Save"}
						isDisabled={companyName === ""}
						isLoading={isSubmitting}
						onClose={handleClose}
					/>
				</Stack>
			</form>
			{error && (
				<Alert status="error" mt={4}>
					<AlertIcon />
					{error}
				</Alert>
			)}
		</ModalLayout>
	);
};

export default AddProject;
