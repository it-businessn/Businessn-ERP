import { Button } from "@chakra-ui/react";

const LeftIconButton = ({ handleClick, icon, name }) => {
	return (
		<Button
			size={"xs"}
			onClick={handleClick}
			color={"brand.100"}
			bg={"var(--primary_button_bg)"}
			variant={"outline"}
			fontWeight={"bold"}
			_hover={{ bg: "transparent", color: "brand.600" }}
			leftIcon={icon}
		>
			{name}
		</Button>
	);
};

export default LeftIconButton;
