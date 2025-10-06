import { HStack, Icon } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import { addDays, format } from "date-fns";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";

export const WeekFilter = ({ weekStart, setWeekStart }) => {
	const handleChangeDate = (direction) => {
		setWeekStart((prev) => (direction === "prev" ? addDays(prev, -7) : addDays(prev, 7)));
	};
	return (
		<HStack spacing={0}>
			<Icon
				cursor="pointer"
				as={MdOutlineChevronLeft}
				onClick={() => handleChangeDate("prev")}
				boxSize="5"
				color="fg.muted"
			/>
			<TextTitle
				size="md"
				title={`
						${format(weekStart, "MMM d")} - ${format(addDays(weekStart, 6), "MMM d")}`}
			/>
			<Icon
				cursor="pointer"
				as={MdOutlineChevronRight}
				onClick={() => handleChangeDate("next")}
				boxSize="5"
				color="fg.muted"
			/>
		</HStack>
	);
};
