import { Alert, AlertIcon, Stack, useDisclosure } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import { useState } from "react";
import LeadsService from "services/LeadsService";

const AddCompany = ({
	showAddCompany,
	setShowAddCompany,
	setRefresh,
	company,
}) => {
	const [error, setError] = useState(false);
	const [companyName, setCompanyName] = useState("");
	const [isSubmitting, setSubmitting] = useState(false);
	const { onClose } = useDisclosure();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);

		try {
			await LeadsService.addLeadCompany({
				name: companyName,
				companyName: company,
			});
			setRefresh((prev) => !prev);
			setSubmitting(false);
			onClose();
			setShowAddCompany(false);
		} catch (error) {
			setSubmitting(false);
			onClose();
			setShowAddCompany(false);
		}
	};
	const handleClose = () => {
		onClose();
		setShowAddCompany(false);
	};
	return (
		<ModalLayout
			title={"Add New Company"}
			size="md"
			isOpen={showAddCompany}
			onClose={handleClose}
		>
			<form onSubmit={handleSubmit}>
				<Stack spacing={4}>
					<InputFormControl
						label={"Company Name"}
						name="name"
						valueText={companyName}
						handleChange={(e) => setCompanyName(e.target.value)}
						required
					/>
					<ActionButtonGroup
						submitBtnName={"Add"}
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

export default AddCompany;
