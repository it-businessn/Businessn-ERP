import { Button } from "@chakra-ui/react";
import RightIconButton from "./RightIconButton";

const HighlightButton = ({ name, onClick }) => {
	return (
		<Button
			variant="solid"
			bgGradient="var(--highlight_gradient)"
			bgClip="text"
			fontSize={"sm"}
			size={"xxs"}
			_hover={{
				bgGradient: "var(--highlight_gradient)",
				bgClip: "text",
			}}
			onClick={onClick}
		>
			{name}
			<RightIconButton />
		</Button>
	);
};

export default HighlightButton;
