import { Stack, useToast } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import TextAreaFormControl from "components/ui/form/TextAreaFormControl";
import ModalLayout from "components/ui/modal/ModalLayout";
import { useState } from "react";
import ContactService from "services/ContactService";

const ContactForm = ({ showContactForm, handleClose }) => {
	const initialFormData = {
		firstName: "",
		lastName: "",
		contactEmail: "",
		query: "",
	};
	const [formData, setFormData] = useState(initialFormData);
	const [isLoading, setIsLoading] = useState(false);
	const toast = useToast();

	const showToast = (type, title, description) =>
		toast({
			title,
			description,
			status: type,
			duration: 5000,
			isClosable: true,
		});

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const { data } = await ContactService.contactCustomer(formData);
			setIsLoading(false);
			showToast("success", data.message, "");
			handleClose();
		} catch (error) {
			setIsLoading(false);
			showToast(
				"error",
				"Error Submitting Form",
				"There was an error sending the email. Please try again.",
			);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	return (
		<ModalLayout title={"Contact Details"} size="lg" isOpen={showContactForm} onClose={handleClose}>
			<form onSubmit={handleSubmit}>
				<Stack spacing={3} justifyContent={"end"}>
					<InputFormControl
						label={"Your first name"}
						name="firstName"
						valueText={formData.firstName}
						handleChange={handleChange}
					/>
					<InputFormControl
						label={"Your last name"}
						name="lastName"
						valueText={formData.lastName}
						handleChange={handleChange}
					/>
					<InputFormControl
						type="email"
						label={"Your email"}
						name="contactEmail"
						valueText={formData.contactEmail}
						handleChange={handleChange}
						required
					/>
					<TextAreaFormControl
						label={"Please enter your query"}
						name="query"
						valueText={formData.query}
						handleChange={handleChange}
						required
					/>
					<ActionButtonGroup
						size="xs"
						isDisabled={formData.email === "" || formData.query === ""}
						submitBtnName={"Submit"}
						onClose={handleClose}
						onOpen={handleSubmit}
						isLoading={isLoading}
					/>
				</Stack>
			</form>
		</ModalLayout>
	);
};

export default ContactForm;
