import {
	Alert,
	AlertDescription,
	AlertIcon,
	Button,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Stack,
	Text,
} from "@chakra-ui/react";
import CenterBoxLayout from "layouts/CenterBoxLayout";
import { primaryButtonProps } from "layouts/PublicLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordService from "services/PasswordService";

// UI-01: same look as the sign-in page. The server always answers the same way
// (no hint whether the e-mail exists), so the page does too.
const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [sentMessage, setSentMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrorMessage("");
		setIsLoading(true);
		try {
			const { data } = await PasswordService.sendPassword({ email });
			setSentMessage(
				data?.message || "If an account exists for this e-mail, we have sent a link to reset your password.",
			);
		} catch (error) {
			setErrorMessage(error?.response?.data?.message || "We could not send the e-mail. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	if (sentMessage) {
		return (
			<CenterBoxLayout>
				<Stack spacing={3} textAlign="center">
					<Heading size={{ base: "xs", md: "sm" }}>Check your e-mail</Heading>
					<Text color="gray.600" fontSize="sm">
						{sentMessage}
					</Text>
					<Text color="gray.600" fontSize="sm">
						The link expires in 15 minutes. If you do not see the e-mail, check your spam folder.
					</Text>
				</Stack>
				<Button {...primaryButtonProps} onClick={() => navigate("/login")}>
					Back to sign in
				</Button>
			</CenterBoxLayout>
		);
	}

	return (
		<CenterBoxLayout>
			<Stack spacing={2} textAlign="center">
				<Heading size={{ base: "xs", md: "sm" }}>Forgot your password?</Heading>
				<Text color="gray.600" fontSize="sm">
					Enter the e-mail address for your account and we will send you a link to reset your
					password.
				</Text>
			</Stack>
			<form onSubmit={handleSubmit}>
				<Stack spacing={4}>
					<FormControl isRequired>
						<FormLabel>Email</FormLabel>
						<Input
							type="email"
							name="email"
							value={email}
							onChange={(e) => setEmail(e.target.value.trim())}
							autoComplete="email"
						/>
					</FormControl>
					<Button type="submit" isLoading={isLoading} {...primaryButtonProps}>
						Send reset link
					</Button>
				</Stack>
			</form>
			<Button variant="link" onClick={() => navigate("/login")}>
				Back to sign in
			</Button>
			{errorMessage && (
				<Alert status="error" borderRadius="md">
					<AlertIcon />
					<AlertDescription>{errorMessage}</AlertDescription>
				</Alert>
			)}
		</CenterBoxLayout>
	);
};
export default ForgotPassword;
