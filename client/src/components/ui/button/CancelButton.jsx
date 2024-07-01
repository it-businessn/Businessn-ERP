import { Button } from "@chakra-ui/react";

const CancelButton = ({ onClick, name }) => {
	return (
		<Button onClick={onClick} colorScheme="gray">
			{name || "Cancel"}
		</Button>
	);
};

export default CancelButton;
