import { Td, Tr } from "@chakra-ui/react";
import NormalTextTitle from "components/ui/NormalTextTitle";
import { getAmount } from "utils";
import { SUM_TOTALS } from "./data";

const ItemRow = ({
	title,
	rate,
	totalHours,
	currentTotal,
	YTDTotal,
	w = "3em",
	isEarning,
	YTDHoursTotal,
}) => {
	const isTotals = SUM_TOTALS.find((_) => title.includes(_));

	return (
		<Tr bg={isTotals && "var(--main_color)"}>
			<Td w={"15em"}>
				<NormalTextTitle
					whiteSpace="wrap"
					weight={isTotals && 600}
					title={title}
					size={"xs"}
				/>
			</Td>
			<Td w={"3em"}>
				<NormalTextTitle
					align="center"
					visibility={rate === 0 && "hidden"}
					title={`$${rate}`}
				/>
			</Td>
			<Td w={w}>
				<NormalTextTitle
					align="center"
					visibility={!isEarning && totalHours === 0 && "hidden"}
					title={totalHours}
				/>
			</Td>
			<Td w={"10em"}>
				<NormalTextTitle
					align="center"
					weight={isTotals && 600}
					title={getAmount(currentTotal)}
				/>
			</Td>

			<Td w={"10em"}>
				<NormalTextTitle
					align="center"
					visibility={
						(isTotals || (!isEarning && totalHours === 0)) && "hidden"
					}
					title={YTDHoursTotal}
				/>
			</Td>
			<Td w={"10em"}>
				<NormalTextTitle
					align="center"
					weight={isTotals && 600}
					title={getAmount(YTDTotal)}
				/>
			</Td>
		</Tr>
	);
};

export default ItemRow;
