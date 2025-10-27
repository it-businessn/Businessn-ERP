import { Box, Collapse, HStack, Icon } from "@chakra-ui/react";
import NormalTextTitle from "components/ui/NormalTextTitle";
import { FaSortDown, FaSortUp } from "react-icons/fa6";

const PayrollStageStep = ({ onClick, isOpen, title, content }) => (
	<Box p="1em" bg="var(--primary_bg)">
		<HStack spacing={2} alignItems={"center"} onClick={onClick}>
			{isOpen ? (
				<Icon as={FaSortDown} boxSize="5" color="fg.muted" />
			) : (
				<Icon as={FaSortUp} boxSize="5" color="fg.muted" />
			)}

			<NormalTextTitle title={title} />
		</HStack>
		<Collapse in={isOpen}>{content}</Collapse>
	</Box>
);

export default PayrollStageStep;
