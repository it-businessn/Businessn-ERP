import { Box, Button, Flex, Image } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
// trimmed wordmarks (the original logo files have wide empty margins)
import logoDark from "../assets/logos/businessn-dark.png";
import logoWhite from "../assets/logos/businessn-white.png";

/**
 * UI-01: one look for every page shown before sign-in (sign in, forgot
 * password, contact us / support, sign-up, verify e-mail, 404), matching the
 * sign-in page: light background, the purple top bar with the BusinessN logo,
 * content in a white card. server/views/layout.ejs (set / reset password,
 * rendered by the server) copies these values.
 */
export const PUBLIC_THEME = {
	pageBg: "var(--primary_bg)",
	barBg: "var(--banner_bg)",
	cardBg: "var(--main_color)",
	cardRadius: "20px",
	cardShadow: "xl",
};

/** The purple primary button used on every public page. */
export const primaryButtonProps = {
	bg: "var(--banner_bg)",
	color: "white",
	_hover: { bg: "#4a2b4a" },
	_active: { bg: "#2c182c" },
};

/** The top bar: logo on the left, one link on the right (Contact us or Sign in). */
export const PublicNavbar = ({ action = "contact" }) => {
	const navigate = useNavigate();
	const link =
		action === "signin"
			? { label: "Sign in", to: "/login" }
			: action === "contact"
				? { label: "Contact us", to: "/support" }
				: null;
	return (
		<Box as="nav" px={{ base: 3, md: 5 }} pt={{ base: 3, md: 3 }}>
			<Flex
				bg={PUBLIC_THEME.barBg}
				borderRadius="10px"
				h={{ base: "56px", md: "74px" }}
				px={{ base: 4, md: 8 }}
				align="center"
				justify="space-between"
			>
				<Link to="/login" aria-label="BusinessN home">
					<Image src={logoWhite} alt="BusinessN" h={{ base: "22px", md: "28px" }} objectFit="contain" />
				</Link>
				{link && (
					<Button size="sm" variant="ghost" color="white" _hover={{ bg: "whiteAlpha.200" }} onClick={() => navigate(link.to)}>
						{link.label}
					</Button>
				)}
			</Flex>
		</Box>
	);
};

const WIDTHS = { sm: "md", md: "lg", lg: "4xl", xl: "6xl" };

/** The white card the page content sits in, with the dark logo on top for forms. */
export const PublicCard = ({ size = "sm", showLogo = true, children, ...rest }) => (
	<Box
		bg={PUBLIC_THEME.cardBg}
		borderRadius={PUBLIC_THEME.cardRadius}
		boxShadow={PUBLIC_THEME.cardShadow}
		w="100%"
		maxW={WIDTHS[size] || size}
		mx="auto"
		px={{ base: 5, md: 8 }}
		py={{ base: 6, md: 8 }}
		{...rest}
	>
		{showLogo && (
			<Flex justify="center" mb={4}>
				<Image src={logoDark} alt="BusinessN" h="32px" objectFit="contain" />
			</Flex>
		)}
		{children}
	</Box>
);

/**
 * A public page: background, top bar and the content centred below it.
 * `card` wraps the content in PublicCard (size sm for forms, lg/xl for wide
 * forms); pass card={false} when the page lays out its own card.
 */
const PublicLayout = ({ action = "contact", card = true, size = "sm", showLogo = true, children }) => (
	<Box minH="100vh" bg={PUBLIC_THEME.pageBg} display="flex" flexDirection="column">
		<PublicNavbar action={action} />
		<Flex flex="1" align={{ base: "start", md: "center" }} justify="center" px={{ base: 3, md: 6 }} py={{ base: 6, md: 10 }}>
			{card ? (
				<PublicCard size={size} showLogo={showLogo}>
					{children}
				</PublicCard>
			) : (
				<Box w="100%">{children}</Box>
			)}
		</Flex>
	</Box>
);

export default PublicLayout;
