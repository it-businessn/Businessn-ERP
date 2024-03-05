import { Box, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useBreakpointValue } from "services/Breakpoint";
import logoImg from "../../assets/logos/logo.png";

const Logo = ({ src }) => {
	const { isMobile } = useBreakpointValue();
	return (
		<Box>
			<Link
				to="/"
				style={isMobile ? { display: "inline-flex", width: "25px" } : {}}
			>
				<Image
					height={src ? (isMobile ? "200%" : "auto") : "50px"}
					width={src ? (isMobile ? "200%" : "auto") : "50px"}
					ml={src ? (isMobile ? "3em" : "6.5em") : "auto"}
					mt={src ? (isMobile ? "-2em" : "-4.5em") : "auto"}
					objectFit={"contain"}
					src={src ? src : logoImg}
					alt="Company logo"
				/>
			</Link>
		</Box>
	);
};

export default Logo;
