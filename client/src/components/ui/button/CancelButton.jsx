import { Button } from "@chakra-ui/react";

const CancelButton = ({ onClick, name, size }) => {
	return (
		<Button onClick={onClick} colorScheme="gray" size={size}>
			{name || "Cancel"}
		</Button>
	);
};

export default CancelButton;
