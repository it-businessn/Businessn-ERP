import { HStack, Input } from "@chakra-ui/react";
import "daterangepicker/daterangepicker";
import "daterangepicker/daterangepicker.css";
import $ from "jquery";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { getDefaultDate, getMomentDate } from "utils/convertDate";

const DateFilterPopup = ({
	toggleDateFilter,
	// setSelectedFilter,
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
				startDate: getMomentDate(closestRecord?.payPeriodStartDate),
				endDate: getMomentDate(closestRecord?.payPeriodEndDate),
				locale: {
					format: "YYYY/MM/DD",
				},
				ranges: {
					Today: [moment.utc(), moment.utc()],
					Yesterday: [moment.utc().subtract(1, "days"), moment.utc().subtract(1, "days")],
					"Last pay period": [
						getMomentDate(lastRecord?.payPeriodStartDate),
						getMomentDate(lastRecord?.payPeriodEndDate),
					],
					"This pay period": [
						getMomentDate(closestRecord?.payPeriodStartDate),
						getMomentDate(closestRecord?.payPeriodEndDate),
					],
					"Last 7 Days": [moment.utc().subtract(6, "days"), moment.utc()],
					"Last 30 Days": [moment.utc().subtract(29, "days"), moment.utc()],
					"This Year": [moment.utc().startOf("year"), moment.utc().endOf("year")],
					"Last Year": [
						moment.utc().subtract(1, "year").startOf("year"),
						moment.utc().subtract(1, "year").endOf("year"),
					],
				},
			},
			(start, end, label) => {
				setStartDate(getDefaultDate(start));
				setEndDate(getDefaultDate(end));
				// setSelectedFilter(label);
			},
		);
		return () => {
			$(inputRef?.current).data("daterangepicker")?.remove();
		};
	}, [selectedDateRange, closestRecord]);

	return (
		<HStack
			w={"30%"}
			justifyContent={"space-between"}
			onClick={() => {
				handleDateRangeChange();
				toggleDateFilter();
			}}
		>
			<Input cursor="pointer" id="date-range" type="text" ref={inputRef} className="form-control" />
		</HStack>
	);
};

export default DateFilterPopup;
