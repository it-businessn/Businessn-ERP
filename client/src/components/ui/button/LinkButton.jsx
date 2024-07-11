import { Button } from "@chakra-ui/react";

const LinkButton = ({ name, onClick, fontSize, textDecor, flex, p }) => {
	return (
		<Button
			flex={flex}
			p={p}
			fontSize={fontSize}
			textDecor={textDecor}
			color={"var(--primary_button_bg)"}
			onClick={onClick}
			variant={"link"}
		>
			{name}
		</Button>
	);
};

export default LinkButton;
