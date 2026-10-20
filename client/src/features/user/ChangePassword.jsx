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
import { useRef, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import PasswordService from "services/PasswordService";

const ChangePassword = ({ setPasswordMode, setError, error }) => {
	const [showPassword, setShowPassword] = useState(false);
	const [userData] = useState(LocalStorageService.getItem("user"));

	const [passwordError, setPasswordError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	// Ref mirrors isSubmitting synchronously so two clicks in the same tick cannot
	// both pass the guard before React re-renders (REV-010).
	const submittingRef = useRef(false);
	const [successMessage, setSuccessMessage] = useState("");

	const MIN_PASSWORD_LENGTH = 8;

	const validateForm = ({ currentPassword, newPassword, confirmPassword }) => {
		if (!currentPassword) return "Current password is required.";
		if (!newPassword || newPassword.trim().length === 0) return "New password is required.";
		if (newPassword.length < MIN_PASSWORD_LENGTH)
			return `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
		if (newPassword !== confirmPassword) return "Passwords do not match.";
		if (newPassword === currentPassword) return "New password must differ from the current password.";
		return "";
	};

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
		if (isSubmitting || submittingRef.current) return;

		// FIX (AUD-018): validate before calling the API; previously an empty or
		// mismatched password was submitted and the response was misread.
		const validationError = validateForm(passwordData);
		if (validationError) {
			setPasswordError(validationError);
			return;
		}
		setPasswordError("");
		setError?.("");
		submittingRef.current = true;
		setIsSubmitting(true);
		try {
			const { data } = await PasswordService.updateUserPassword(passwordData, userData?._id);
			setSuccessMessage(data?.message || "Password changed successfully.");
			setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
			setPasswordMode(false);
		} catch (error) {
			console.error("Error changing password:", error?.response?.data);
			const message =
				error?.response?.data?.message ||
				(error?.response ? "Could not change password. Please try again." : "Unable to reach the server.");
			setPasswordError(message);
			setError?.(message);
		} finally {
			submittingRef.current = false;
			setIsSubmitting(false);
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
				<PrimaryButton name={isSubmitting ? "Saving..." : "Save"} size={"sm"} isDisabled={isSubmitting} />
				{successMessage && (
					<Alert status="success" mt={4} role="status">
						<AlertIcon />
						{successMessage}
					</Alert>
				)}
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
