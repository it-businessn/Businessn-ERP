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
import { useSignup } from "hooks/useSignup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginService from "services/LoginService";
import BaseModulePanel from "./BaseModulePanel";
import DepartmentsPanel from "./DepartmentsPanel";
// import EmploymentPanel from "./EmploymentPanel";
import { redirectLogin } from "api";
import useCompanies from "hooks/useCompanies";
import useDepartment from "hooks/useDepartment";
import LocalStorageService from "services/LocalStorageService";
import MultiSelectControl from "./MultiSelectControl";
import RolesPanel from "./RolesPanel";
// import CompaniesPanel from "features/setup/company/CompaniesPanel";
// import signUpImg from "../../assets/logos/BusinessN_dark.jpg";

const SignUp = ({ isModal, setRefresh, onClose, hideCompany }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const [dataRefresh, setDataRefresh] = useState(false);

	const goBack = () => {
		navigate(-1);
	};
	const { formData, resetForm, setFormData, roles, modules, managers } = useSignup(dataRefresh);

	const companies = useCompanies();
	const departments = useDepartment(LocalStorageService.getItem("selectedCompany"));
	// const [showAddEmpTypes, setShowAddEmpTypes] = useState(false);
	const [showAddRoles, setShowAddRoles] = useState(false);
	const [showAddDepartments, setShowAddDepartments] = useState(false);
	const [showAddModules, setShowAddModules] = useState(false);
	const [showAddManagers, setShowAddManagers] = useState(false);

	const isInvalid =
		formData?.firstName === "" ||
		formData?.email === "" ||
		formData?.role === "" ||
		// formData?.employmentType === "" ||
		formData?.phoneNumber === "";

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
			redirectLogin();
		} catch (error) {
			setIsLoading(false);
			console.error("Error adding user:", error?.response?.data);
			setError(error?.response?.data?.error);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleTogglePassword = () => {
		setShowPassword((prevShowPassword) => !prevShowPassword);
	};

	const SELECT_OPTIONS = [
		// {
		// 	name: "Type of Employment",
		// 	data: empTypes,
		// 	param_key: "employmentType",
		// 	param_value: formData?.employmentType,
		// 	handleChange,
		// 	setShowAdd: setShowAddEmpTypes,
		// 	showAdd: showAddEmpTypes,
		// 	placeholder: "Select employment type",
		// 	content: (
		// 		<EmploymentPanel
		// 			showAddEmpTypes={showAddEmpTypes}
		// 			setOptionDataRefresh={setOptionDataRefresh}
		// 			setShowAddEmpTypes={setShowAddEmpTypes}
		// 			companyName={formData?.company}
		// 		/>
		// 	),
		// },
		{
			name: "Type of Role",
			data: roles,
			param_key: "role",
			param_value: formData?.role,
			handleChange,
			setShowAdd: setShowAddRoles,
			showAdd: showAddRoles,
			placeholder: "Select role",
			content: (
				<RolesPanel
					showAddRoles={showAddRoles}
					setOptionDataRefresh={setDataRefresh}
					setShowAddRoles={setShowAddRoles}
					companyName={formData?.company}
				/>
			),
		},
		{
			name: "Type of Department",
			data: departments,
			param_key: "department",
			param_value: formData?.department,
			handleChange,
			setShowAdd: setShowAddDepartments,
			showAdd: showAddDepartments,
			placeholder: "Select department",
			content: (
				<DepartmentsPanel
					showAddDepartments={showAddDepartments}
					setOptionDataRefresh={setDataRefresh}
					setShowAddDepartments={setShowAddDepartments}
					companyName={formData?.company}
				/>
			),
			// content: <CompaniesPanel setOpenCompanyForm={true} />,
		},
		{
			name: "Type of Base module",
			data: modules,
			param_key: "baseModule",
			param_value: formData?.baseModule,
			handleChange,
			setShowAdd: setShowAddModules,
			showAdd: showAddModules,
			placeholder: "Select base module",
			content: (
				<BaseModulePanel
					showAddModules={showAddModules}
					setOptionDataRefresh={setDataRefresh}
					setShowAddModules={setShowAddModules}
					companyName={formData?.company}
				/>
			),
		},
		{
			name: "Manager",
			data: managers,
			param_key: "manager",
			param_value: formData?.manager,
			handleChange,
			setShowAdd: setShowAddManagers,
			showAdd: showAddManagers,
			placeholder: "Select manager",
			optionKey: "fullName",
		},
	];
	return (
		<Box overflow="auto" height={isModal ? "90vh" : "100vh"}>
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
						{!hideCompany && companies && (
							<FormControl>
								<FormLabel>Select Company</FormLabel>
								<Select
									name="company"
									value={formData?.company}
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
							valueText={formData?.companyId}
							handleChange={handleChange}
							placeholder="Company Id"
						/>
						<InputFormControl
							label={"First Name"}
							name="firstName"
							valueText={formData?.firstName}
							handleChange={handleChange}
							placeholder="First Name"
							required
						/>
						<InputFormControl
							label={"Middle Name"}
							name="middleName"
							valueText={formData?.middleName}
							handleChange={handleChange}
							placeholder="Middle Name"
						/>
						<InputFormControl
							label={"Last Name"}
							name="lastName"
							valueText={formData?.lastName}
							handleChange={handleChange}
							placeholder="Last Name"
						/>
						<InputFormControl
							label={"Email"}
							name="email"
							type="email"
							valueText={formData?.email}
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
									value={formData?.password}
									onChange={handleChange}
									placeholder="Enter password"
									required
								/>
								<InputRightElement>
									<Button size="sm" variant="unstyled" onClick={handleTogglePassword}>
										{showPassword ? <ViewOffIcon /> : <ViewIcon />}
									</Button>
								</InputRightElement>
							</InputGroup>
						</FormControl>
						<MultiSelectControl options={SELECT_OPTIONS} />
						<InputFormControl
							label={"Phone Number"}
							name="phoneNumber"
							valueText={formData?.phoneNumber}
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
									value={formData?.primaryAddress.streetNumber}
									onChange={(e) => {
										setFormData({
											...formData,
											primaryAddress: {
												...formData?.primaryAddress,
												streetNumber: e.target.value,
											},
										});
									}}
									placeholder="Street Number"
								/>

								<Input
									type="text"
									name="city"
									value={formData?.primaryAddress.city}
									onChange={(e) => {
										setFormData({
											...formData,
											primaryAddress: {
												...formData?.primaryAddress,
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
									value={formData?.primaryAddress.state}
									onChange={(e) => {
										setFormData({
											...formData,
											primaryAddress: {
												...formData?.primaryAddress,
												state: e.target.value,
											},
										});
									}}
									placeholder="State"
								/>
								<Input
									type="text"
									name="postalCode"
									value={formData?.primaryAddress.postalCode}
									onChange={(e) => {
										setFormData({
											...formData,
											primaryAddress: {
												...formData?.primaryAddress,
												postalCode: e.target.value,
											},
										});
									}}
									placeholder="Postal Code"
								/>
								<Input
									type="text"
									name="country"
									value={formData?.primaryAddress.country}
									onChange={(e) => {
										setFormData({
											...formData,
											primaryAddress: {
												...formData?.primaryAddress,
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
