import {
	Button,
	FormControl,
	FormHelperText,
	FormLabel,
	HStack,
	Input,
	Select,
	Stack,
} from "@chakra-ui/react";
import ModalLayout from "components/ui/ModalLayout";
import PrimaryButton from "components/ui/button/PrimaryButton";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import LeadsService from "services/LeadsService";
import { isValidPhoneNumber } from "utils";
import { LEAD_STAGES } from "../opportunities/data";

const EditLead = ({
	defaultLeadInfo,
	formData,
	isOpen,
	onClose,
	setFormData,
	setIsUpdated,
}) => {
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
			await LeadsService.updateLeadInfo(formData, formData._id);
			setIsUpdated(true);
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
		<ModalLayout
			title={"Edit Lead"}
			size="md"
			isOpen={isOpen}
			onClose={onClose}
			error={error}
		>
			<form onSubmit={handleSubmit}>
				<Stack spacing={4}>
					<FormControl>
						<FormLabel>Name of Company</FormLabel>
						<Input
							type="text"
							name="opportunityName"
							value={formData.opportunityName}
							onChange={handleChange}
							required
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Email</FormLabel>
						<Input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
						/>
					</FormControl>
					<FormControl isInvalid={!!phoneNumberError}>
						<FormLabel htmlFor="phone">Phone</FormLabel>
						<Input
							type="text"
							name="phone"
							value={formData.phone}
							onChange={handleChange}
							required
						/>
						<FormHelperText color="red.500">{phoneNumberError}</FormHelperText>
					</FormControl>
					<FormControl>
						<FormLabel>Stage</FormLabel>
						<Select
							icon={<FaCaretDown />}
							borderRadius="10px"
							size="sm"
							placeholder="Select Stage"
							name="stage"
							value={formData.stage}
							onChange={handleChange}
						>
							{LEAD_STAGES.map(({ abbr, name }) => (
								<option value={abbr} key={abbr}>
									{`${abbr} - ${name}`}
								</option>
							))}
						</Select>
					</FormControl>
					<HStack justifyContent={"end"}>
						<PrimaryButton
							isDisabled={phoneNumberError !== ""}
							name="Save"
							isLoading={isSubmitting}
							px="2em"
						/>

						<Button onClick={onClose} colorScheme="gray">
							Cancel
						</Button>
					</HStack>
				</Stack>
			</form>
		</ModalLayout>
	);
};

export default EditLead;
