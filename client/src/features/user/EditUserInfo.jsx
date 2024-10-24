import {
	Alert,
	AlertIcon,
	Box,
	FormControl,
	FormLabel,
	HStack,
	Input,
	Select,
	Stack,
	VStack,
} from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import InputFormControl from "components/ui/form/InputFormControl";
// import MultiSelectFormControl from "components/ui/form/MultiSelectFormControl";
import TextTitle from "components/ui/text/TextTitle";
import { useSignup } from "hooks/useSignup";
import { useState } from "react";
import UserService from "services/UserService";
// import { isManager } from "utils";

const EditUserInfo = ({
	setEditMode,
	userData,
	setUserData,
	setError,
	error,
	company,
}) => {
	const { companies, roles, departments, managers } = useSignup();
	const [openAssigneeMenu, setOpenAssigneeMenu] = useState(false);
	// const assignedCompanies = userData?.companyId?.map(({ name }) => name);
	// const [selectedOptions, setSelectedOptions] = useState(assignedCompanies);

	const handleMenuToggle = () => {
		setOpenAssigneeMenu((prev) => !prev);
	};

	const handleSaveClick = async (e) => {
		e.preventDefault();
		try {
			userData.companies = userData.companyId;
			const response = await UserService.updateUserProfile(
				userData,
				userData._id,
			);
			setEditMode(false);
			setUserData(response.data);
			setError(null);
		} catch (error) {
			console.error("Error adding user:", error?.response?.data);
			setError(error?.response?.data?.message);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setUserData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleCloseMenu = (selectedOptions) => {
		setOpenAssigneeMenu(false);
		setUserData((prevTask) => ({
			...prevTask,
			companyId: selectedOptions,
		}));
	};

	return (
		<Stack flex={1} p={"1em"} color="var(--logo_bg)">
			<form onSubmit={handleSaveClick}>
				<VStack align="center" justify="center" mb="4">
					<Box textAlign="center">
						<TextTitle size="xl" title="Edit Profile Information" />
					</Box>
				</VStack>
				<HStack>
					<InputFormControl
						label={"First Name"}
						name="firstName"
						valueText={userData.firstName}
						handleChange={handleChange}
						placeholder="First Name"
					/>
					<InputFormControl
						label={"Middle Name"}
						name="middleName"
						valueText={userData.middleName}
						handleChange={handleChange}
						placeholder="Middle Name"
					/>
					<InputFormControl
						label={"Last Name"}
						name="lastName"
						valueText={userData.lastName}
						handleChange={handleChange}
						placeholder="Last Name"
					/>
				</HStack>
				<InputFormControl
					label={"Email"}
					name="email"
					type="email"
					valueText={userData.email}
					handleChange={handleChange}
					placeholder="Email"
				/>
				<InputFormControl
					label={"Phone Number"}
					name="phoneNumber"
					valueText={userData.phoneNumber}
					handleChange={handleChange}
					placeholder="Phone Number"
				/>
				<FormControl mb={4}>
					<FormLabel>Address</FormLabel>
					<HStack>
						<Input
							type="text"
							name="streetNumber"
							value={userData?.primaryAddress?.streetNumber}
							onChange={(e) => {
								setUserData({
									...userData,
									primaryAddress: {
										...userData.primaryAddress,
										streetNumber: e.target.value,
									},
								});
							}}
							placeholder="Street Number"
						/>

						<Input
							type="text"
							name="city"
							value={userData?.primaryAddress?.city}
							onChange={(e) => {
								setUserData({
									...userData,
									primaryAddress: {
										...userData.primaryAddress,
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
							value={userData?.primaryAddress?.state}
							onChange={(e) => {
								setUserData({
									...userData,
									primaryAddress: {
										...userData.primaryAddress,
										state: e.target.value,
									},
								});
							}}
							placeholder="State"
						/>
						<Input
							type="text"
							name="postalCode"
							value={userData?.primaryAddress?.postalCode}
							onChange={(e) => {
								setUserData({
									...userData,
									primaryAddress: {
										...userData.primaryAddress,
										postalCode: e.target.value,
									},
								});
							}}
							placeholder="Postal Code"
						/>
						<Input
							type="text"
							name="country"
							value={userData?.primaryAddress?.country}
							onChange={(e) => {
								setUserData({
									...userData,
									primaryAddress: {
										...userData.primaryAddress,
										country: e.target.value,
									},
								});
							}}
							placeholder="Country"
						/>
					</HStack>
				</FormControl>
				<HStack>
					{roles && (
						<FormControl mb={4}>
							<FormLabel>Type of Role</FormLabel>
							<Select
								name="role"
								value={userData?.role}
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
					)}
				</HStack>
				{managers && (
					<FormControl mb={4}>
						<FormLabel>Manager</FormLabel>
						<Select
							bg={"var(--main_color)"}
							name="manager"
							value={userData?.manager}
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
				<HStack>
					{/* {isManager(userData.role) && (
						<MultiSelectFormControl
							hideAvatar
							label={"Assign Companies"}
							tag={"companie(s)"}
							showMultiSelect={openAssigneeMenu}
							height="10vh"
							data={companies}
							handleCloseMenu={handleCloseMenu}
							selectedOptions={selectedOptions}
							setSelectedOptions={setSelectedOptions}
							handleMenuToggle={handleMenuToggle}
							list={userData?.companyId}
						/>
					)} */}

					{/* {departments && (
						<FormControl mb={4}>
							<FormLabel>Link Company</FormLabel>
							<Select
								bg={"var(--main_color)"}
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
					)} */}
				</HStack>
				<PrimaryButton name={"Save"} size={"sm"} />
				{error && (
					<Alert status="error" mt={4}>
						<AlertIcon />
						{error}
					</Alert>
				)}
			</form>
		</Stack>
	);
};

export default EditUserInfo;
