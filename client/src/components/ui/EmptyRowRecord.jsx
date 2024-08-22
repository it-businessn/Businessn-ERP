import { Td, Tr } from "@chakra-ui/react";
import NormalTextTitle from "./NormalTextTitle";

const EmptyRowRecord = () => (
	<Tr>
		<Td>
			<NormalTextTitle title="No record found" />
		</Td>
	</Tr>
);

export default EmptyRowRecord;
