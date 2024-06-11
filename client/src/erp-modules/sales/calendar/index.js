import { Box, Button, Flex, HStack, Spacer } from "@chakra-ui/react";
import Loader from "components/Loader";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import moment from "moment";
import { useEffect, useState } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaCaretLeft, FaCaretRight, FaClock } from "react-icons/fa";
import { useBreakpointValue } from "services/Breakpoint";
import CalendarService from "services/CalendarService";
import LocalStorageService from "services/LocalStorageService";
import AddEvent from "./AddEvent";
import EventDetails from "./EventDetails";

const Calendar = () => {
	const { isMobile } = useBreakpointValue();
	const localizer = momentLocalizer(moment);
	const [events, setEvents] = useState(null);
	const [event, setEvent] = useState(null);
	const [showEditDetails, setShowEditDetails] = useState(false);

	const [isLoading, setIsLoading] = useState(false);
	const [isRefresh, setIsRefresh] = useState(false);
	const user = LocalStorageService.getItem("user").fullName;
	// const checkClassExists = () => {
	// 	const element = document.querySelector(".rbc-show-more");

	// 	if (element) {
	// 		element.style.display = "none";
	// 	} else {
	// 		setTimeout(checkClassExists, 1000);
	// 	}
	// };
	const [company, setCompany] = useState(
		LocalStorageService.getItem("selectedCompany"),
	);

	useEffect(() => {
		const handleSelectedCompanyChange = (event) => setCompany(event.detail);

		document.addEventListener(
			"selectedCompanyChanged",
			handleSelectedCompanyChange,
		);

		return () => {
			document.removeEventListener(
				"selectedCompanyChanged",
				handleSelectedCompanyChange,
			);
		};
	}, []);
	useEffect(() => {
		// checkClassExists();
		const fetchAllEvents = async () => {
			try {
				const response = await CalendarService.getCompEvents(company);
				response.data
					?.filter((event) => event.meetingAttendees.includes(user))
					.map((event) => {
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
				setIsLoading(false);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllEvents();
	}, [isRefresh, company]);

	const [showModal, setShowModal] = useState(false);
	const [showDetailsModal, setShowDetailsModal] = useState(false);
	const [position, setPosition] = useState({ top: 0, left: 0 });

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
			<Flex
				justifyContent="space-between"
				py={isMobile ? 1 : 4}
				flexDir={isMobile && "column"}
			>
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
						_hover={{ color: "brand.600", bg: "transparent" }}
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
		<Box
			color={event.color}
			bg={event.bgColor}
			pl={"10px"}
			borderLeft={`4px solid ${event.color}`}
		>
			<TextTitle title={event.title} size="xs" />
			<Button
				p={0}
				color={event.color}
				leftIcon={<FaClock />}
				size="xs"
				variant={"ghost"}
				_hover={{ color: "brand.600", bg: "transparent" }}
			>
				{moment(event.start).format("h:mm A")} -
				{moment(event.end).format("h:mm A")}
			</Button>
		</Box>
	);
	return (
		<Box p={{ base: "1em", md: "2em" }} mb={"1em"}>
			<TextTitle title="Calendar" mb={"0.5em"} />
			{!events && <Loader />}
			{events && (
				<Box
					px={{ base: "0", md: "1em" }}
					bg={"brand.primary_bg"}
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
						dayFormat={(date, culture, localizer) =>
							moment(date).format("D dd")
						}
						dayHeaderFormat={(date, culture, localizer) =>
							moment(date).format("D dddd")
						}
						views={["month"]}
						// views={["day", "week", "month", "agenda"]}
						style={{ minHeight: 750 }}
					/>
				</Box>
			)}
			<AddEvent
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
		</Box>
	);
};

export default Calendar;
