import { Box, Button, Flex, Spacer, Text } from "@chakra-ui/react";
import LinkButton from "components/ui/button/LinkButton";
import moment from "moment";
import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CalendarService from "services/CalendarService";

const MiniCalendar = ({ user, company }) => {
	const navigate = useNavigate();
	const eventStyleGetter = (event) => {
		if (event.fromDate) {
			return {
				style: {
					backgroundColor: "var(--primary_button_bg)",
					borderRadius: "0px",
					opacity: 1,
					color: "var(--primary_button_bg)",
					border: "none",
				},
			};
		}
		return {
			style: {
				backgroundColor: "transparent",
				border: "none",
			},
		};
	};

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
	const [events, setEvents] = useState(null);

	useEffect(() => {
		const fetchAllEvents = async () => {
			try {
				const response = await CalendarService.getCompEvents(company);
				response.data
					?.filter((event) => event.meetingAttendees.includes(user))
					?.map((event) => {
						const fromDateTimeString = `${event.fromDate.split("T")[0]}T${
							event.fromTime
						}`;
						const toDateTimeString = `${event.toDate.split("T")[0]}T${
							event.toTime
						}`;

						event.title = event.description;
						event.start = fromDateTimeString;
						event.end = toDateTimeString;
						event.color =
							event.eventType === "phoneCall"
								? "var(--status_button_border)"
								: event.eventType === "meeting"
								? "var(--primary_button_bg)"
								: "var(--event_color)";
						event.bgColor =
							event.eventType === "phoneCall"
								? "var(--phoneCall_bg_light)"
								: event.eventType === "meeting"
								? "var(--meeting_bg_light)"
								: "var(--event_bg_light)";
						return event;
					});
				setEvents(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllEvents();
	}, [user, company]);
	const handleDateSelect = (event) => {
		// setShowModal(true);
	};
	return (
		<Box
			p={3}
			bg={"brand.primary_bg"}
			border="3px solid var(--main_color)"
			borderRadius="10px"
			fontWeight="bold"
		>
			{events && (
				<Calendar
					className="mini_cal"
					localizer={localizer}
					events={events}
					views={["month"]}
					startAccessor="start"
					endAccessor="end"
					selectable={false}
					style={{ height: 200 }}
					// onSelectSlot={handleDateSelect}
					onSelectEvent={handleDateSelect}
					eventPropGetter={eventStyleGetter}
					components={{
						toolbar: ScrollToolbar,
					}}
					defaultDate={moment().toDate()}
					value={["3", "10", "20"]}
				/>
			)}
			<LinkButton
				name="Go to calendar"
				onClick={() => navigate("/sales/calendar")}
			/>
		</Box>
	);
};

export default MiniCalendar;
