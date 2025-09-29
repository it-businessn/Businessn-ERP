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
	VStack,
} from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import { useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import PasswordService from "services/PasswordService";

const ChangePassword = ({ setPasswordMode, setError, error }) => {
	const [showPassword, setShowPassword] = useState(false);
	const [userData, setUserData] = useState(LocalStorageService.getItem("user"));

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
			const { data } = await PasswordService.updateUserPassword(passwordData, userData._id);
			setUserData(data.result);
			setPasswordMode(false);
		} catch (error) {
			console.error("Error changing password:", error?.response?.data);
			setError(error?.response?.data?.message);
		}
	};
	return (
		<Stack flex={1} p={"1em"} color="var(--logo_bg)">
			<form onSubmit={handleSubmit}>
				<VStack align="center" justify="center" mb="4">
					<Box textAlign="center">
						<TextTitle size="xl" title="Change Password" />
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
							<Button size="sm" variant="unstyled" onClick={handleTogglePassword}>
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
							// onBlur={validatePasswordMatch}
						/>
						<InputRightElement>
							<Button size="sm" variant="unstyled" onClick={handleTogglePassword}>
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
							<Button size="sm" variant="unstyled" onClick={handleTogglePassword}>
								{showPassword ? <ViewOffIcon /> : <ViewIcon />}
							</Button>
						</InputRightElement>
					</InputGroup>
				</FormControl>
				<PrimaryButton name={"Save"} size={"sm"} />
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
