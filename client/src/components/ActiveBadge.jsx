import { Badge } from "@chakra-ui/react";
import TextTitle from "./ui/text/TextTitle";

const ActiveBadge = ({ title }) => (
	<Badge bg="var(--correct_ans)" color="var(--primary_bg)">
		<TextTitle title={title} />
	</Badge>
);

export default ActiveBadge;
