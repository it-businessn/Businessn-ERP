import { Collapse, HStack, Icon } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import TextTitle from "components/ui/text/TextTitle";
import { FaSortDown, FaSortUp } from "react-icons/fa6";

const PayrollStageStep = ({ onClick, isOpen, title, content }) => (
	<BoxCard>
		<HStack spacing={2} align={"center"} onClick={onClick}>
			{isOpen ? (
				<Icon as={FaSortDown} boxSize="5" color="fg.muted" />
			) : (
				<Icon as={FaSortUp} boxSize="5" color="fg.muted" />
			)}

			<TextTitle mt={1} weight="normal" title={title} />
		</HStack>
		<Collapse in={isOpen}>{content}</Collapse>
	</BoxCard>
);
export default PayrollStageStep;
