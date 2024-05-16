import { Button } from "@chakra-ui/react";

const CancelButton = ({ onClick }) => {
	return (
		<Button onClick={onClick} colorScheme="gray">
			Cancel
		</Button>
	);
};

export default CancelButton;
