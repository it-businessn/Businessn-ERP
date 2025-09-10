import { Td, Tr } from "@chakra-ui/react";
import NormalTextTitle from "components/ui/NormalTextTitle";
import { roundUpNumber } from "utils/convertAmt";
import { SUM_TOTALS } from "./data";

const ItemRow = ({
	title,
	rate,
	totalHours,
	currentTotal,
	YTDTotal,
	isEarning,
	YTDHoursTotal,
	isInfo,
	isNetSummary,
}) => {
	const isTotals =
		(!isNetSummary && SUM_TOTALS.find((_) => title.includes(_))) ||
		(isNetSummary && title.includes("Net Pay")) ||
		title.includes("Gross Earnings") ||
		title.includes("Total Deductions");

	return (
		<Tr bg={isTotals && "var(--main_color)"}>
			<Td w={"9em"} p={0}>
				<NormalTextTitle
					color="var(--main_color_black)"
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
						color="var(--main_color_black)"
						align={"right"}
						visibility={rate === 0 && "hidden"}
						title={roundUpNumber(rate)}
					/>
				</Td>
			)}
			{!isInfo && (
				<Td p={0}>
					<NormalTextTitle
						size={"xs"}
						color="var(--main_color_black)"
						align={"right"}
						visibility={!isEarning && totalHours === 0 && "hidden"}
						title={totalHours?.toFixed(2)}
					/>
				</Td>
			)}
			<Td w={"5em"} p={0}>
				<NormalTextTitle
					color="var(--main_color_black)"
					weight={isTotals && 700}
					title={roundUpNumber(currentTotal)}
					size={"xs"}
					align={"right"}
					visibility={title === "Available Balance" && "hidden"}
				/>
			</Td>

			{!isInfo && (
				<Td p={0} pl={"1em"}>
					<NormalTextTitle
						color="var(--main_color_black)"
						size={"xs"}
						align={"right"}
						visibility={(isTotals || (!isEarning && totalHours === 0)) && "hidden"}
						title={YTDHoursTotal?.toFixed(2)}
					/>
				</Td>
			)}
			<Td w={"5em"} p={0}>
				<NormalTextTitle
					color="var(--main_color_black)"
					weight={isTotals && 700}
					title={roundUpNumber(YTDTotal)}
					size={"xs"}
					align={"right"}
				/>
			</Td>
		</Tr>
	);
};

export default ItemRow;
