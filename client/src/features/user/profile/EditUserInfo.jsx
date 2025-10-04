import {
	Alert,
	AlertIcon,
	Box,
	FormControl,
	FormLabel,
	HStack,
	Select,
	Stack,
	VStack,
} from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import InputFormControl from "components/ui/form/InputFormControl";
import MultiSelectFormControl from "components/ui/form/MultiSelectFormControl";
// import MultiSelectFormControl from "components/ui/form/MultiSelectFormControl";
import TextTitle from "components/ui/text/TextTitle";
import { COUNTRIES } from "erp-modules/payroll/onboard-user/customInfo";
import useCompanies from "hooks/useCompanies";
import useDepartment from "hooks/useDepartment";
import useRoles from "hooks/useRoles";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import UserService from "services/UserService";
import { isShadowUser } from "utils";

const EditUserInfo = ({ setEditMode, setError, error, company }) => {
	const loggedInUser = LocalStorageService.getItem("user");
	const departments = useDepartment(company);
	const allCompanies = useCompanies();
	const roles = useRoles(company);
	const shadowUser = isShadowUser(loggedInUser?.role);

	const [companies, setCompanies] = useState(company);
	const [userData, setUserData] = useState(loggedInUser);
	const [availableProvinces, setAvailableProvinces] = useState([]);
	const [openAssigneeMenu, setOpenAssigneeMenu] = useState(false);

	useEffect(() => {
		if (allCompanies) {
			const assignedCompanies = allCompanies
				?.filter((comp) => comp.employees.includes(userData._id))
				?.map(({ name }) => name);
			setCompanies(assignedCompanies);
		}
	}, [allCompanies]);

	useEffect(() => {
		const selectedCountry = COUNTRIES.find(
			({ code }) => code === userData?.primaryAddress?.country,
		);
		if (selectedCountry) {
			setAvailableProvinces(selectedCountry?.provinces);
		}
	}, [userData?.primaryAddress?.country]);

	const handleMenuToggle = () => {
		setOpenAssigneeMenu((prev) => !prev);
	};

	const handleSaveClick = async (e) => {
		e.preventDefault();
		try {
			userData.assignedCompanies = userData.companyId;
			if (userData.assignedCompanies.length > 0) {
				const unassignedCompanies = allCompanies
					.filter(({ name }) => !userData.companyId.includes(name))
					?.map((_) => _._id);
				userData.unassignedCompanies = unassignedCompanies;
			}
			const { data } = await UserService.updateUserProfile(userData, userData._id);
			setEditMode(false);
			setUserData(data);
			setError(null);
		} catch (error) {
			console.error("Error adding user:", error?.response?.data);
			setError(error?.response?.data?.message);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (value)
			setUserData((prevData) => ({
				...prevData,
				[name]: value,
			}));
	};

	const handleAddressChange = (e) => {
		const { name, value } = e.target;
		if (value)
			setUserData({
				...userData,
				primaryAddress: {
					...userData.primaryAddress,
					[name]: value,
				},
			});
	};

	const handleCloseMenu = (selectedOptions) => {
		setOpenAssigneeMenu(false);
		setUserData((prevTask) => ({
			...prevTask,
			companyId: selectedOptions,
		}));
	};

	return (
		<Stack flex={1} p={"1em"} color="var(--logo_bg)" height={"calc(100vh - 190px)"}>
			<form onSubmit={handleSaveClick}>
				<VStack align="center" justify="center" mb="4">
					<Box textAlign="center">
						<TextTitle size="xl" title="Edit Profile Information" />
					</Box>
				</VStack>
				<Stack spacing={2}>
					<HStack>
						<InputFormControl
							label={"First Name"}
							name="firstName"
							valueText={userData.firstName || ""}
							handleChange={handleChange}
							placeholder="First Name"
						/>
						<InputFormControl
							label={"Middle Name"}
							name="middleName"
							valueText={userData.middleName || ""}
							handleChange={handleChange}
							placeholder="Middle Name"
						/>
						<InputFormControl
							label={"Last Name"}
							name="lastName"
							valueText={userData.lastName || ""}
							handleChange={handleChange}
							placeholder="Last Name"
						/>
					</HStack>
					<HStack>
						<InputFormControl
							label={"Email"}
							name="email"
							type="email"
							valueText={userData.email || ""}
							handleChange={handleChange}
							placeholder="Email"
						/>
						<InputFormControl
							label={"Phone Number"}
							name="phoneNumber"
							type="tel"
							valueText={userData.phoneNumber || ""}
							handleChange={handleChange}
							placeholder="Phone Number"
						/>
					</HStack>
					<FormControl mb={4}>
						<TextTitle size="lg" title={"Address"} />
						<HStack>
							<InputFormControl
								label={"Street Number"}
								name="streetNumber"
								valueText={userData?.primaryAddress?.streetNumber || ""}
								handleChange={handleAddressChange}
								placeholder="Street Number"
							/>
							<InputFormControl
								label="City"
								name="city"
								valueText={userData?.primaryAddress?.city || ""}
								handleChange={handleAddressChange}
								placeholder="City"
							/>
							<InputFormControl
								label="Postal Code"
								name="postalCode"
								valueText={userData?.primaryAddress?.postalCode || ""}
								handleChange={handleAddressChange}
								placeholder="Postal Code"
							/>
						</HStack>
						<HStack mt={2}>
							<FormControl>
								<FormLabel size="sm">Country</FormLabel>
								<Select
									size={"sm"}
									name="country"
									value={userData?.primaryAddress?.country}
									onChange={handleAddressChange}
									placeholder="Select Country"
								>
									{COUNTRIES.map(({ type, code }) => (
										<option key={type} value={code}>
											{type}
										</option>
									))}
								</Select>
							</FormControl>
							<FormControl>
								<FormLabel size="sm">Province / State</FormLabel>
								<Select
									size={"sm"}
									name="state"
									value={userData?.primaryAddress?.state || ""}
									onChange={handleAddressChange}
									placeholder="Select Province"
								>
									{availableProvinces.map(({ name, id }) => (
										<option key={name} value={id}>
											{name}
										</option>
									))}
								</Select>
							</FormControl>
						</HStack>
					</FormControl>
					{shadowUser && (
						<HStack>
							{roles && (
								<FormControl mb={4}>
									<FormLabel>Type of Role</FormLabel>
									<Select
										size={"sm"}
										name="role"
										value={userData?.role || ""}
										bg="var(--main_color)"
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
										size={"sm"}
										bg="var(--main_color)"
										name="department"
										value={userData?.department || ""}
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
						</HStack>
					)}
					<HStack>
						{shadowUser && (
							<MultiSelectFormControl
								hideAvatar
								label="Assign Companies"
								tag="selected"
								titleLabelText="Companies"
								showMultiSelect={openAssigneeMenu}
								height="30vh"
								data={allCompanies}
								handleCloseMenu={handleCloseMenu}
								selectedOptions={companies}
								setSelectedOptions={setCompanies}
								handleMenuToggle={handleMenuToggle}
								list={userData?.companyId}
							/>
						)}

						{/* {departments && (
						<FormControl mb={4}>
							<FormLabel>Link Company</FormLabel>
							<Select
								bg="var(--main_color)"
								name="department"
								value={userData?.department}
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
					)} */}
						{/* {empTypes && (
						<FormControl mb={4}>
							<FormLabel>Type of Employment</FormLabel>
							<Select
								name="employmentType"
								value={userData?.employmentType}
								bg="var(--main_color)"
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
					)} */}
					</HStack>
					<PrimaryButton hover="none" name="Save" size="sm" w={"100px"} />
					{error && (
						<Alert status="error" mt={4}>
							<AlertIcon />
							{error}
						</Alert>
					)}
				</Stack>
			</form>
		</Stack>
	);
};

export default EditUserInfo;
