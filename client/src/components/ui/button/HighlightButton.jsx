import { Button } from "@chakra-ui/react";
import RightIconButton from "./RightIconButton";

const HighlightButton = ({ name, onClick }) => {
	return (
		<Button
			variant="solid"
			bgGradient="linear-gradient(58deg, rgb(115 70 236) 0%, rgb(136 107 217) 43%, rgb(50 240 218) 100%)"
			bgClip="text"
			fontSize={"sm"}
			size={"xxs"}
			_hover={{
				bgGradient:
					"linear-gradient(58deg, rgb(115 70 236) 0%, rgb(136 107 217) 43%, rgb(50 240 218) 100%)",
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
