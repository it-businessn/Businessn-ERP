import { SimpleGrid } from "@chakra-ui/react";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import LocationGraph from "./charts/LocationGraph";
import StaffOverview from "./charts/StaffOverview";

const SchedulingDashboard = () => {
	// const { company } = useCompany();
	// const [events, setEvents] = useState(null);
	// const [meetings, setMeetings] = useState(null);
	// const [appointments, setAppointments] = useState(null);
	const [isRefresh, setIsRefresh] = useState(false);

	// useEffect(() => {
	// 	const fetchAllEvents = async () => {
	// 		try {
	// 			const {data} = await CalendarService.getEventsByType({
	// 				type: "event",
	// 				company,
	// 			});
	// 			setEvents(data);
	// 		} catch (error) {
	// 			console.error(error);
	// 		}
	// 	};
	// 	const fetchAllMeetings = async () => {
	// 		try {
	// 			const {data} = await CalendarService.getEventsByType({
	// 				type: "meeting",
	// 				company,
	// 			});
	// 			setMeetings(data);
	// 		} catch (error) {
	// 			console.error(error);
	// 		}
	// 	};
	// 	const fetchAllAppointments = async () => {
	// 		try {
	// 			const {data} = await CalendarService.getEventsByType({
	// 				type: "phoneCall",
	// 				company,
	// 			});
	// 			setAppointments(data);
	// 		} catch (error) {
	// 			console.error(error);
	// 		}
	// 	};
	// 	fetchAllEvents();
	// 	fetchAllMeetings();
	// 	fetchAllAppointments();
	// }, [isRefresh]);

	// const STATS = [
	// 	{
	// 		name: "Events",
	// 		count: events?.length,
	// 	},
	// 	{
	// 		name: "Meetings",
	// 		count: meetings?.length,
	// 	},
	// 	{
	// 		name: "Appointments",
	// 		count: appointments?.length,
	// 	},
	// ];

	return (
		<PageLayout title={"Dashboard"}>
			<SimpleGrid
				columns={{ base: 1, md: 1, lg: 2 }}
				spacing="4"
				mt="4"
				mr="4"
				templateColumns={{ lg: "70% 30%" }}
			>
				<StaffOverview />

				<LocationGraph />
				{/* <StatsCard /> */}
			</SimpleGrid>
			{/* <SimpleGrid
				columns={{ base: 1, md: 1, lg: 2 }}
				spacing="4"
				mt="4"
				mr="4"
				templateColumns={{ lg: "70% 30%" }}
			>
			  <ProjectOverview />  

				  <LocationGraph />  
			</SimpleGrid> */}
		</PageLayout>
	);
};

export default SchedulingDashboard;
