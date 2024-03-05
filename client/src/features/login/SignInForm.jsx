import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
	Alert,
	AlertIcon,
	Button,
	Center,
	FormControl,
	FormLabel,
	Heading,
	Input,
	InputGroup,
	InputRightElement,
	Stack,
} from "@chakra-ui/react";
import { useLogin } from "hooks/useLogin";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBreakpointValue } from "services/Breakpoint";
import Logo from "../../components/logo";

const SignInForm = ({ title }) => {
	const { isMobile } = useBreakpointValue();

	// const [isLoading, setIsLoading] = useState(false);

	const [error, setError] = useState(null);
	const { login, isLoading, errorMessage } = useLogin();
	const defaultFormData = {
		email: "",
		password: "",
	};
	const [formData, setFormData] = useState(defaultFormData);

	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			await login(formData);
			resetForm();
		} catch (error) {
			console.log(error);
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
		<Center flex="1">
			<Stack
				spacing="8"
				px={{
					base: "4",
					md: "8",
				}}
				py={{
					base: "12",
					md: "48",
				}}
				width="full"
				maxW="sm"
			>
				<Stack spacing="6">
					{isMobile && <Logo />}
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
							<Button
								isLoading={isLoading}
								type="submit"
								bg="brand.logo_bg"
								_hover={{ color: "brand.nav_color" }}
							>
								Login
							</Button>
						</Stack>
					</form>
					{error && (
						<Alert status="error" mt={4}>
							<AlertIcon />
							{error}
						</Alert>
					)}
				</Stack>
			</Stack>
		</Center>
	);
};
export default SignInForm;
