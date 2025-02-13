import {
	FormLabel,
	HStack,
	Input,
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
import useCompanies from "hooks/useCompanies";
import { useState } from "react";
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

	const companies = useCompanies(isRefresh);

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
			console.log("An error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};
	return (
		<>
			<FormLabel>Company Details</FormLabel>
			<HStack>
				<Input
					type="text"
					name="name"
					placeholder="Enter Company Name"
					value={formData.name}
					onChange={handleChange}
				/>
				<Input
					name="founding_year"
					placeholder="Enter Founding Year"
					value={formData.founding_year}
					onChange={handleChange}
				/>
				<Input
					name="registration_number"
					placeholder="Enter Registration Number"
					value={formData.registration_number}
					onChange={handleChange}
				/>
				<Input
					name="industry_type"
					placeholder="Enter Type of Industry"
					value={formData.industry_type}
					onChange={handleChange}
				/>
			</HStack>
			<FormLabel mt={3}>Company Address</FormLabel>
			<HStack>
				<Input
					type="text"
					name="streetNumber"
					value={formData.address.streetNumber}
					onChange={(e) => {
						setFormData({
							...formData,
							address: {
								...formData.address,
								streetNumber: e.target.value,
							},
						});
					}}
					placeholder="Street Number"
				/>

				<Input
					type="text"
					name="city"
					value={formData.address.city}
					onChange={(e) => {
						setFormData({
							...formData,
							address: {
								...formData.address,
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
					name="state"
					value={formData.address.state}
					onChange={(e) => {
						setFormData({
							...formData,
							address: {
								...formData.address,
								state: e.target.value,
							},
						});
					}}
					placeholder="State"
				/>
				<Input
					type="text"
					name="postalCode"
					value={formData.address.postalCode}
					onChange={(e) => {
						setFormData({
							...formData,
							address: {
								...formData.address,
								postalCode: e.target.value,
							},
						});
					}}
					placeholder="Postal Code"
				/>
				<Input
					type="text"
					name="country"
					value={formData.address.country}
					onChange={(e) => {
						setFormData({
							...formData,
							address: {
								...formData.address,
								country: e.target.value,
							},
						});
					}}
					placeholder="Country"
				/>
			</HStack>
			<ActionButton
				mt={2}
				isDisabled={formData.name === ""}
				isLoading={isSubmitting}
				name="Add Company"
				onClick={handleSubmit}
			/>
			{companies && (
				<>
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
				</>
			)}
		</>
	);
};

export default CompaniesPanel;
