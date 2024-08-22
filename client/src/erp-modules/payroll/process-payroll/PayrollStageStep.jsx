import { Collapse, HStack, Icon } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import NormalTextTitle from "components/ui/NormalTextTitle";
import { FaSortDown, FaSortUp } from "react-icons/fa6";

const PayrollStageStep = ({ onClick, isOpen, title, content }) => (
	<BoxCard>
		<HStack spacing={2} align={"center"} onClick={onClick}>
			{isOpen ? (
				<Icon as={FaSortDown} boxSize="5" color="fg.muted" />
			) : (
				<Icon as={FaSortUp} boxSize="5" color="fg.muted" />
			)}

			<NormalTextTitle mt={1} title={title} />
		</HStack>
		<Collapse in={isOpen}>{content}</Collapse>
	</BoxCard>
);
export default PayrollStageStep;
