import { Button } from "@chakra-ui/react";

const ActionButton = ({ name, isLoading, onClick, px, mt, isDisabled = false, size, leftIcon }) => {
	return (
		<Button
			size={size}
			isDisabled={isDisabled}
			isLoading={isLoading}
			onClick={onClick}
			bg={"var(--banner_bg)"}
			mt={mt}
			px={{ base: px ? px : "2em" }}
			color={"var(--main_color)"}
			_hover={{ bg: "var(--primary_btn_hover)" }}
			type="submit"
			borderRadius={"var(--radius)"}
			leftIcon={leftIcon}
		>
			{name}
		</Button>
	);
};

export default ActionButton;
