import { Box, Button, Flex, HStack } from "@chakra-ui/react";
import Logo from "components/logo";
import { useEffect, useRef, useState } from "react";
import { useBreakpointValue } from "services/Breakpoint";
import logoImg from "../../assets/logos/BusinessN_dark1.png";
import CirclePattern from "./CirclePattern";
import ContactForm from "./ContactForm";
import SignInForm from "./SignInForm";
const Login = () => {
	const videoRef = useRef(null);
	const { isMobile } = useBreakpointValue();
	const [showContactForm, setShowContactForm] = useState(false);

	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.playbackRate = 0.5; //  0.5x speed (slower)
		}
	}, []);
	return (
		<Box position="relative" height="100vh" width="100vw" overflow="hidden">
			{isMobile ? (
				<Box as="nav" bg="var(--banner_bg)" position="absolute" p={3} width="100%" zIndex="1">
					<Flex h="50" align={"center"} justify={"space-between"} ml={3} px={8}>
						<Logo isFullLogo logoImgSrc={logoImg} width="250px" />
					</Flex>
				</Box>
			) : (
				<Box
					as="nav"
					bg="var(--banner_bg)"
					position="absolute"
					top={3}
					left={5}
					p={3}
					width="98%"
					zIndex="1"
					borderRadius="10px"
				>
					<Flex h="50" align={"center"} justify={"space-between"} ml={3} px={8}>
						<Logo isFullLogo logoImgSrc={logoImg} width="500px" ml={"-110px"} />
						<HStack spacing={0} justifyContent={"start"}>
							<Button alignItems={"end"} onClick={() => setShowContactForm(true)}>
								Contact us
							</Button>
							<Button alignItems={"end"}>English</Button>
						</HStack>
					</Flex>
				</Box>
			)}
			<Box
				// as="video"
				// loop
				// muted
				// autoPlay
				// ref={videoRef}
				position="absolute"
				top="0"
				left="0"
				width="50%"
				height="100%"
				px="10em"
				// objectFit="cover"
				// zIndex="0"
				// filter="grayscale(0.9)"
			>
				<CirclePattern />
				{/* <source src={coverVideo} type="video/mp4" />
				Your browser does not support the video tag. */}
			</Box>
			{showContactForm && (
				<ContactForm
					showContactForm={showContactForm}
					setShowContactForm={setShowContactForm}
					handleClose={() => setShowContactForm(false)}
				/>
			)}
			<SignInForm title="Login to your account" logoImgSrc={logoImg} isMobile={isMobile} />
		</Box>
	);
};
export default Login;
