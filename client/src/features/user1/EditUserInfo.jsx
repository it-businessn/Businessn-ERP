import {
	Alert,
	AlertIcon,
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	Stack,
	Text,
	VStack,
} from "@chakra-ui/react";
import UserService from "services/UserService";

const EditUserInfo = ({
	setEditMode,
	userData,
	setUserData,
	setError,
	error,
}) => {
	const handleSaveClick = async (e) => {
		e.preventDefault();
		try {
			const response = await UserService.updateUserProfile(
				userData,
				userData._id,
			);
			setEditMode(false);
			setUserData(response.data);
		} catch (error) {
			console.error("Error adding user:", error?.response?.data);
			setError(error?.response?.data?.error);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setUserData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};
	return (
		<Stack flex={1} p={"1em"} color="brand.logo_bg">
			<form onSubmit={handleSaveClick}>
				<VStack align="center" justify="center" mb="4">
					<Box textAlign="center">
						<Text fontSize="xl" fontWeight="bold">
							Edit Profile Information
						</Text>
					</Box>
				</VStack>
				<FormControl mb={4}>
					<FormLabel>First Name</FormLabel>
					<Input
						type="text"
						name="firstName"
						value={userData?.firstName}
						onChange={handleChange}
						placeholder="First Name"
					/>
				</FormControl>
				<FormControl mb={4}>
					<FormLabel>Middle Name</FormLabel>
					<Input
						type="text"
						name="lastName"
						value={userData?.middleName}
						onChange={handleChange}
						placeholder="Last Name"
					/>
				</FormControl>
				<FormControl mb={4}>
					<FormLabel>Last Name</FormLabel>
					<Input
						type="text"
						name="lastName"
						value={userData?.lastName}
						onChange={handleChange}
						placeholder="Last Name"
					/>
				</FormControl>
				<FormControl mb={4}>
					<FormLabel>Email</FormLabel>
					<Input
						type="email"
						name="email"
						value={userData?.email}
						onChange={handleChange}
						placeholder="Email"
					/>
				</FormControl>
				<FormControl mb={4}>
					<FormLabel>Phone Number</FormLabel>
					<Input
						type="text"
						name="phoneNumber"
						value={userData?.phoneNumber}
						onChange={handleChange}
						placeholder="phone"
					/>
				</FormControl>
				<FormControl mb={4}>
					<FormLabel>Address</FormLabel>
					<Input
						type="text"
						name="address"
						value={userData?.address}
						onChange={handleChange}
						placeholder="Primary Contact"
					/>
				</FormControl>
				<Button bg="brand.logo_bg" type="submit">
					Save
				</Button>
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
