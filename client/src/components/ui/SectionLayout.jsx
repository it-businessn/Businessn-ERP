import { Box } from "@chakra-ui/react";
import TextTitle from "./text/TextTitle";

const SectionLayout = ({ title, children, hasSubHeader }) => {
	return (
		<Box
			p={{ base: "1em", md: "2em" }}
			pt={{ base: "4em", md: "auto" }}
			overflow={"hidden"}
		>
			<TextTitle title={title} mb={"0.5em"} />
			{hasSubHeader}
			<Box
				p="1em"
				bg={"brand.primary_bg"}
				border="2px solid var(--main_color)"
				borderRadius="10px"
				color={"brand.nav_color"}
			>
				{children}
			</Box>
		</Box>
	);
};

export default SectionLayout;
