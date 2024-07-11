import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Container,
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
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import InputFormControl from "components/ui/form/InputFormControl";
import RequiredLabel from "components/ui/form/RequiredLabel";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginService from "services/LoginService";
import SettingService from "services/SettingService";
import UserService from "services/UserService";
// import signUpImg from "../../assets/logos/BusinessN_dark.jpg";

const SignUp = ({ isModal, setRefresh, onClose }) => {
	const defaultFormData = {
		company: "",
		companyId: "",
		firstName: "",
		middleName: "",
		lastName: "",
		email: "",
		password: "",
		role: "",
		department: "",
		baseModule: "",
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
	const [companies, setCompanies] = useState(null);
	const [empTypes, setEmpTypes] = useState(false);
	const [roles, setRoles] = useState(false);
	const [departments, setDepartments] = useState(false);
	const [modules, setModules] = useState(false);
	const [managers, setManagers] = useState(false);
	const [formData, setFormData] = useState(defaultFormData);

	useEffect(() => {
		const fetchAllCompanies = async () => {
			try {
				const response = await SettingService.getAllCompanies();
				setCompanies(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllCompanies();
	}, []);

	useEffect(() => {
		const fetchAllEmpTypes = async () => {
			try {
				const response = await SettingService.getAllEmploymentTypes(
					formData.company,
				);
				setEmpTypes(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		const fetchAllRoles = async () => {
			try {
				const response = await SettingService.getAllRoles(formData.company);
				setRoles(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		const fetchAllDepartments = async () => {
			try {
				const response = await SettingService.getAllDepartments(
					formData.company,
				);
				setDepartments(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		const fetchAllManagers = async () => {
			try {
				const response = await UserService.getAllManagers(formData.company);
				setManagers(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		const fetchAllModules = async () => {
			try {
				const response = await SettingService.getAllModules(formData.company);
				setModules(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllModules();
		fetchAllManagers();
		fetchAllRoles();
		fetchAllDepartments();
		fetchAllEmpTypes();
	}, [formData.company]);

	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const goBack = () => {
		navigate(-1);
	};

	const isInvalid =
		formData.firstName === "" ||
		formData.email === "" ||
		formData.role === "" ||
		formData.employmentType === "" ||
		formData.phoneNumber === "";

	const handleSubmit = async (e) => {
		e.preventDefault();

		setIsLoading(true);
		try {
			await LoginService.createEmployee(formData);
			resetForm();
			setIsLoading(false);
			if (isModal) {
				setRefresh((prev) => !prev);
				onClose();
				return;
			}
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
		<Box overflow="auto" height={isModal ? "70vh" : "100vh"}>
			<Container
				py={{
					base: "3",
				}}
				maxW={isModal ? "" : "4xl"}
			>
				<Stack
					spacing={10}
					borderRadius="10px"
					border={isModal ? "none" : "1px solid var(--lead_cards_border)"}
					bg={isModal ? "" : "var(--bg_color_1)"}
					p={isModal ? 0 : "1em"}
					color={"var(--logo_bg)"}
				>
					{!isModal && (
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
					)}

					<form onSubmit={handleSubmit}>
						{companies && (
							<FormControl>
								<FormLabel>Select Company</FormLabel>
								<Select
									name="company"
									value={formData.company}
									bg={"var(--main_color)"}
									onChange={handleChange}
									placeholder="Select Company"
								>
									{companies?.map((company) => (
										<option key={company._id} value={company.name}>
											{company.name}
										</option>
									))}
								</Select>
							</FormControl>
						)}
						<InputFormControl
							label={"Company Id"}
							name="companyId"
							valueText={formData.companyId}
							handleChange={handleChange}
							placeholder="Company Id"
						/>
						<InputFormControl
							label={"First Name"}
							name="firstName"
							valueText={formData.firstName}
							handleChange={handleChange}
							placeholder="First Name"
							required
						/>
						<InputFormControl
							label={"Middle Name"}
							name="middleName"
							valueText={formData.middleName}
							handleChange={handleChange}
							placeholder="Middle Name"
						/>
						<InputFormControl
							label={"Last Name"}
							name="lastName"
							valueText={formData.lastName}
							handleChange={handleChange}
							placeholder="Last Name"
						/>
						<InputFormControl
							label={"Email"}
							name="email"
							type="email"
							valueText={formData.email}
							handleChange={handleChange}
							placeholder="Enter email address"
							required
						/>
						<FormControl mb={4}>
							<FormLabel>Password</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? "text" : "password"}
									name="password"
									value={formData.password}
									onChange={handleChange}
									placeholder="Enter password"
									required
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
						{empTypes && (
							<FormControl mb={4}>
								<RequiredLabel required label="Type of Employment" />
								<Select
									name="employmentType"
									value={formData.employmentType}
									bg={"var(--main_color)"}
									onChange={handleChange}
									placeholder="Select employment type"
								>
									{empTypes?.map((empType) => (
										<option key={empType._id} value={empType.name}>
											{empType.name}
										</option>
									))}
								</Select>
							</FormControl>
						)}
						{roles && (
							<FormControl mb={4}>
								<RequiredLabel label="Type of Role" required />
								<Select
									name="role"
									value={formData.role}
									bg={"var(--main_color)"}
									onChange={handleChange}
									placeholder="Select role"
								>
									{roles?.map((role) => (
										<option key={role._id} value={role.name}>
											{role.name}
										</option>
									))}
								</Select>
							</FormControl>
						)}
						{departments && (
							<FormControl mb={4}>
								<FormLabel>Type of Department</FormLabel>
								<Select
									bg={"var(--main_color)"}
									name="department"
									value={formData.department}
									onChange={handleChange}
									placeholder="Select department"
								>
									{departments?.map((dept) => (
										<option key={dept._id} value={dept.name}>
											{dept.name}
										</option>
									))}
								</Select>
							</FormControl>
						)}
						{modules && (
							<FormControl mb={4}>
								<FormLabel>Type of Base module</FormLabel>
								<Select
									bg={"var(--main_color)"}
									name="baseModule"
									value={formData.baseModule}
									onChange={handleChange}
									placeholder="Select base module"
								>
									{modules?.map((module) => (
										<option key={module._id} value={module.name}>
											{module.name}
										</option>
									))}
								</Select>
							</FormControl>
						)}
						{managers && (
							<FormControl mb={4}>
								<FormLabel>Manager</FormLabel>
								<Select
									bg={"var(--main_color)"}
									name="manager"
									value={formData.manager}
									onChange={handleChange}
									placeholder="Select manager"
								>
									{managers?.map((manager) => (
										<option key={manager._id} value={manager.fullName}>
											{manager.fullName}
										</option>
									))}
								</Select>
							</FormControl>
						)}
						<InputFormControl
							label={"Phone Number"}
							name="phoneNumber"
							valueText={formData.phoneNumber}
							handleChange={handleChange}
							placeholder="Phone Number"
							required
						/>
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
						<ActionButtonGroup
							submitBtnName={"Add"}
							isLoading={isLoading}
							isDisabled={isInvalid}
							onClose={goBack}
						/>
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
