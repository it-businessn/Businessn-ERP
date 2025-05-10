import { FormControl, FormLabel, Select, Stack } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import LeadsService from "services/LeadsService";
import { isValidPhoneNumber } from "utils";
import { LEAD_STAGES } from "../opportunities/data";

const EditLead = ({ defaultLeadInfo, formData, isOpen, onClose, setFormData, setIsUpdated }) => {
	const [error, setError] = useState(false);
	const [isSubmitting, setSubmitting] = useState(false);
	const [phoneNumberError, setPhoneNumberError] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "phone") {
			if (isValidPhoneNumber(value)) {
				setPhoneNumberError("");
			} else {
				setPhoneNumberError("Invalid phone number. Please enter 10 digits.");
			}
		}

		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);

		try {
			await LeadsService.updateLeadInfo(formData, formData?._id);
			setIsUpdated((prev) => !prev);
			onClose();
			setFormData(defaultLeadInfo);
			setSubmitting(false);
		} catch (error) {
			setError("An error occurred while updating lead info");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<ModalLayout title={"Edit Lead"} size="md" isOpen={isOpen} onClose={onClose} error={error}>
			<form onSubmit={handleSubmit}>
				<Stack spacing={4}>
					<InputFormControl
						label={"Name of Company"}
						name="name"
						valueText={formData?.name}
						handleChange={handleChange}
						required
					/>
					<InputFormControl
						label={"Email"}
						type="email"
						name="email"
						valueText={formData?.email}
						handleChange={handleChange}
						required
					/>
					<InputFormControl
						isInvalid={!!phoneNumberError}
						label={"Phone"}
						name="phone"
						valueText={formData?.phone}
						handleChange={handleChange}
						error={phoneNumberError}
						required
					/>

					<FormControl>
						<FormLabel>Stage</FormLabel>
						<Select
							icon={<FaCaretDown />}
							borderRadius="10px"
							size="sm"
							placeholder="Select Stage"
							name="stage"
							value={formData?.stage}
							onChange={handleChange}
						>
							{LEAD_STAGES.map(({ abbr, name }) => (
								<option value={abbr} key={abbr}>
									{`${abbr} - ${name}`}
								</option>
							))}
						</Select>
					</FormControl>
					<ActionButtonGroup
						submitBtnName={"Save"}
						isDisabled={phoneNumberError !== ""}
						isLoading={isSubmitting}
						onClose={onClose}
					/>
				</Stack>
			</form>
		</ModalLayout>
	);
};

export default EditLead;
