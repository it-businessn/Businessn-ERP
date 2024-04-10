import { Box, Button, Flex, Spacer, Text } from "@chakra-ui/react";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MiniCalendar = () => {
	const navigate = useNavigate();
	const eventStyleGetter = () => ({
		style: {
			backgroundColor: "transparent",
			border: "none",
		},
	});
	const ScrollToolbar = (toolbar) => {
		const goToBack = () => {
			toolbar.onNavigate("PREV");
		};

		const goToNext = () => {
			toolbar.onNavigate("NEXT");
		};
		return (
			<Flex justifyContent="space-between">
				<Text fontWeight="bold">{toolbar.label}</Text>
				<Spacer />
				<Button
					p={0}
					color={"brand.600"}
					size="sm"
					leftIcon={<FaCaretLeft onClick={goToBack} />}
					rightIcon={<FaCaretRight onClick={goToNext} />}
					borderRadius={"10px"}
					variant={"ghost"}
					_hover={{ color: "brand.600", bg: "transparent" }}
				/>
			</Flex>
		);
	};
	const localizer = momentLocalizer(moment);

	const events = [
		{
			title: "Event 1",
			start: new Date(2024, 4, 10), // Year, Month (0-indexed), Day
			end: new Date(2024, 4, 12),
		},
		{
			title: "Event 2",
			start: new Date(2024, 4, 15),
			end: new Date(2024, 4, 18),
		},
		// Add more events as needed
	];
	return (
		<Box
			p={3}
			bg={"brand.primary_bg"}
			border="3px solid var(--main_color)"
			borderRadius="10px"
			fontWeight="bold"
		>
			<Calendar
				className="mini_cal"
				localizer={localizer}
				events={events}
				views={["month"]}
				startAccessor="start"
				endAccessor="end"
				style={{ height: 200 }}
				eventPropGetter={eventStyleGetter}
				components={{
					toolbar: ScrollToolbar,
				}}
			/>
			<Button
				variant="link"
				onClick={() => navigate("/sales/calendar")}
				colorScheme={"blue"}
			>
				Go to calendar
			</Button>
		</Box>
	);
};

export default MiniCalendar;
