import { Td, Tr } from "@chakra-ui/react";
import TextTitle from "./text/TextTitle";

const EmptyRowRecord = () => (
	<Tr>
		<Td>
			<TextTitle weight="normal" title="No record found" />
		</Td>
	</Tr>
);

export default EmptyRowRecord;
