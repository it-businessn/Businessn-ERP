import { Box, HStack, Input } from "@chakra-ui/react";
import "daterangepicker/daterangepicker";
import "daterangepicker/daterangepicker.css";
import $ from "jquery";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { getDefaultDate } from "utils";

const DateFilterPopup = ({
	toggleDateFilter,
	selectedFilter,
	setSelectedFilter,
	setEndDate,
	setStartDate,
	closestRecord,
	lastRecord,
}) => {
	const inputRef = useRef(null);
	const [selectedDateRange, setSelectedDateRange] = useState(null);

	const handleDateRangeChange = (range) => setSelectedDateRange(range);

	useEffect(() => {
		$(inputRef.current).daterangepicker(
			{
				alwaysShowCalendars: true,
				startDate: moment(),
				endDate: moment(),
				locale: {
					format: "YYYY/MM/DD",
				},
				ranges: {
					Today: [moment(), moment()],
					Yesterday: [
						moment().subtract(1, "days"),
						moment().subtract(1, "days"),
					],
					"Last pay period": [
						moment(lastRecord?.payPeriodStartDate),
						moment(lastRecord?.payPeriodEndDate),
					],
					"This pay period": [
						moment(closestRecord?.payPeriodStartDate),
						moment(closestRecord?.payPeriodEndDate),
					],
					"Last 7 Days": [moment().subtract(6, "days"), moment()],
					"Last 30 Days": [moment().subtract(29, "days"), moment()],
					"This Year": [moment().startOf("year"), moment().endOf("year")],
					"Last Year": [
						moment().subtract(1, "year").startOf("year"),
						moment().subtract(1, "year").endOf("year"),
					],
				},
			},
			(start, end, label) => {
				setStartDate(getDefaultDate(start));
				setEndDate(getDefaultDate(end));
				setSelectedFilter(label);
			},
		);
		return () => {
			$(inputRef?.current).data("daterangepicker")?.remove();
		};
	}, [selectedDateRange]);

	return (
		<HStack
			w={"30%"}
			justifyContent={"space-between"}
			onClick={() => {
				handleDateRangeChange();
				toggleDateFilter();
			}}
		>
			<Box
				cursor="default"
				w={"50%"}
				p={1.5}
				bg={"var(--primary_button_bg)"}
				color="var(--main_color)"
				borderRadius="md"
			>
				{selectedFilter}
			</Box>
			<Input
				cursor="pointer"
				id="date-range"
				type="text"
				ref={inputRef}
				className="form-control"
			/>
		</HStack>
	);
};

export default DateFilterPopup;
