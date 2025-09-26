import { Box, Button, Flex, HStack, Spacer } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";

import useCompany from "hooks/useCompany";
import useGroup from "hooks/useGroup";
import PageLayout from "layouts/PageLayout";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaCaretLeft, FaCaretRight, FaClock } from "react-icons/fa";
import { useBreakpointValue } from "services/Breakpoint";
import CalendarService from "services/CalendarService";
import LocalStorageService from "services/LocalStorageService";
import { getDefaultDateTime, getTimezone } from "utils/convertDate";
import AddEvent from "./AddEvent";
import EventDetails from "./EventDetails";

const Calendar = () => {
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const loggedInUser = LocalStorageService.getItem("user");
	const { isMobile } = useBreakpointValue();
	const localizer = momentLocalizer(moment);
	const [events, setEvents] = useState(null);
	const [event, setEvent] = useState(null);

	const [showEditDetails, setShowEditDetails] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const groups = useGroup(company, false, showModal || showEditDetails);

	const [isLoading, setIsLoading] = useState(false);
	const [isRefresh, setIsRefresh] = useState(false);
	const [showDetailsModal, setShowDetailsModal] = useState(false);
	const [position, setPosition] = useState({ top: 0, left: 0 });

	// const checkClassExists = () => {
	// 	const element = document.querySelector(".rbc-show-more");

	// 	if (element) {
	// 		element.style.display = "none";
	// 	} else {
	// 		setTimeout(checkClassExists, 1000);
	// 	}
	// };

	useEffect(() => {
		// checkClassExists();
		const fetchAllEvents = async () => {
			try {
				const { data } = await CalendarService.getCompEvents({
					name: loggedInUser?.fullName,
					company,
				});
				data.map((event) => {
					event.fromDate = event.fromDate;
					event.toDate = event.toDate;
					const fromDateTimeString = getDefaultDateTime(event.fromDate, event.fromTime);
					const toDateTimeString = getDefaultDateTime(event.toDate, event.toTime);
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
				setEvents(data);
				setIsLoading(false);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllEvents();
	}, [isRefresh, company]);

	const handleDateSelect = (event) => {
		// setShowModal(true);
	};
	const handleEvent = (event) => {
		setEvent(event);
		// setPosition({
		// 	top: event.clientY,
		// 	left: event.clientX,
		// });
		setShowDetailsModal(true);
	};

	const eventStyleGetter = () => ({
		style: {
			backgroundColor: "transparent",
			border: "none",
		},
	});

	const defaultEvent = {
		title: "No events available",
		start: new Date(),
		end: new Date(),
		allDay: true,
	};
	const formatEventTime = (event) => {
		const startDate = moment(event.start).format("LT z");
		const endDate = moment(event.end).add(1, "hour").format("LT z");
		return `${startDate} - ${endDate}`;
	};

	const ScrollToolbar = (toolbar) => {
		const goToBack = () => {
			// checkClassExists();
			toolbar.onNavigate("PREV");
		};

		const goToNext = () => {
			// checkClassExists();
			toolbar.onNavigate("NEXT");
		};

		return (
			<Flex justifyContent="space-between" py={isMobile ? 1 : 4} flexDir={isMobile && "column"}>
				<TextTitle title={"All Events"} mb={isMobile && "0.5em"} />
				<Spacer />
				<HStack justifyContent={isMobile && "space-between"} spacing={"1em"}>
					<Button
						color={"var(--calendar_color)"}
						size="xs"
						leftIcon={<FaCaretLeft onClick={goToBack} />}
						rightIcon={<FaCaretRight onClick={goToNext} />}
						border={"2px solid var(--filter_border_color)"}
						borderRadius={"10px"}
						variant={"ghost"}
						_hover={{ color: "var(--main_color_black)", bg: "transparent" }}
					>
						{toolbar.label}
					</Button>
					<PrimaryButton
						size="xs"
						minW={"150px"}
						name={"Create Event"}
						isLoading={isLoading}
						loadingText="Loading"
						onOpen={() => setShowModal(true)}
					/>
				</HStack>
			</Flex>
		);
	};
	const customFormats = {
		monthHeaderFormat: (date) => moment(date).format("MMM YYYY"),
	};
	const CustomEvent = ({ event }) => (
		<Box color={event.color} bg={event.bgColor} pl={"10px"} borderLeft={`4px solid ${event.color}`}>
			<TextTitle title={event.title} size="xs" />
			<Button
				p={0}
				color={event.color}
				leftIcon={<FaClock />}
				size="xs"
				variant={"ghost"}
				_hover={{ color: "var(--main_color_black)", bg: "transparent" }}
			>
				{moment(event.start).format("h:mm A")} - {moment(event.end).format("h:mm A")}
			</Button>
		</Box>
	);
	return (
		<PageLayout title={"Calendar"}>
			{events && (
				<Box
					px={{ base: "0", md: "1em" }}
					bg={"var(--primary_bg)"}
					border="2px solid var(--main_color)"
					borderRadius="10px"
				>
					<BigCalendar
						localizer={localizer}
						events={events}
						startAccessor="start"
						endAccessor="end"
						selectable
						// onSelectSlot={handleDateSelect}
						onSelectEvent={handleEvent}
						eventPropGetter={eventStyleGetter}
						formats={customFormats}
						components={{
							event: CustomEvent,
							toolbar: ScrollToolbar,
						}}
						dayFormat={(date, culture, localizer) => moment(date).format("D dd")}
						dayHeaderFormat={(date, culture, localizer) => moment(date).format("D dddd")}
						views={["month"]}
						// views={["day", "week", "month", "agenda"]}
						style={{ minHeight: 750 }}
					/>
				</Box>
			)}
			<AddEvent
				user={loggedInUser}
				isEdit={showEditDetails}
				setIsRefresh={setIsRefresh}
				isLoading={isLoading}
				setIsLoading={setIsLoading}
				event={event}
				isOpen={showModal || showEditDetails}
				onClose={() => {
					setShowEditDetails(false);
					setShowModal(false);
					setEvent(null);
				}}
				company={company}
				groups={groups}
			/>
			{showDetailsModal && (
				<EventDetails
					setShowEditDetails={setShowEditDetails}
					isOpen={showDetailsModal}
					position={position}
					onClose={() => setShowDetailsModal(false)}
					event={event}
				/>
			)}
		</PageLayout>
	);
};

export default Calendar;
