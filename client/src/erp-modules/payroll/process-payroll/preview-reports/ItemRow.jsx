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
	isInfo,
	isNetSummary,
}) => {
	const isTotals =
		(!isNetSummary && SUM_TOTALS.find((_) => title.includes(_))) ||
		(isNetSummary && SUM_TOTALS.find((_) => title.includes("Net Pay")));

	return (
		<Tr bg={isTotals && "var(--main_color)"}>
			<Td w={"9em"} p={0}>
				<NormalTextTitle
					whiteSpace={"wrap"}
					weight={isTotals && 700}
					title={title}
					size={"xs"}
				/>
			</Td>
			{!isInfo && (
				<Td p={0}>
					<NormalTextTitle
						size={"xs"}
						align="center"
						visibility={rate === 0 && "hidden"}
						title={`$${rate}`}
					/>
				</Td>
			)}
			{!isInfo && (
				<Td p={0}>
					<NormalTextTitle
						size={"xs"}
						align="center"
						visibility={!isEarning && totalHours === 0 && "hidden"}
						title={totalHours}
					/>
				</Td>
			)}
			<Td w={"5em"} p={0}>
				<NormalTextTitle
					weight={isTotals && 700}
					title={getAmount(currentTotal)}
					size={"xs"}
					align={"center"}
				/>
			</Td>

			{!isInfo && (
				<Td p={0} pl={"1em"}>
					<NormalTextTitle
						size={"xs"}
						align="center"
						visibility={
							(isTotals || (!isEarning && totalHours === 0)) && "hidden"
						}
						title={YTDHoursTotal}
					/>
				</Td>
			)}
			<Td w={"5em"} p={0}>
				<NormalTextTitle
					weight={isTotals && 700}
					title={getAmount(YTDTotal)}
					size={"xs"}
					align={"center"}
				/>
			</Td>
		</Tr>
	);
};

export default ItemRow;
