import { FormControl, FormLabel, HStack, Select, useToast } from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import TextTitle from "components/ui/text/TextTitle";
import { COUNTRIES } from "erp-modules/payroll/onboard-user/customInfo";
import { useEffect, useState } from "react";
import SettingService from "services/SettingService";

export const CompanyForm = ({
	formData,
	setFormData,
	setOpenCompanyForm,
	resetForm,
	editingId,
	handleClose,
	setCompanies,
}) => {
	const toast = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [availableProvinces, setAvailableProvinces] = useState([]);

	useEffect(() => {
		const selectedCountry = COUNTRIES.find(({ code }) => code === formData.address.country);
		if (selectedCountry) {
			setAvailableProvinces(selectedCountry?.provinces);
		}
	}, [formData.address.country]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleUpdate = async () => {
		setIsSubmitting(true);
		try {
			await SettingService.updateCompany(formData, editingId);
			toast({
				title: "Company updated successfully",
				status: "success",
				duration: 1500,
				isClosable: true,
			});
			setCompanies((prev) =>
				prev.map((cc) =>
					cc._id === editingId
						? {
								...cc,
								address: formData?.address,
								cra_business_number: formData?.cra_business_number,
								founding_year: formData?.founding_year,
								industry_type: formData?.industry_type,
								name: formData?.name,
								registration_number: formData?.registration_number,
						  }
						: cc,
				),
			);
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

	const handleSubmit = async () => {
		setIsSubmitting(true);
		try {
			const { data } = await SettingService.addCompany(formData);
			toast({
				title: "Company added successfully",
				status: "success",
				duration: 1500,
				isClosable: true,
			});
			setCompanies((prev) => [data, ...prev]);
			resetForm();
			if (setOpenCompanyForm) setOpenCompanyForm(false);
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

	const handleAddressChange = (e) => {
		const { name, value } = e.target;
		if (value)
			setFormData({
				...formData,
				address: {
					...formData?.address,
					[name]: value,
				},
			});
	};

	return (
		<>
			<TextTitle size="lg" title={`${editingId ? "Update" : "Add New"} Company`} />
			<InputFormControl
				label={"Name"}
				name="name"
				size={"sm"}
				valueText={formData?.name}
				handleChange={handleChange}
			/>
			<HStack>
				<InputFormControl
					label={"Founding Year"}
					name="founding_year"
					size={"sm"}
					valueText={formData?.founding_year}
					handleChange={handleChange}
				/>
				<InputFormControl
					label={"Registration Number"}
					name="registration_number"
					size={"sm"}
					valueText={formData?.registration_number}
					handleChange={handleChange}
				/>
			</HStack>
			<InputFormControl
				label={"Type of Industry"}
				name="industry_type"
				size={"sm"}
				valueText={formData?.industry_type}
				handleChange={handleChange}
			/>
			<InputFormControl
				size={"sm"}
				label={"CRA Business Number"}
				name="cra_business_number"
				valueText={formData?.cra_business_number}
				handleChange={handleChange}
			/>
			<TextTitle title={"Address"} size={"sm"} />
			<InputFormControl
				size={"sm"}
				label={"Street Address"}
				name="streetNumber"
				valueText={formData?.address?.streetNumber}
				handleChange={handleAddressChange}
			/>
			<HStack>
				<InputFormControl
					size={"sm"}
					label={"City"}
					name="city"
					valueText={formData?.address?.city}
					handleChange={handleAddressChange}
				/>
				<InputFormControl
					size={"sm"}
					label={"Postal Code"}
					name="postalCode"
					valueText={formData?.address?.postalCode}
					handleChange={handleAddressChange}
				/>
			</HStack>
			<HStack mt={3}>
				<FormControl isRequired>
					<FormLabel size="sm">Country</FormLabel>
					<Select
						placeholder="Select Country"
						size={"sm"}
						name="country"
						value={formData.address.country}
						onChange={handleAddressChange}
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
						value={formData.address.state}
						size={"sm"}
						name="state"
						onChange={handleAddressChange}
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
				isDisabled={!formData?.name || !formData?.registration_number}
				submitBtnName={`${editingId ? "Save" : "Add"}`}
				closeLabel={editingId ? "Cancel" : ""}
				onClose={handleClose}
				onOpen={editingId ? handleUpdate : handleSubmit}
				size="sm"
				justifyContent="end"
				isLoading={isSubmitting}
			/>
		</>
	);
};
