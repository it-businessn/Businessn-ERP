import { FormControl, FormLabel, Select, useToast } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import TextTitle from "components/ui/text/TextTitle";
import { COUNTRIES } from "erp-modules/payroll/onboard-user/customInfo";
import { useState } from "react";
import VoPayService from "services/VoPayService";

const PartnerForm = ({ setRefresh }) => {
	const toast = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const defaultClientData = {
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

	const defaultFormData = { name: "", email: "", country: "" };
	const [formData, setFormData] = useState(defaultFormData);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const submitClicked = async () => {
		setIsSubmitting(true);
		try {
			const { data } = await VoPayService.addPartner(formData);
			// const { data } = await VoPayService.addClient(formData);

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
			<TextTitle size="lg" title={`Add New Account`} />
			<InputFormControl
				label={"Name"}
				size={"sm"}
				name="name"
				valueText={formData?.name}
				handleChange={handleChange}
				required
				placeholder="Name of the person/company"
			/>
			<InputFormControl
				required
				size={"sm"}
				label={"Email"}
				name="email"
				valueText={formData?.email}
				handleChange={handleChange}
				placeholder="Email address of the person/company"
			/>
			<FormControl isRequired>
				<FormLabel size="sm">Country</FormLabel>
				<Select
					size="sm"
					name="country"
					value={formData.country || ""}
					onChange={handleChange}
					placeholder="Select Country"
				>
					{COUNTRIES.map(({ type, code }) => (
						<option key={type} value={code}>
							{type}
						</option>
					))}
				</Select>
			</FormControl>

			{/* <InputFormControl
				label={"Name"}
				size={"sm"}
				name="name"
				valueText={formData?.FirstName}
				handleChange={handleChange}
				required
				placeholder="Name of the person/company"
			/>
			<InputFormControl
				label={"Name"}
				size={"sm"}
				name="name"
				valueText={formData?.LastName}
				handleChange={handleChange}
				required
				placeholder="Name of the person/company"
			/>
			<InputFormControl
				required
				size={"sm"}
				label={"Email"}
				name="email"
				valueText={formData?.EmailAddress}
				handleChange={handleChange}
				placeholder="Email address of the person/company"
			/>
			<InputFormControl
				required
				size={"sm"}
				label={"Email"}
				name="Address1"
				valueText={formData?.Address1}
				handleChange={handleChange}
				placeholder="Email address of the person/company"
			/>
			<InputFormControl
				required
				size={"sm"}
				label={"Email"}
				name="City"
				valueText={formData?.City}
				handleChange={handleChange}
				placeholder="Email address of the person/company"
			/>
			<FormControl isRequired>
				<FormLabel size="sm">Country</FormLabel>
				<Select
					size="sm"
					name="Country"
					value={formData.Country || ""}
					onChange={handleChange}
					placeholder="Select Country"
				>
					{COUNTRIES.map(({ type, code }) => (
						<option key={type} value={code}>
							{type}
						</option>
					))}
				</Select>
			</FormControl>
			<FormControl isRequired>
				<FormLabel size="sm">Province/State</FormLabel>
				<Select
					size="sm"
					name="Province"
					value={formData.Province || ""}
					onChange={handleChange}
					placeholder="Select Province"
				>
					{employmentProvinces.map(({ name, id }) => (
						<option key={name} value={id}>
							{name}
						</option>
					))}
				</Select>
			</FormControl>
			<InputFormControl
				required
				size={"sm"}
				label={"Email"}
				name="PostalCode"
				valueText={formData?.PostalCode}
				handleChange={handleChange}
				placeholder="Email address of the person/company"
			/>
			<InputFormControl
				required
				size={"sm"}
				label={"Email"}
				name="Nationality"
				valueText={formData?.Nationality}
				handleChange={handleChange}
				placeholder="Email address of the person/company"
			/>
			<InputFormControl
				required
				size={"sm"}
				label={"Email"}
				name="PhoneNumber"
				valueText={formData?.PhoneNumber}
				handleChange={handleChange}
				placeholder="Email address of the person/company"
			/>
			<InputFormControl
				required
				size={"sm"}
				label={"Email"}
				name="DOB"
				valueText={formData?.DOB}
				handleChange={handleChange}
				placeholder="Email address of the person/company"
			/>
			<InputFormControl
				required
				size={"sm"}
				label={"Email"}
				name="SINLastDigits"
				valueText={formData?.SINLastDigits}
				handleChange={handleChange}
				placeholder="Email address of the person/company"
			/> */}
			<ActionButtonGroup
				isDisabled={!formData?.name || !formData.email || !formData.country}
				submitBtnName="Add"
				onOpen={submitClicked}
				size="sm"
				justifyContent="end"
				isLoading={isSubmitting}
			/>
		</>
	);
};

export default PartnerForm;
