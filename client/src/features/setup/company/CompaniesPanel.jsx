import {
	Box,
	FormLabel,
	HStack,
	Input,
	Select,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	useToast,
} from "@chakra-ui/react";
import ActionButton from "components/ui/button/ActionButton";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import TextTitle from "components/ui/text/TextTitle";
import { COUNTRIES } from "erp-modules/payroll/onboard-user/customInfo";
import useCompanies from "hooks/useCompanies";
import { useEffect, useState } from "react";
import SettingService from "services/SettingService";

const CompaniesPanel = ({ setOpenCompanyForm }) => {
	const toast = useToast();
	const defaultFormData = {
		name: "",
		founding_year: "",
		registration_number: "",
		address: {
			streetNumber: "",
			city: "",
			state: "",
			postalCode: "",
			country: "",
		},
		industry_type: "",
	};
	const [formData, setFormData] = useState(defaultFormData);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isRefresh, setIsRefresh] = useState(false);
	const [availableProvinces, setAvailableProvinces] = useState([]);
	const companies = useCompanies(isRefresh);

	useEffect(() => {
		const selectedCountry = COUNTRIES.find(({ code }) => code === formData.address.country);
		if (selectedCountry) {
			setAvailableProvinces(selectedCountry?.provinces);
		}
	}, [formData.address.country]);

	const resetForm = () => setFormData(defaultFormData);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);
		try {
			await SettingService.addCompany(formData);
			setIsRefresh(!isRefresh);
			toast({
				title: "Company added successfully",
				status: "success",
				duration: 1500,
				isClosable: true,
			});
			resetForm();
			setOpenCompanyForm(false);
		} catch (error) {
			console.log("An error occurred. Please try again.", error);
		} finally {
			setIsSubmitting(false);
		}
	};
	return (
		<>
			<Box>
				<FormLabel>Company Details</FormLabel>
				<HStack>
					<Input
						type="text"
						name="name"
						placeholder="Enter Company Name"
						value={formData?.name}
						onChange={handleChange}
					/>
					<Input
						name="founding_year"
						placeholder="Enter Founding Year"
						value={formData?.founding_year}
						onChange={handleChange}
					/>
					<Input
						name="registration_number"
						placeholder="Enter Registration Number"
						value={formData?.registration_number}
						onChange={handleChange}
					/>
					<Input
						name="industry_type"
						placeholder="Enter Type of Industry"
						value={formData?.industry_type}
						onChange={handleChange}
					/>
				</HStack>
				<FormLabel mt={3}>Company Address</FormLabel>
				<HStack>
					<Input
						type="text"
						name="streetNumber"
						value={formData?.address.streetNumber}
						onChange={(e) => {
							setFormData({
								...formData,
								address: {
									...formData?.address,
									streetNumber: e.target.value,
								},
							});
						}}
						placeholder="Street Number"
					/>

					<Input
						type="text"
						name="city"
						value={formData?.address.city}
						onChange={(e) => {
							setFormData({
								...formData,
								address: {
									...formData?.address,
									city: e.target.value,
								},
							});
						}}
						placeholder="City"
					/>
				</HStack>
				<HStack mt={3}>
					<Input
						type="text"
						name="postalCode"
						value={formData?.address.postalCode}
						onChange={(e) => {
							setFormData({
								...formData,
								address: {
									...formData?.address,
									postalCode: e.target.value,
								},
							});
						}}
						placeholder="Postal Code"
					/>
					<Select
						placeholder="Select Country"
						value={formData.address.country}
						onChange={(e) => {
							if (e.target.value) {
								setFormData({
									...formData,
									address: {
										...formData?.address,
										country: e.target.value,
									},
								});
							}
						}}
					>
						{COUNTRIES.map(({ type, code }) => (
							<option key={type} value={code}>
								{type}
							</option>
						))}
					</Select>
					<Select
						placeholder="Select Province/State"
						value={formData.address.state}
						onChange={(e) => {
							if (e.target.value) {
								setFormData({
									...formData,
									address: {
										...formData?.address,
										state: e.target.value,
									},
								});
							}
						}}
					>
						{availableProvinces.map(({ name, id }) => (
							<option key={name} value={id}>
								{name}
							</option>
						))}
					</Select>
				</HStack>
				<ActionButton
					mt={2}
					isDisabled={formData?.name === ""}
					isLoading={isSubmitting}
					name="Add Company"
					onClick={handleSubmit}
				/>
			</Box>
			{companies && (
				<Box>
					<TextTitle mt={3} title="All companies" />
					<Table variant="simple" size="sm">
						<Thead>
							<Tr>
								<Th>Name</Th>
								<Th>Registration Number</Th>
							</Tr>
						</Thead>
						<Tbody>
							{(!companies || companies?.length === 0) && (
								<EmptyRowRecord data={companies} colSpan={2} />
							)}
							{companies?.map((company) => (
								<Tr key={company._id}>
									<Td>{company.name}</Td>
									<Td>{company.registration_number}</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</Box>
			)}
		</>
	);
};

export default CompaniesPanel;
