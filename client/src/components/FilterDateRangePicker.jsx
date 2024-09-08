import { Box, HStack, List, ListItem } from "@chakra-ui/react";
import { endOfDay, startOfDay, subDays } from "date-fns";
import { useEffect, useState } from "react";
import { MdOutlineChevronRight } from "react-icons/md";
import DateRange from "./ui/datepicker/DateRange";
import ActionButtonGroup from "./ui/form/ActionButtonGroup";
import NormalTextTitle from "./ui/NormalTextTitle";

const FilterDatePicker = ({
	setFilter,
	handleClose,
	thisPayPeriod,
	lastPayPeriod,
}) => {
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	const [selected, setSelected] = useState("Today");

	const handleFilter = () => {
		setFilter({ startDate, endDate });
		handleClose();
	};
	const setToday = () => {
		const today = new Date();
		setStartDate(startOfDay(today));
		setEndDate(endOfDay(today));
	};

	const setYesterday = () => {
		const yesterday = subDays(new Date(), 1);
		setStartDate(startOfDay(yesterday));
		setEndDate(endOfDay(yesterday));
	};
	const setLast7Days = () => {
		const today = new Date();
		setStartDate(subDays(today, 7));
		setEndDate(endOfDay(today));
	};
	const setLast30Days = () => {
		const today = new Date();
		setStartDate(subDays(today, 30));
		setEndDate(endOfDay(today));
	};
	const setThisPayPeriod = () => {
		setStartDate(startOfDay(thisPayPeriod?.payPeriodStartDate));
		setEndDate(endOfDay(thisPayPeriod?.payPeriodEndDate));
	};
	const setLastPayPeriod = () => {
		setStartDate(startOfDay(lastPayPeriod?.payPeriodStartDate));
		setEndDate(endOfDay(lastPayPeriod?.payPeriodEndDate));
	};

	const FILTER_GROUP = [
		{ name: "Today", call: setToday },
		{ name: "Yesterday", call: setYesterday },
		{ name: "Last pay period", call: setLastPayPeriod },
		{ name: "This pay period", call: setThisPayPeriod },
		{ name: "Last 7 Days", call: setLast7Days },
		{ name: "Last 30 Days", call: setLast30Days },
	];

	useEffect(() => {
		FILTER_GROUP.find(({ name }) => name === selected).call();
	}, [selected]);

	return (
		<Box h={"300px"} overflowY={"auto"}>
			<HStack spacing={4} alignItems={"start"} justifyContent={"space-between"}>
				<List w={"30%"} spacing={1} h={"250px"} overflowY={"auto"}>
					{FILTER_GROUP.map(({ name }) => (
						<ListItem
							size={"sm"}
							key={name}
							onClick={() => setSelected(name)}
							cursor="pointer"
							bg={selected === name ? "var(--primary_button_bg)" : "gray.100"}
							color={selected === name ? "var(--primary_bg)" : "black"}
							p={1}
							borderRadius="md"
							_hover={{ bg: "blue.100" }}
						>
							<NormalTextTitle title={name} />
						</ListItem>
					))}
				</List>
				<HStack>
					<DateRange
						selected={startDate}
						startDate={startDate}
						onChange={(date) => setStartDate(date)}
						selectsStart
					/>
					<MdOutlineChevronRight />
					<DateRange
						selected={endDate}
						endDate={endDate}
						onChange={(date) => setEndDate(date)}
						selectsEnd
						minDate={startDate}
					/>
				</HStack>
			</HStack>
			<ActionButtonGroup
				submitBtnName={"Apply"}
				onClose={handleClose}
				onOpen={handleFilter}
			/>
		</Box>
	);
};

export default FilterDatePicker;
