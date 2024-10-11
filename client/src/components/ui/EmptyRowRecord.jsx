import { Td, Tr } from "@chakra-ui/react";
import NormalTextTitle from "./NormalTextTitle";

const EmptyRowRecord = ({ title = "No record found" }) => (
	<Tr>
		<Td>
			<NormalTextTitle title={title} />
		</Td>
	</Tr>
);

export default EmptyRowRecord;
