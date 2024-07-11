import {
	Avatar,
	Box,
	Button,
	Divider,
	FormControl,
	FormLabel,
	HStack,
	Input,
	Select,
	Stack,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaAddressCard, FaBuilding } from "react-icons/fa";
import IndustryService from "services/IndustryService";

const EditContactForm = ({ selectedContact, onSave, onCancel }) => {
	const [formData, setFormData] = useState(selectedContact);
	const [industryTypeOptions, setIndustryTypeOptions] = useState([]);

	useEffect(() => {
		const fetchIndustryTypes = async () => {
			try {
				const response = await IndustryService.getIndustryType();
				setIndustryTypeOptions(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchIndustryTypes();
	}, []);

	useEffect(() => {
		setFormData(selectedContact);
	}, [selectedContact]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleSave = () => {
		onSave(formData);
	};
	return (
		<Box mx="auto" m="2em" p={4} borderWidth="1px" borderRadius="lg">
			{industryTypeOptions.length && (
				<form>
					<HStack maxW="100%" justify="center">
						<Stack flex={1}>
							<VStack align="center" justify="center" mb="4">
								<Avatar name=" " size="lg" bg="gray.300" position="relative">
									<FaBuilding className="header-logo" />
								</Avatar>
								<Box textAlign="center">
									<Text fontSize="xl" fontWeight="bold">
										Company Information
									</Text>
								</Box>
							</VStack>
							<FormControl mb={4}>
								<FormLabel>Company Name</FormLabel>
								<Input
									type="text"
									name="companyName"
									value={formData.companyName}
									onChange={handleChange}
									placeholder="Company Name"
								/>
							</FormControl>
							<FormControl>
								<FormLabel>Type Of Industry </FormLabel>
								<Select
									name="industryType"
									value={formData.industryType}
									onChange={handleChange}
								>
									{industryTypeOptions.map((type) => (
										<option value={type.name} key={type._id}>
											{type.name}
										</option>
									))}
								</Select>
							</FormControl>
							<FormControl mb={4}>
								<FormLabel>Company Address</FormLabel>
								<Input
									type="text"
									name="companyAddress"
									value={formData.companyAddress}
									onChange={handleChange}
									placeholder="Company Address"
								/>
							</FormControl>
							<FormControl mb={4}>
								<FormLabel>Website URL</FormLabel>
								<Input
									type="url"
									name="revenue"
									value={formData.revenue}
									onChange={handleChange}
									placeholder="Website URL"
								/>
							</FormControl>
							<FormControl mb={4}>
								<FormLabel>Number of employees</FormLabel>
								<Input
									type="number"
									name="employees"
									value={formData.employees}
									onChange={handleChange}
									placeholder="Number of employees"
								/>
							</FormControl>
						</Stack>
						<Divider
							orientation="vertical"
							height="600px"
							borderWidth="1px"
							borderColor="gray.300"
						/>
						<Stack flex={1}>
							<VStack align="center" justify="center" mb="4">
								<Avatar name=" " size="lg" bg="gray.300" position="relative">
									<FaAddressCard className="header-logo" />
								</Avatar>
								<Box textAlign="center">
									<Text fontSize="xl" fontWeight="bold">
										Primary Contact Information
									</Text>
								</Box>
							</VStack>
							<FormControl mb={4}>
								<FormLabel>First Name</FormLabel>
								<Input
									type="text"
									name="firstName"
									value={formData.firstName}
									onChange={handleChange}
									placeholder="First Name"
								/>
							</FormControl>
							<FormControl mb={4}>
								<FormLabel>Last Name</FormLabel>
								<Input
									type="text"
									name="lastName"
									value={formData.lastName}
									onChange={handleChange}
									placeholder="Last Name"
								/>
							</FormControl>
							<FormControl mb={4}>
								<FormLabel>Email</FormLabel>
								<Input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									placeholder="Email"
								/>
							</FormControl>
							<FormControl mb={4}>
								<FormLabel>Phone Number</FormLabel>
								<Input
									type="text"
									name="phone"
									value={formData.phone}
									onChange={handleChange}
									placeholder="phone"
								/>
							</FormControl>
							<FormControl mb={4}>
								<FormLabel>Business Address</FormLabel>
								<Input
									type="text"
									name="primaryContactAddress"
									value={formData.primaryContactAddress}
									onChange={handleChange}
									placeholder="Primary Contact"
								/>
							</FormControl>
						</Stack>
					</HStack>
					<HStack>
						<Button bg="var(--logo_bg)" onClick={handleSave}>
							Save
						</Button>
						<Button colorScheme="gray" ml={2} onClick={onCancel}>
							Cancel
						</Button>
					</HStack>
				</form>
			)}
		</Box>
	);
};

export default EditContactForm;
