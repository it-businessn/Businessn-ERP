import { Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useBreakpointValue } from "services/Breakpoint";
import logoImg from "../../assets/logos/logo_white.png";
import signInLogoImg from "../../assets/logos/logoCover.jpg";

const Logo = ({
	src,
	isCover,
	isForgotPassword,
	isFullLogo,
	logoImgSrc = logoImg,
	width,
	pl,
	ml,
}) => {
	const { isMobile } = useBreakpointValue();

	const linkStyle = isMobile ? { display: "inline-flex", width: "25px" } : {};
	const imageHeight = src ? (isMobile ? "200%" : "50px") : "50px";
	const imageWidth = src ? (isMobile ? "200%" : "50px") : "50px";
	const imageMarginLeft = src ? (isMobile ? "3em" : "6.5em") : "auto";
	const imageMarginTop = src ? (isMobile ? "-2em" : "-4.5em") : "auto";

	return isFullLogo ? (
		<Link to="/">
			<Image ml={ml} pl={pl} objectFit="cover" src={logoImgSrc} alt="Company logo" width={width} />
		</Link>
	) : (
		(!isMobile || isForgotPassword) && (
			<Link to="/" style={linkStyle}>
				<Image
					height={imageHeight}
					width={isCover ? "50%" : imageWidth}
					ml={isCover || src ? "0%" : imageMarginLeft}
					mt={src ? 0 : imageMarginTop}
					m={isForgotPassword && "0 auto"}
					objectFit="contain"
					src={isCover ? signInLogoImg : src ? src : logoImgSrc}
					alt="Company logo"
				/>
			</Link>
		)
	);
};

export default Logo;
