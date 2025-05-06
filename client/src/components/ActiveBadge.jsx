import { Badge } from "@chakra-ui/react";
import TextTitle from "./ui/text/TextTitle";

const ActiveBadge = ({ title, bg = "var(--correct_ans)" }) => (
	<Badge bg={bg} color="var(--primary_bg)">
		<TextTitle title={title} />
	</Badge>
);

export default ActiveBadge;
