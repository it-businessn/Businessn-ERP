import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Container,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Heading,
	Input,
	InputGroup,
	InputRightElement,
	Select,
	Stack,
} from "@chakra-ui/react";
import Logo from "components/logo";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginService from "services/LoginService";

const SignUp = () => {
	const defaultFormData = {
		companyId: "20240001",
		firstName: "",
		middleName: "",
		lastName: "",
		email: "",
		password: "",
		role: "",
		department: "",
		manager: "",
		phoneNumber: "",
		primaryAddress: {
			streetNumber: "",
			city: "",
			state: "",
			postalCode: "",
			country: "",
		},
		employmentType: "",
	};
	const [formData, setFormData] = useState(defaultFormData);
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const goBack = () => {
		navigate(-1);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		// setIsLoading(true);
		try {
			await LoginService.createEmployee(formData);
			resetForm();
			setIsLoading(false);
			navigate("/login");
		} catch (error) {
			setIsLoading(false);
			console.error("Error adding user:", error?.response?.data);
			setError(error?.response?.data?.error);
		}
	};
	const resetForm = () => setFormData(defaultFormData);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleTogglePassword = () => {
		setShowPassword((prevShowPassword) => !prevShowPassword);
	};
	return (
		<Box overflow="auto" height={"100vh"}>
			<Container
				py={{
					base: "3",
				}}
				maxW="4xl"
			>
				<Stack
					spacing={10}
					borderRadius="10px"
					border={"1px solid var(--lead_cards_border)"}
					bg={"var(--bg_color_1)"}
					p="1em"
					color={"brand.logo_bg"}
				>
					<Stack align="center">
						<Logo />
						<Stack spacing="3" textAlign="center">
							<Heading
								size={{
									base: "xs",
									md: "sm",
								}}
							>
								Create an account
							</Heading>
						</Stack>
					</Stack>

					<form onSubmit={handleSubmit}>
						<FormControl mb={4}>
							<FormLabel>Company Id</FormLabel>
							<Input
								type="text"
								name="companyId"
								value={formData.companyId}
								onChange={handleChange}
								placeholder="Company Id"
							/>
						</FormControl>
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
							<FormLabel>Middle Name</FormLabel>
							<Input
								type="text"
								name="middleName"
								value={formData.middleName}
								onChange={handleChange}
								placeholder="Middle Name"
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
								placeholder="Enter email address"
							/>
						</FormControl>
						<FormControl mb={4}>
							<FormLabel>Password</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? "text" : "password"}
									name="password"
									value={formData.password}
									onChange={handleChange}
									placeholder="Enter password"
								/>
								<InputRightElement>
									<Button
										size="sm"
										variant="unstyled"
										onClick={handleTogglePassword}
									>
										{showPassword ? <ViewOffIcon /> : <ViewIcon />}
									</Button>
								</InputRightElement>
							</InputGroup>
						</FormControl>
						<FormControl mb={4}>
							<FormLabel>Type of Employment</FormLabel>
							<Select
								name="employmentType"
								value={formData.employmentType}
								bg={"brand.100"}
								onChange={handleChange}
								placeholder="Select employment type"
							>
								<option value="Part-Time Employee">Part-Time Employee</option>
								<option value="Full-Time Employee">Full-Time Employee</option>
								<option value="Temporary Employee (Contractor)">
									Temporary Employee (Contractor)
								</option>
							</Select>
						</FormControl>
						<FormControl mb={4}>
							<FormLabel>Type of Role</FormLabel>
							<Select
								name="role"
								value={formData.role}
								bg={"brand.100"}
								onChange={handleChange}
								placeholder="Select role"
							>
								<option value="Employee">Employee</option>
								<option value="HR Manager">HR Manager</option>
								<option value="Sales Manager">Sales Manager</option>
								<option value="Administrator">Administrator</option>
							</Select>
						</FormControl>
						<FormControl mb={4}>
							<FormLabel>Type of Department</FormLabel>
							<Select
								bg={"brand.100"}
								name="department"
								value={formData.department}
								onChange={handleChange}
								placeholder="Select department"
							>
								<option value="Human Resources/HR Department">
									Human Resources/HR Department
								</option>
								<option value="Information Technology (IT)">
									Information Technology (IT)
								</option>
								<option value="Finance and Accounting">
									Finance and Accounting
								</option>
								<option value="Sales and Marketing">Sales and Marketing</option>
								<option value="Customer Service and Support">
									Customer Service and Support
								</option>
							</Select>
						</FormControl>
						<FormControl mb={4}>
							<FormLabel>Manager</FormLabel>
							<Select
								bg={"brand.100"}
								name="manager"
								value={formData.manager}
								onChange={handleChange}
								placeholder="Select manager"
							>
								<option value="Manager 1">Manager 1</option>
								<option value="Manager 2">Manager 2</option>
							</Select>
						</FormControl>
						<FormControl mb={4}>
							<FormLabel>Phone Number</FormLabel>
							<Input
								type="text"
								name="phoneNumber"
								value={formData.phoneNumber}
								onChange={handleChange}
								placeholder="Phone Number"
							/>
						</FormControl>
						<FormControl mb={4}>
							<FormLabel>Address</FormLabel>
							<HStack>
								<Input
									type="text"
									name="streetNumber"
									value={formData.primaryAddress.streetNumber}
									onChange={(e) => {
										setFormData({
											...formData,
											primaryAddress: {
												...formData.primaryAddress,
												streetNumber: e.target.value,
											},
										});
									}}
									placeholder="Street Number"
								/>

								<Input
									type="text"
									name="city"
									value={formData.primaryAddress.city}
									onChange={(e) => {
										setFormData({
											...formData,
											primaryAddress: {
												...formData.primaryAddress,
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
									value={formData.primaryAddress.state}
									onChange={(e) => {
										setFormData({
											...formData,
											primaryAddress: {
												...formData.primaryAddress,
												state: e.target.value,
											},
										});
									}}
									placeholder="State"
								/>
								<Input
									type="text"
									name="postalCode"
									value={formData.primaryAddress.postalCode}
									onChange={(e) => {
										setFormData({
											...formData,
											primaryAddress: {
												...formData.primaryAddress,
												postalCode: e.target.value,
											},
										});
									}}
									placeholder="Postal Code"
								/>
								<Input
									type="text"
									name="country"
									value={formData.primaryAddress.country}
									onChange={(e) => {
										setFormData({
											...formData,
											primaryAddress: {
												...formData.primaryAddress,
												country: e.target.value,
											},
										});
									}}
									placeholder="Country"
								/>
							</HStack>
						</FormControl>
						<Flex justifyContent="flex-end">
							<Button isLoading={isLoading} bg="brand.logo_bg" type="submit">
								Add
							</Button>
							<Button colorScheme="gray" ml={2} onClick={goBack}>
								Cancel
							</Button>
						</Flex>
					</form>
					{error && (
						<Alert status="error" mt={4}>
							<AlertIcon />
							{error}
						</Alert>
					)}
				</Stack>
			</Container>
		</Box>
	);
};

export default SignUp;
