import { Box, Button, Flex, Spacer, Text } from "@chakra-ui/react";
import LinkButton from "components/ui/button/LinkButton";
import useCompanyEvents from "hooks/useCompanyEvents";
import moment from "moment";
import { useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getDefaultDateTime } from "utils";

const MiniCalendar = ({ user, company }) => {
	const localizer = momentLocalizer(moment);
	const events = useCompanyEvents(user, company);

	useEffect(() => {
		if (events) {
			events
				?.filter(
					(event) =>
						event.meetingAttendees.includes(user.fullName) ||
						event.createdBy === user?._id,
				)
				?.map((event) => {
					const fromDateTimeString = getDefaultDateTime(
						event.fromDate,
						event.fromTime,
					);
					const toDateTimeString = getDefaultDateTime(
						event.toDate,
						event.toTime,
					);

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
		}
	}, [events]);

	const handleDateSelect = (event) => {
		// setShowModal(true);
	};
	const navigate = useNavigate();
	const eventStyleGetter = (event) => {
		if (event.fromDate) {
			return {
				style: {
					backgroundColor: "blue",
					borderRadius: "0px",
					opacity: 1,
					color: "var(--primary_button_bg)",
					border: "none",
				},
			};
		}
		return {
			style: {
				backgroundColor: "red",
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
					color={"var(--main_color_black)"}
					size="sm"
					leftIcon={<FaCaretLeft onClick={goToBack} />}
					rightIcon={<FaCaretRight onClick={goToNext} />}
					borderRadius={"10px"}
					variant={"ghost"}
					_hover={{ color: "var(--main_color_black)", bg: "transparent" }}
				/>
			</Flex>
		);
	};
	return (
		events && (
			<Box
				p={3}
				bg={"var(--primary_bg)"}
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

				<LinkButton
					name="Go to calendar"
					onClick={() => navigate("/sales/calendar")}
				/>
			</Box>
		)
	);
};

export default MiniCalendar;
