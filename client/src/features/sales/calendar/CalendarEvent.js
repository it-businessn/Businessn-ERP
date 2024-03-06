import {
	Box,
	Button,
	ButtonGroup,
	Center,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Radio,
	RadioGroup,
	Select,
	Stack,
	Textarea,
} from "@chakra-ui/react";
import Loader from "features/Loader";
import moment from "moment";
import { useEffect, useState } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import CalendarService from "services/CalendarService";

const localizer = momentLocalizer(moment);

const Calendar = () => {
	const [events, setEvents] = useState({
		title: "",
		start: moment().toDate(),
		end: moment().toDate(),
	});
	const [showModal, setShowModal] = useState(false);
	const [eventType, setEventType] = useState("meeting");
	const [taskType, setTaskType] = useState("dueDate");
	const [formData, setFormData] = useState({
		eventType: "meeting",
		description: "",
		meetingFromDate: "",
		meetingFromTime: "",
		meetingToDate: "",
		meetingToTime: "",
		meetingAttendees: "",
		meetingLocation: "",
		meetingLink: "",
		taskType: "",
		taskDueDate: "",
		taskAssignee: "",
		taskDuration: "",
		phoneNo: "",
	});

	const [isLoading, setIsLoading] = useState(false);
	useEffect(() => {
		fetchAllEvents();
	}, []);

	const fetchAllEvents = async () => {
		try {
			const response = await CalendarService.getEvents();
			response.data.map((event) => {
				event.title = event.description;
				event.start = new Date(event.meetingFromDate);
				event.end = new Date(event.meetingToDate);
				return event;
			});
			setEvents(response.data);
			setIsLoading(false);
		} catch (error) {
			console.error(error);
		}
	};

	const handleDateSelect = (event) => {
		setShowModal(true);
	};

	const handleEvent = ({ event }) => {
		setFormData((prevData) => event);
		handleDateSelect();
	};

	const eventStyleGetter = () => ({
		style: {
			backgroundColor: "#6074c5",
			color: "white",
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
				<HStack>
					<button onClick={goToBack}>
						<MdChevronLeft />
					</button>
					<button onClick={goToNext}>
						<MdChevronRight />
					</button>
				</HStack>
				<Center>
					<button>{toolbar.label}</button>
				</Center>
				<HStack>
					<ButtonGroup spacing="0">
						<Button variant="ghost" onClick={() => toolbar.onView("day")}>
							Day
						</Button>
						<Button variant="ghost" onClick={() => toolbar.onView("week")}>
							Week
						</Button>
						<Button variant="ghost" onClick={() => toolbar.onView("month")}>
							Month
						</Button>
						<Button variant="ghost" onClick={() => toolbar.onView("agenda")}>
							Agenda
						</Button>
					</ButtonGroup>
				</HStack>
				{/* <button onClick={toolbar.onNavigateToday}>Today</button> */}
			</Flex>
		);
	};

	const handleTypeChange = (e) => {
		setEventType((prev) => e.target.value);
		setFormData({
			eventType: e.target.value,
			description: "",
			meetingFromDate: "",
			meetingFromTime: "",
			meetingToDate: "",
			meetingToTime: "",
			meetingAttendees: "",
			meetingLocation: "",
			meetingLink: "",
			taskType: "",
			taskDueDate: "",
			taskAssignee: "",
			taskDuration: "",
			phoneNo: "",
		});
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (formData.meetingFromDate !== "" && formData.meetingFromTime !== "") {
			setFormData((prevData) => ({
				...prevData,
				meetingToDate: formData.meetingFromDate,
			}));
			setFormData((prevData) => ({
				...prevData,
				meetingToTime: formData.meetingFromTime,
			}));
		}
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleRadioChange = (taskType) => {
		setTaskType(taskType);
		setFormData((prevData) => ({ ...prevData, taskType }));
		setFormData((prevData) => ({ ...prevData, taskDueDate: "" }));
		setFormData((prevData) => ({ ...prevData, taskAssignee: "" }));
		setFormData((prevData) => ({ ...prevData, taskDuration: "" }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setIsLoading(true);
			await CalendarService.addEvent(formData);
			setFormData({
				eventType: "meeting",
				description: "",
				meetingFromDate: "",
				meetingFromTime: "",
				meetingToDate: "",
				meetingToTime: "",
				meetingAttendees: "",
				meetingLocation: "",
				meetingLink: "",
				taskType: "",
				taskDueDate: "",
				taskAssignee: "",
				taskDuration: "",
				phoneNo: "",
			});
			setShowModal(false);
			fetchAllEvents();
		} catch (error) {
			console.error(error);
		}
	};
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
	return (
		<Box width="100%">
			{!events && <Loader />}
			{events && (
				<BigCalendar
					localizer={localizer}
					events={events.length ? events : [defaultEvent]}
					startAccessor="start"
					endAccessor="end"
					selectable
					onSelectSlot={handleDateSelect}
					eventPropGetter={eventStyleGetter}
					formats={{
						eventTimeRangeFormat: () => null,
					}}
					components={{
						// event: (event) => (
						//   <div onClick={() => handleEvent(event)}>
						//     <div>{formatEventTime(event.event)}</div>
						//     <Text fontSize="sm">{event?.event?.title}</Text>
						//   </div>
						// ),
						toolbar: ScrollToolbar,
					}}
					dayFormat={(date, culture, localizer) => moment(date).format("D dd")}
					dayHeaderFormat={(date, culture, localizer) =>
						moment(date).format("D dddd")
					}
					views={["day", "week", "month", "agenda"]}
					style={{ height: 800 }}
				/>
			)}

			<Modal isOpen={showModal} size="xl" onClose={() => setShowModal(false)}>
				<ModalOverlay />
				<ModalContent zIndex="2">
					<ModalHeader>Add Event</ModalHeader>
					<form className="tab-form">
						<ModalBody>
							<FormControl>
								<FormLabel>Type of Event</FormLabel>
								<Select
									name="eventType"
									value={formData.eventType}
									onChange={handleTypeChange}
								>
									<option value="meeting">Meeting</option>
									<option value="task">Task</option>
									<option value="phoneCall">Phone Call</option>
									<option value="event">Group Events</option>
								</Select>
							</FormControl>
							<FormControl>
								<FormLabel>Description</FormLabel>
								<Textarea
									name="description"
									value={formData.description}
									onChange={handleChange}
									required
								/>
							</FormControl>
							{eventType === "call" && (
								<FormControl>
									<FormLabel>Phone Number</FormLabel>
									<Input
										type="text"
										name="phoneNo"
										value={formData.phoneNo}
										onChange={handleChange}
										required
									/>
								</FormControl>
							)}
							{eventType !== "task" && (
								<>
									<Flex>
										<FormControl flex="1">
											<FormLabel>From</FormLabel>
											<Input
												type="date"
												name="meetingFromDate"
												value={formData.meetingFromDate}
												onChange={handleChange}
												required
											/>
										</FormControl>
										<FormControl flex="1">
											<FormLabel>Time</FormLabel>
											<Input
												type="time"
												name="meetingFromTime"
												value={formData.meetingFromTime}
												onChange={handleChange}
												required
											/>
										</FormControl>
									</Flex>
									<Flex>
										<FormControl flex="1">
											<FormLabel>To</FormLabel>
											<Input
												type="date"
												name="meetingToDate"
												value={formData.meetingToDate}
												onChange={handleChange}
												required
											/>
										</FormControl>
										<FormControl flex="1">
											<FormLabel>Time</FormLabel>
											<Input
												type="time"
												name="meetingToTime"
												value={formData.meetingToTime}
												onChange={handleChange}
												required
											/>
										</FormControl>
									</Flex>
								</>
							)}
							{eventType === "task" && (
								<>
									<FormControl>
										<FormLabel> Type</FormLabel>
										<RadioGroup
											defaultValue="dueDate"
											onChange={handleRadioChange}
											name="taskType"
										>
											<Stack direction="row">
												<Radio value="dueDate">Due Date</Radio>
												<Radio value="timeFrame">Time-frame</Radio>
											</Stack>
										</RadioGroup>
									</FormControl>
									{taskType === "dueDate" ? (
										<>
											<FormControl flex="1">
												<FormLabel> Date</FormLabel>
												<Input
													type="date"
													name="taskDueDate"
													value={formData.taskDueDate}
													onChange={handleChange}
													required
												/>
											</FormControl>
											<FormControl flex="1">
												<FormLabel> Assignee</FormLabel>
												<Input
													type="text"
													name="taskAssignee"
													value={formData.taskAssignee}
													onChange={handleChange}
													required
												/>
											</FormControl>
										</>
									) : (
										<FormControl flex="1">
											<FormLabel>Duration (minutes)</FormLabel>
											<Input
												type="number"
												name="taskDuration"
												value={formData.taskDuration}
												onChange={handleChange}
												required
											/>
										</FormControl>
									)}
								</>
							)}
							{(eventType === "meeting" || eventType === "event") && (
								<>
									<FormControl>
										<FormLabel>Required Attendees</FormLabel>
										<Input
											type="text"
											name="meetingAttendees"
											value={formData.meetingAttendees}
											onChange={handleChange}
											required
										/>
									</FormControl>
									<FormControl>
										<FormLabel>Location </FormLabel>
										<Input
											type="text"
											name="meetingLocation"
											value={formData.meetingLocation}
											onChange={handleChange}
											required
										/>
									</FormControl>
									<FormControl>
										<FormLabel>Meeting Link</FormLabel>
										<Textarea
											name="meetingLink"
											value={formData.meetingLink}
											onChange={handleChange}
											required
										/>
									</FormControl>
								</>
							)}
						</ModalBody>
						<ModalFooter>
							<Button
								isDisabled={formData.description === ""}
								onClick={handleSubmit}
								bg="brand.logo_bg"
								isLoading={isLoading}
								loadingText="Loading"
							>
								Add Event
							</Button>
							<Button variant="ghost" onClick={() => setShowModal(false)}>
								Cancel
							</Button>
						</ModalFooter>
					</form>
				</ModalContent>
			</Modal>
		</Box>
	);
};

export default Calendar;
