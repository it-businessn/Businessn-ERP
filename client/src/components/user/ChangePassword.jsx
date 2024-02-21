import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
	Alert,
	AlertIcon,
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	Stack,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import * as api from "services";

const ChangePassword = ({
	setPasswordMode,
	userData,
	setUserData,
	setError,
	error,
}) => {
	const [showPassword, setShowPassword] = useState(false);

	const [passwordError, setPasswordError] = useState("");

	const [passwordData, setPasswordData] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	const handleTogglePassword = () => {
		setShowPassword((prevShowPassword) => !prevShowPassword);
	};

	const handlePasswordChange = (e) => {
		const { name, value } = e.target;
		setPasswordData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const validatePasswordMatch = () => {
		const { newPassword, confirmPassword } = passwordData;
		if (newPassword === confirmPassword) {
			setPasswordError("");
		} else {
			setPasswordError("Passwords do not match.");
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await api.updateUserPassword(passwordData, userData.id);
			setUserData(response.data.updatedUser);
			setPasswordMode(false);
		} catch (error) {
			console.error("Error changing password:", error?.response?.data);
			setError(error?.response?.data?.error);
		}
	};
	return (
		<Stack flex={1} p={"1em"} color="brand.logo_bg">
			<form onSubmit={handleSubmit}>
				<VStack align="center" justify="center" mb="4">
					<Box textAlign="center">
						<Text fontSize="xl" fontWeight="bold">
							Change Password
						</Text>
					</Box>
				</VStack>
				<FormControl mb={4}>
					<FormLabel>Current Password</FormLabel>

					<InputGroup>
						<Input
							type={showPassword ? "text" : "password"}
							name="currentPassword"
							value={passwordData.currentPassword}
							onChange={handlePasswordChange}
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
					<FormLabel>New Password</FormLabel>

					<InputGroup>
						<Input
							type={showPassword ? "text" : "password"}
							name="newPassword"
							value={passwordData.newPassword}
							onChange={handlePasswordChange}
							onBlur={validatePasswordMatch}
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
					<FormLabel>Confirm New Password</FormLabel>
					<InputGroup>
						<Input
							type={showPassword ? "text" : "password"}
							name="confirmPassword"
							value={passwordData.confirmPassword}
							onChange={handlePasswordChange}
							onBlur={validatePasswordMatch}
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
				<Button bg="brand.logo_bg" type="submit">
					Save
				</Button>
				{passwordError && (
					<Alert status="error" mt={4}>
						<AlertIcon />
						{passwordError}
					</Alert>
				)}
			</form>
		</Stack>
	);
};

export default ChangePassword;
