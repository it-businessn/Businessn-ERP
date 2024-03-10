import { Box, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useBreakpointValue } from "services/Breakpoint";
import logoImg from "../../assets/logos/logo.png";

const Logo = ({ src }) => {
	const { isMobile } = useBreakpointValue();

	const linkStyle = isMobile ? { display: "inline-flex", width: "25px" } : {};
	const imageHeight = src ? (isMobile ? "200%" : "50px") : "50px";
	const imageWidth = src ? (isMobile ? "200%" : "50px") : "50px";
	const imageMarginLeft = src ? (isMobile ? "3em" : "6.5em") : "auto";
	const imageMarginTop = src ? (isMobile ? "-2em" : "-4.5em") : "auto";

	return (
		<Box>
			<Link to="/" style={linkStyle}>
				<Image
					height={imageHeight}
					width={imageWidth}
					ml={imageMarginLeft}
					mt={imageMarginTop}
					objectFit="contain"
					src={src || logoImg}
					alt="Company logo"
				/>
			</Link>
		</Box>
	);
};

export default Logo;
