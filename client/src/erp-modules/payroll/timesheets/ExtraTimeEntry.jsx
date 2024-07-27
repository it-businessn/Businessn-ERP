import { Td, Tr } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
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
	handleAdd,
}) => {
	return (
		<Tr>
			<Td>
				<TextTitle title={name} weight="normal" />
			</Td>
			<Td>{getDefaultDate(createdOn)}</Td>
			<Td>{approveStatus}</Td>
			<Td>{dept}</Td>
			<Td>{param_key}</Td>
			<Td>{type}</Td>
			<Td>{startTime}</Td>
			<Td>{endTime}</Td>
			<Td>{totalBreaks}</Td>
			<Td>{totalHours}</Td>
			<Td>
				<PrimaryButton
					size={"sm"}
					name={"Add request"}
					onOpen={() => handleAdd({ name, totalHours })}
				/>
			</Td>
		</Tr>
	);
};

export default ExtraTimeEntry;
