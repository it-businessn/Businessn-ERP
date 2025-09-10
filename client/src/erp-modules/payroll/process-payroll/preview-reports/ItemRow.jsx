import { Td, Tr } from "@chakra-ui/react";
import NormalTextTitle from "components/ui/NormalTextTitle";

const ItemRow = ({
	title,
	rate,
	totalHours,
	currentTotal,
	YTDTotal,
	isEarning,
	YTDHoursTotal,
	isInfo,
	isTotals,
}) => {
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
						title={rate}
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
						title={totalHours}
					/>
				</Td>
			)}
			<Td w={"5em"} p={0}>
				<NormalTextTitle
					color="var(--main_color_black)"
					weight={isTotals && 700}
					title={currentTotal}
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
						title={YTDHoursTotal}
					/>
				</Td>
			)}
			<Td w={"5em"} p={0}>
				<NormalTextTitle
					color="var(--main_color_black)"
					weight={isTotals && 700}
					title={YTDTotal}
					size={"xs"}
					align={"right"}
				/>
			</Td>
		</Tr>
	);
};

export default ItemRow;
