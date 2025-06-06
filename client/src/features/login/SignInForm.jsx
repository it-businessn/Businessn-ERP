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
import LoginService from "services/LoginService";
import { buildUserInfo, storeUser } from "utils/common";
import logoImg from "../../assets/logos/BusinessN_lightLogo1.png";
import Logo from "../../components/logo";

const SignInForm = ({ title, isMobile }) => {
	const [isLoading, setIsLoading] = useState(false);

	const [error, setError] = useState(null);
	const defaultFormData = {
		email: "",
		password: "",
		companyId: "",
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
			const { user, existingCompanyUser, accessToken, refreshToken } = res.data;
			sessionStorage.setItem("accessToken", accessToken);
			localStorage.setItem("refreshToken", refreshToken);

			user.companyId = existingCompanyUser;

			const userInfo = buildUserInfo(user);
			storeUser(userInfo);

			resetForm();
		} catch (error) {
			setError(error?.response?.data?.error);
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
		setFormData((prevData) => ({ ...prevData, [name]: value.trim() }));
	};

	const handleTogglePassword = () => {
		setShowPassword((prevShowPassword) => !prevShowPassword);
	};

	return (
		<Stack
			m={"auto"}
			position="relative"
			spacing="8"
			p={isMobile ? "2em" : "1em 2em"}
			mt={isMobile ? "50%" : "20vh"}
			width={isMobile ? "90vw" : "md"}
			bg="var(--main_color)"
			boxShadow="xl"
			justifyContent={"center"}
			borderRadius={"20px"}
		>
			<Stack spacing={0}>
				{isMobile ? (
					<Logo />
				) : (
					<Flex h="20" m={"0 auto"}>
						<Logo isFullLogo logoImgSrc={logoImg} />
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
							<FormLabel>Company ID</FormLabel>
							<Input
								name="companyId"
								value={formData?.companyId}
								onChange={handleChange}
								required
							/>
						</FormControl>
						<FormControl>
							<FormLabel>Email</FormLabel>
							<Input
								type="email"
								name="email"
								value={formData?.email}
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
									value={formData?.password}
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
						{/* //checkbox rememberme */}
						<Button isLoading={isLoading} type="submit" bg="var(--banner_bg)">
							Login
						</Button>
					</Stack>
				</form>
				<Button variant={"link"} onClick={showForgotPasswordPage}>
					Forgot Password?
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
