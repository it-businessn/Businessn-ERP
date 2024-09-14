import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
	Alert,
	AlertIcon,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	InputGroup,
	InputRightElement,
	Stack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBreakpointValue } from "services/Breakpoint";
import LoginService from "services/LoginService";
import { buildUserInfo, storeUser } from "utils/common";
import Logo from "../../components/logo";

const SignInForm = ({ title }) => {
	const { isMobile } = useBreakpointValue();

	const [isLoading, setIsLoading] = useState(false);

	const [error, setError] = useState(null);
	const defaultFormData = {
		email: "",
		password: "",
	};
	const [formData, setFormData] = useState(defaultFormData);

	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();
	const [forgotPassword, setForgotPassword] = useState(false);

	useEffect(() => {
		if (forgotPassword) {
			navigate("/forgot-password");
		}
	}, [forgotPassword]);

	const showForgotPasswordPage = () => {
		setForgotPassword(true);
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const res = await LoginService.signIn(formData);
			const user = buildUserInfo(res.data.user);
			storeUser(user);
			resetForm();
		} catch (error) {
			setError(error.response.data.error);
		} finally {
			setIsLoading(false);
		}
	};

	const resetForm = () => {
		setFormData(defaultFormData);
		navigate("/");
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleTogglePassword = () => {
		setShowPassword((prevShowPassword) => !prevShowPassword);
	};

	return (
		<Stack
			m={"auto"}
			position="relative"
			spacing="8"
			p={"1em 2em"}
			mt={"20vh"}
			width="lg"
			bg="whiteAlpha.900"
			boxShadow="xl"
			justifyContent={"center"}
			borderRadius={"20px"}
		>
			<Stack spacing={0}>
				{isMobile ? (
					<Logo />
				) : (
					<Flex h="24" m={"0 auto"}>
						<Logo isCover isForgotPassword />
					</Flex>
				)}
				<Stack
					spacing={{
						base: "2",
						md: "3",
					}}
					textAlign="center"
				>
					<Heading
						size={{
							base: "xs",
							md: "sm",
						}}
					>
						{title}
					</Heading>
				</Stack>
			</Stack>
			<Stack spacing="5">
				<form onSubmit={handleLogin}>
					<Stack spacing={4}>
						<FormControl>
							<FormLabel>Email</FormLabel>
							<Input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								required
							/>
						</FormControl>

						<FormControl>
							<FormLabel>Password</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? "text" : "password"}
									name="password"
									value={formData.password}
									onChange={handleChange}
									required
								/>
								<InputRightElement>
									<Button
										size="sm"
										variant="unstyled"
										onClick={handleTogglePassword}
										aria-label="Toggle Password Visibility"
									>
										{showPassword ? <ViewOffIcon /> : <ViewIcon />}
									</Button>
								</InputRightElement>
							</InputGroup>
						</FormControl>
						<Button isLoading={isLoading} type="submit" bg="var(--logo_bg)">
							Login
						</Button>
					</Stack>
				</form>
				<Button
					variant={"link"}
					textDecor={"underline"}
					onClick={showForgotPasswordPage}
				>
					Forgot Password
				</Button>
				{error && (
					<Alert status="error" mt={4}>
						<AlertIcon />
						{error}
					</Alert>
				)}
			</Stack>
		</Stack>
	);
};
export default SignInForm;
