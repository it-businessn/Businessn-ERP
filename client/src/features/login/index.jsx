import { Flex, useColorModeValue as mode } from "@chakra-ui/react";
import LoginCover from "./LoginCover";
import SignInForm from "./SignInForm";

const Login = () => (
	<Flex
		minH={{
			base: "auto",
			md: "100vh",
		}}
		bgGradient={{
			md: mode(
				"linear(to-r, brand.600 50%, var(--main_color) 50%)",
				"linear(to-r, brand.600 50%, gray.900 50%)",
			),
		}}
	>
		<Flex width="full" color="brand.logo_bg">
			<LoginCover />
			<SignInForm title="Log in to your account" />
		</Flex>
	</Flex>
);
export default Login;
