import { Box } from "@chakra-ui/react";
import { PUBLIC_THEME, PublicNavbar } from "layouts/PublicLayout";
import { useEffect } from "react";
import { useBreakpointValue } from "services/Breakpoint";
import CirclePattern from "./CirclePattern";
import SignInForm from "./SignInForm";

// UI-01: the reference look for every public page (layouts/PublicLayout).
const Login = () => {
	const { isMobile } = useBreakpointValue();

	useEffect(() => {
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker.getRegistrations().then((regs) => {
				regs.forEach((reg) => reg.unregister());
			});
		}
	}, []);
	return (
		<Box position="relative" minH="100vh" width="100%" overflow="hidden" bg={PUBLIC_THEME.pageBg}>
			<Box position="relative" zIndex="1">
				<PublicNavbar action="contact" />
			</Box>
			{!isMobile && (
				<Box position="absolute" top="0" left="0" width="50%" height="100%" px="10em">
					<CirclePattern />
				</Box>
			)}
			<SignInForm title="Sign in to your account" isMobile={isMobile} />
		</Box>
	);
};
export default Login;
