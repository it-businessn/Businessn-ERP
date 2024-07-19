import { Tbody } from "@chakra-ui/react";
import TableLayout from "components/ui/table/TableLayout";

const Timesheet = ({ cols, content }) => (
	<TableLayout isTimesheet cols={cols}>
		<Tbody>{content}</Tbody>
	</TableLayout>
);

export default Timesheet;
