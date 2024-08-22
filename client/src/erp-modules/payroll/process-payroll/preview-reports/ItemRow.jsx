import { Td, Tr } from "@chakra-ui/react";
import NormalTextTitle from "components/ui/NormalTextTitle";
import { getAmount } from "utils";

const ItemRow = ({
	title,
	rate,
	totalHours,
	currentTotal,
	YTDTotal,
	w = "3em",
	isEarning,
	YTDHoursTotal,
}) => (
	<Tr>
		<Td w={"10em"}>
			<NormalTextTitle title={title} />
		</Td>
		<Td w={"3em"}>
			<NormalTextTitle visibility={rate === 0 && "hidden"} title={`$${rate}`} />
		</Td>
		<Td w={w}>
			<NormalTextTitle
				visibility={!isEarning && totalHours === 0 && "hidden"}
				title={totalHours}
			/>
		</Td>
		<Td w={"10em"}>
			<NormalTextTitle title={getAmount(currentTotal)} />
		</Td>

		<Td w={"10em"}>
			<NormalTextTitle title={YTDHoursTotal} />
		</Td>
		<Td w={"10em"}>
			<NormalTextTitle title={getAmount(YTDTotal)} />
		</Td>
	</Tr>
);

export default ItemRow;
