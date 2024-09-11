import {
	Box,
	HStack,
	Popover,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
} from "@chakra-ui/react";
import FilterDatePicker from "components/FilterDateRangePicker";
import OutlineButton from "components/ui/button/OutlineButton";
import { getDefaultDateFormat } from "utils";

const DateFilterPopup = ({
	toggleDateFilter,
	showDateFilter,
	selectedFilter,
	setSelectedFilter,
	endDate,
	setEndDate,
	startDate,
	setStartDate,
	setFilter,
	closestRecord,
	lastRecord,
}) => {
	return (
		<Popover isOpen={showDateFilter} onClose={toggleDateFilter}>
			<PopoverTrigger>
				<HStack
					w={"30%"}
					bg={"var(--main_color)"}
					justifyContent={"space-between"}
					onClick={toggleDateFilter}
				>
					<Box
						cursor="pointer"
						w={"50%"}
						p={1.5}
						bg={"var(--primary_button_bg)"}
						color="var(--main_color)"
						borderRadius="md"
					>
						{selectedFilter}
					</Box>

					<OutlineButton
						label={getDefaultDateFormat(startDate)}
						color="var(--main_color_black)"
						borderColor={"var(--filter_border_color)"}
					/>
					<OutlineButton
						label={getDefaultDateFormat(endDate)}
						color="var(--main_color_black)"
						borderColor={"var(--filter_border_color)"}
					/>
				</HStack>
			</PopoverTrigger>
			<PopoverContent w="800px">
				<PopoverBody>
					<FilterDatePicker
						selectedFilter={selectedFilter}
						setSelectedFilter={setSelectedFilter}
						setFilter={setFilter}
						handleClose={toggleDateFilter}
						thisPayPeriod={closestRecord}
						lastPayPeriod={lastRecord}
						startDate={startDate}
						setStartDate={setStartDate}
						endDate={endDate}
						setEndDate={setEndDate}
					/>
				</PopoverBody>
			</PopoverContent>
		</Popover>
	);
};

export default DateFilterPopup;
