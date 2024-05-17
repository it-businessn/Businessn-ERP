import { Box } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";

const Taskboard = () => {
	return (
		<Box p={{ base: "1em" }} overflow={"hidden"}>
			<TextTitle title={"Taskboard"} mb={"0.5em"} w={"50%"} />
		</Box>
	);
};

export default Taskboard;
