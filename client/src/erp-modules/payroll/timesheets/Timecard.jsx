import { Tbody } from "@chakra-ui/react";
import TableLayout from "components/ui/table/TableLayout";

const Timecard = ({ cols, content }) => (
	<TableLayout isTimesheet cols={cols}>
		<Tbody>{content}</Tbody>
	</TableLayout>
);

export default Timecard;
