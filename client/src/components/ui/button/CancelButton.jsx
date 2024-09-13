import { Button } from "@chakra-ui/react";

const CancelButton = ({ onClick, name, size, isDisabled }) => {
	return (
		<Button
			onClick={onClick}
			colorScheme="gray"
			size={size}
			isDisabled={isDisabled}
		>
			{name || "Cancel"}
		</Button>
	);
};

export default CancelButton;
