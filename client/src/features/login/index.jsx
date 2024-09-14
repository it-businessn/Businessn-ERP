import { Box } from "@chakra-ui/react";
import SignInForm from "./SignInForm";
import coverVideo from "../../assets/cover.mp4";
import { useEffect, useRef } from "react";

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
			>
				<source src={coverVideo} type="video/mp4" />
				Your browser does not support the video tag.
			</Box>

			<SignInForm title="Log in to your account" />
		</Box>
	);
};
export default Login;
