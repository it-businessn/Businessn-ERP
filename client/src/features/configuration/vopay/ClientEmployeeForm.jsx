import { FormControl, FormLabel, HStack, Select, useToast } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import TextTitle from "components/ui/text/TextTitle";
import { COUNTRIES } from "erp-modules/payroll/onboard-user/customInfo";
import { useEffect, useState } from "react";
import VoPayService from "services/VoPayService";

const ClientEmployeeForm = ({ setRefresh, ClientAccountID }) => {
	const toast = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const defaultFormData = {
		ClientAccountID,
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

	const [availableProvinces, setAvailableProvinces] = useState([]);
	const [formData, setFormData] = useState(defaultFormData);

	useEffect(() => {
		const selectedCountry = COUNTRIES.find(({ code }) => code === formData.Country);
		if (selectedCountry) {
			setAvailableProvinces(selectedCountry?.provinces);
		}
	}, [formData.Country]);

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
			<TextTitle title={"Address"} size={"sm"} />
			<InputFormControl
				required
				size={"sm"}
				label={"Street Address"}
				name="Address1"
				valueText={formData?.Address1}
				handleChange={handleChange}
			/>

			<InputFormControl
				required
				size={"sm"}
				label={"City"}
				name="City"
				valueText={formData?.City}
				handleChange={handleChange}
			/>
			<InputFormControl
				required
				size={"sm"}
				label={"Postal Code"}
				name="PostalCode"
				valueText={formData?.PostalCode}
				handleChange={handleChange}
			/>
			<HStack>
				<FormControl isRequired>
					<FormLabel size="sm">Country</FormLabel>
					<Select
						placeholder="Select Country"
						size={"sm"}
						name="Country"
						value={formData.Country}
						onChange={handleChange}
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
						placeholder="Select Province/State"
						value={formData.Province}
						size={"sm"}
						name="Province"
						onChange={handleChange}
					>
						{availableProvinces.map(({ name, id }) => (
							<option key={name} value={id}>
								{name}
							</option>
						))}
					</Select>
				</FormControl>
			</HStack>
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
