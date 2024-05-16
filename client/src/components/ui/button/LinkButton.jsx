import { Button } from "@chakra-ui/react";

const LinkButton = ({ name, onClick, fontSize }) => {
	return (
		<Button
			fontSize={fontSize}
			color={"brand.primary_button_bg"}
			onClick={onClick}
			variant={"link"}
		>
			{name}
		</Button>
	);
};

export default LinkButton;
