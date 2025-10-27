import { HStack, useToast } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import TextTitle from "components/ui/text/TextTitle";
import { useState } from "react";
import VoPayService from "services/VoPayService";

const ClientEmployeeForm = ({ setRefresh }) => {
	const toast = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const defaultFormData = {
		ClientAccountID: "",
		FirstName: "",
		LastName: "",
		EmailAddress: "",
		Address1: "",
		City: "",
		Province: "",
		Country: "",
		Nationality: "",
		PostalCode: "",
		Currency: "CAD",
		PhoneNumber: "",
		DOB: "",
		SINLastDigits: "",
	};

	const [formData, setFormData] = useState(defaultFormData);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const submitClicked = async () => {
		setIsSubmitting(true);
		try {
			const { data } = await VoPayService.createClientEmployee(formData);

			if (data.Success === true) {
				setRefresh((prev) => !prev);
				setFormData(defaultFormData);
				toast({
					title: "Account added successfully",
					status: "success",
					duration: 1500,
					isClosable: true,
				});
			} else {
				toast({
					title: "Error",
					description: data?.ErrorMessage,
					status: "error",
					duration: 3000,
					isClosable: true,
				});
			}
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

	return (
		<>
			<TextTitle size="lg" title={`Add New Client`} />
			<HStack>
				<InputFormControl
					label={"FirstName"}
					size={"sm"}
					name="FirstName"
					valueText={formData?.FirstName}
					handleChange={handleChange}
					required
					placeholder="Name of the person/company"
				/>
				<InputFormControl
					required
					size={"sm"}
					label={"LastName"}
					name="LastName"
					valueText={formData?.LastName}
					handleChange={handleChange}
					placeholder="Email address of the person/company"
				/>
			</HStack>
			<InputFormControl
				required
				size={"sm"}
				label={"Email"}
				type="email"
				name="EmailAddress"
				valueText={formData?.EmailAddress}
				handleChange={handleChange}
				placeholder="Email address of the person/company"
			/>
			<InputFormControl
				required
				size={"sm"}
				type="tel"
				label={"PhoneNumber"}
				name="PhoneNumber"
				valueText={formData?.PhoneNumber}
				handleChange={handleChange}
				placeholder="Email address of the person/company"
			/>
			<InputFormControl
				required
				size={"sm"}
				label={"DOB"}
				type="date"
				name="DOB"
				valueText={formData?.DOB}
				handleChange={handleChange}
				placeholder="Email address of the person/company"
			/>

			<InputFormControl
				required
				size={"sm"}
				type="number"
				label={"SINLastDigits"}
				name="SINLastDigits"
				maxLength={4}
				valueText={formData?.SINLastDigits}
				handleChange={handleChange}
				placeholder="Email address of the person/company"
			/>

			<ActionButtonGroup
				isDisabled={!formData?.FirstName || !formData.LastName || !formData.EmailAddress}
				submitBtnName="Add"
				onOpen={submitClicked}
				size="sm"
				justifyContent="end"
				isLoading={isSubmitting}
			/>
		</>
	);
};

export default ClientEmployeeForm;
