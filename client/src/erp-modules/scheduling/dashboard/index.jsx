import { Box, SimpleGrid } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarService from "services/CalendarService";
import LocationGraph from "./charts/LocationGraph";
import ProjectOverview from "./charts/ProjectOverview";
import StaffOverview from "./charts/StaffOverview";
import StatsCard from "./charts/StatsCard";

const SchedulingDashboard = () => {
	const [events, setEvents] = useState(null);
	const [meetings, setMeetings] = useState(null);
	const [appointments, setAppointments] = useState(null);
	const [isRefresh, setIsRefresh] = useState(false);

	useEffect(() => {
		const fetchAllEvents = async () => {
			try {
				const response = await CalendarService.getEventsByType("event");
				setEvents(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		const fetchAllMeetings = async () => {
			try {
				const response = await CalendarService.getEventsByType("meeting");
				setMeetings(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		const fetchAllAppointments = async () => {
			try {
				const response = await CalendarService.getEventsByType("phoneCall");
				setAppointments(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllEvents();
		fetchAllMeetings();
		fetchAllAppointments();
	}, [isRefresh]);

	const STATS = [
		{
			name: "Events",
			count: events?.length,
		},
		{
			name: "Meetings",
			count: meetings?.length,
		},
		{
			name: "Appointments",
			count: appointments?.length,
		},
	];

	return (
		<Box p={{ base: "1em" }} overflow={"hidden"}>
			<TextTitle mb={"0.5em"} title={"Dashboard"} />

			<SimpleGrid
				columns={{ base: 1, md: 1, lg: 2 }}
				spacing="4"
				mt="4"
				mr="4"
				templateColumns={{ lg: "70% 30%" }}
			>
				<StaffOverview />

				<StatsCard />
			</SimpleGrid>
			<SimpleGrid
				columns={{ base: 1, md: 1, lg: 2 }}
				spacing="4"
				mt="4"
				mr="4"
				templateColumns={{ lg: "70% 30%" }}
			>
				<ProjectOverview />

				<LocationGraph />
			</SimpleGrid>
		</Box>
	);
};

export default SchedulingDashboard;
