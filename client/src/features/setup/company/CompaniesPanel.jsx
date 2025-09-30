import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
	FormLabel,
	HStack,
	IconButton,
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
import { ConfigTabLayout } from "components/ConfigTabLayout";
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
			if (setOpenCompanyForm) setOpenCompanyForm(false);
		} catch (error) {
			toast({
				title: "Error",
				description: error?.response?.data?.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			console.log("An error occurred. Please try again.", error);
		} finally {
			setIsSubmitting(false);
		}
	};
	return (
		<ConfigTabLayout
			tableData={companies}
			tableTitle="All Companies"
			tableContent={
				<Table variant="simple" size="sm">
					<Thead>
						<Tr>
							<Th>Name</Th>
							<Th>Registration Number</Th>
							<Th>Action</Th>
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
								<Td>
									<HStack spacing={2}>
										<IconButton
											aria-label="Edit holiday"
											icon={<EditIcon />}
											size="sm"
											// onClick={() => handleEdit(holiday)}
											color="var(--banner_bg)"
											_hover={{
												bg: "var(--banner_bg)",
												color: "white",
											}}
										/>
										<IconButton
											aria-label="Delete holiday"
											icon={<DeleteIcon />}
											size="sm"
											color="var(--banner_bg)"
											_hover={{
												bg: "var(--banner_bg)",
												color: "white",
											}}
											onClick={() => {
												// setShowConfirmationPopUp(true);
												// setDeleteRecordId(holiday._id);
											}}
										/>
									</HStack>
								</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			}
			leftContent={
				<>
					<TextTitle size="lg" title="Add New Company" />
					<FormLabel>Company Details</FormLabel>
					<Input
						type="text"
						name="name"
						placeholder="Enter Company Name"
						value={formData?.name}
						onChange={handleChange}
						size={"sm"}
					/>
					<HStack>
						<Input
							name="founding_year"
							placeholder="Enter Founding Year"
							value={formData?.founding_year}
							onChange={handleChange}
							size={"sm"}
						/>
						<Input
							name="registration_number"
							size={"sm"}
							placeholder="Enter Registration Number"
							value={formData?.registration_number}
							onChange={handleChange}
						/>
					</HStack>
					<Input
						name="industry_type"
						size={"sm"}
						placeholder="Enter Type of Industry"
						value={formData?.industry_type}
						onChange={handleChange}
					/>
					<FormLabel mt={3}>Company Address</FormLabel>
					<Input
						type="text"
						size={"sm"}
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
						placeholder="Street Address"
					/>
					<HStack>
						<Input
							type="text"
							name="city"
							size={"sm"}
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
						<Input
							type="text"
							name="postalCode"
							size={"sm"}
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
					</HStack>
					<HStack mt={3}>
						<Select
							placeholder="Select Country"
							size={"sm"}
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
							size={"sm"}
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
						isDisabled={formData?.name === "" || formData?.registration_number === ""}
						isLoading={isSubmitting}
						name="Add Company"
						size={"sm"}
						onClick={handleSubmit}
					/>
				</>
			}
		/>
	);
};

export default CompaniesPanel;
