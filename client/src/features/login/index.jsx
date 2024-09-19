import { Box, Flex } from "@chakra-ui/react";
import Logo from "components/logo";
import { useEffect, useRef } from "react";
import coverVideo from "../../assets/cover.mp4";
import logoImg from "../../assets/logos/logoCover.jpg";
import SignInForm from "./SignInForm";

const Login = () => {
	const videoRef = useRef(null);

	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.playbackRate = 0.5; //  0.5x speed (slower)
		}
	}, []);
	return (
		<Box position="relative" height="100vh" width="100vw" overflow="hidden">
			<Box
				as="nav"
				bg="var(--logo_bg)"
				p={3}
				position="absolute"
				top={0}
				width="100%"
				zIndex="5"
			>
				<Flex h="auto" m={"0 auto"}>
					<Logo isFullLogo logoImgSrc={logoImg} width="150px" />
				</Flex>
			</Box>
			<Box
				as="video"
				loop
				muted
				autoPlay
				ref={videoRef}
				position="absolute"
				top="0"
				left="0"
				width="100%"
				height="100%"
				objectFit="cover"
				zIndex="0"
				filter="brightness(0.8)"
			>
				<source src={coverVideo} type="video/mp4" />
				Your browser does not support the video tag.
			</Box>

			<SignInForm title="Login to your account" logoImgSrc={logoImg} />
		</Box>
	);
};
export default Login;
