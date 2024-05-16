import { Box, SimpleGrid } from "@chakra-ui/react";
import CardTitle from "components/ui/card/CardTitle";
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarService from "services/CalendarService";
import LeadsService from "services/LeadsService";
import { isManager } from "utils";
import { HEADER_CARDS } from "../data";
import SalesCard from "./SalesCard";
import SalesChart from "./SalesChart";
import UpcomingList from "./Upcomings";

const LeftPane = ({ selectedUser, setStats }) => {
	const currentDate = new Date();
	const currentMonth = currentDate.getMonth() + 1;
	const [headerCards, setHeaderCards] = useState(HEADER_CARDS);
	const [month, setMonth] = useState(currentMonth);
	const [opportunities, setOpportunities] = useState(null);
	const [events, setEvents] = useState(null);
	const [meetings, setMeetings] = useState(null);
	const [appointments, setAppointments] = useState(null);
	const [isRefresh, setIsRefresh] = useState(false);

	const headerCardsInfoDetails = (data) => {
		const pipelineData = data[0]?.pipeline;
		const salesData = data[0]?.salesMade;

		headerCards[0].value = data?.find((_) => _.month === month)?.count;
		headerCards[1].value = pipelineData;
		headerCards[2].value = pipelineData;
		headerCards[3].value = salesData;
	};

	useEffect(() => {
		const fetchAllOpportunities = async () => {
			try {
				const response = await LeadsService.getGroupedOpportunities(
					isManager(selectedUser.role),
				);
				setOpportunities(response.data);
				headerCardsInfoDetails(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		const fetchAllEvents = async () => {
			try {
				const response = await CalendarService.getEventsByType("event");
				setEvents(response.data);
				setStatInfo("Events", response.data.length);
			} catch (error) {
				console.error(error);
			}
		};
		const fetchAllMeetings = async () => {
			try {
				const response = await CalendarService.getEventsByType("meeting");
				setMeetings(response.data);
				setStatInfo("Meetings", response.data.length);
			} catch (error) {
				console.error(error);
			}
		};
		const fetchAllAppointments = async () => {
			try {
				const response = await CalendarService.getEventsByType("phoneCall");
				setAppointments(response.data);
				setStatInfo("Appointments", response.data.length);
			} catch (error) {
				console.error(error);
			}
		};

		fetchAllAppointments();

		fetchAllEvents();
		fetchAllMeetings();
		fetchAllOpportunities();
	}, [isRefresh, selectedUser]);

	useEffect(() => {
		headerCards[0].value = opportunities?.find(
			(_) => _.month === parseInt(month),
		)?.count;
	}, [month]);

	const setStatInfo = (key, count) =>
		setStats((prevStats) =>
			prevStats.map((stat) => {
				if (stat.name === key) {
					return { ...stat, count };
				}
				return stat;
			}),
		);

	return (
		<Box>
			<SimpleGrid
				mb={"1em"}
				columns={{ base: 1, md: 2, lg: 4 }}
				spacing="1em"
				color={"brand.200"}
			>
				<SalesCard
					opportunities={opportunities}
					headerCards={headerCards}
					setMonth={setMonth}
					currentMonth={currentMonth}
				/>
			</SimpleGrid>
			<SimpleGrid columns={{ base: 1, md: 1, lg: 2 }} spacing="1em" mt="4">
				<SalesChart />
			</SimpleGrid>
			<SimpleGrid columns={{ base: 1, md: 1, lg: 1 }} spacing="4" mt="4">
				<Box
					px="1em"
					color={"brand.nav_color"}
					bg={"brand.primary_bg"}
					border="3px solid var(--main_color)"
					borderRadius="10px"
					fontWeight="bold"
				>
					<CardTitle title="Upcoming" />
					<UpcomingList
						events={events}
						meetings={meetings}
						appointments={appointments}
						user={selectedUser}
						setIsRefresh={setIsRefresh}
					/>
				</Box>
			</SimpleGrid>
		</Box>
	);
};

export default LeftPane;
