import { Td, Tr } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import { getDefaultDate } from "utils";

const ExtraTimeEntry = ({
	name,
	approveStatus,
	dept,
	param_key,
	type,
	startTime,
	endTime,
	totalBreaks,
	totalHours,
	createdOn,
}) => {
	return (
		<Tr>
			<Td>
				<TextTitle title={name} />
			</Td>
			<Td>
				<TextTitle title={getDefaultDate(createdOn)} />
			</Td>
			<Td>{approveStatus}</Td>
			<Td>{dept}</Td>
			<Td>{param_key}</Td>
			<Td>{type}</Td>
			<Td>{startTime}</Td>
			<Td>{endTime}</Td>
			<Td>{totalBreaks}</Td>
			<Td>{totalHours}</Td>
			<Td />
		</Tr>
	);
};

export default ExtraTimeEntry;
