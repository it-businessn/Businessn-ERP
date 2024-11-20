import { Box, SimpleGrid } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarService from "services/CalendarService";
import LeadsService from "services/LeadsService";
import TaskService from "services/TaskService";
import { HEADER_CARDS } from "../data";
import SalesCard from "./SalesCard";
import SalesChart from "./SalesChart";
import UpcomingList from "./Upcomings";

const LeftPane = ({ selectedUser, setStats, company, user }) => {
	const currentDate = new Date();
	const currentMonth = currentDate.getMonth() + 1;
	const [headerCards, setHeaderCards] = useState(HEADER_CARDS);
	const [month, setMonth] = useState(currentMonth);
	const [opportunities, setOpportunities] = useState([]);
	const [tasks, setTasks] = useState(null);
	const [events, setEvents] = useState(null);
	const [meetings, setMeetings] = useState(null);
	const [appointments, setAppointments] = useState(null);
	const [isRefresh, setIsRefresh] = useState(false);

	const headerCardsInfoDetails = (data) => {
		const pipelineData = data[0]?.pipeline;
		const salesData = data[0]?.salesMade;

		headerCards[0].value = data?.find((_) => _.month === month)?.count || 0;
		headerCards[1].value = pipelineData;
		headerCards[2].value = pipelineData;
		headerCards[3].value = salesData;
	};

	useEffect(() => {
		const fetchAllOpportunities = async () => {
			try {
				const response = await LeadsService.getGroupedOpportunitiesByCompany(
					company,
				);
				setOpportunities(response.data);
				const pipelineData = response.data[0]?.pipeline || 0;
				const salesData = response.data[0]?.salesMade || 0;

				headerCards[0].value =
					response.data?.find((_) => _.month === month)?.count || 0;
				headerCards[1].value = pipelineData;
				headerCards[2].value = pipelineData;
				headerCards[3].value = salesData;
			} catch (error) {
				console.error(error);
			}
		};

		const fetchAllEvents = async () => {
			try {
				const response = await CalendarService.getEventsByType({
					type: "event",
					name: company,
				});
				const userEvents = response.data.filter(
					(_) =>
						_.meetingAttendees.includes(selectedUser.fullName) ||
						_.createdBy === selectedUser._id,
				);
				setEvents(userEvents);
				setStatInfo("Events", response.data.length);
			} catch (error) {
				console.error(error);
			}
		};
		const fetchAllMeetings = async () => {
			try {
				const response = await CalendarService.getEventsByType({
					type: "meeting",
					name: company,
				});
				const userMeetings = response.data.filter(
					(_) =>
						_.meetingAttendees.includes(selectedUser.fullName) ||
						_.createdBy === selectedUser._id,
				);
				setMeetings(userMeetings);
				setStatInfo("Meetings", response.data.length);
			} catch (error) {
				console.error(error);
			}
		};
		const fetchAllAppointments = async () => {
			try {
				const response = await CalendarService.getEventsByType({
					type: "phoneCall",
					name: company,
				});
				const userAppointments = response.data.filter(
					(_) =>
						_.meetingAttendees.includes(selectedUser.fullName) ||
						_.createdBy === selectedUser._id,
				);
				setAppointments(userAppointments);
				setStatInfo("Appointments", response.data.length);
			} catch (error) {
				console.error(error);
			}
		};

		const fetchAllUserTasks = async () => {
			try {
				const response = await TaskService.getTaskByAssignee({
					name: selectedUser?.fullName,
					company,
				});
				setTasks(response.data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchAllUserTasks();
		fetchAllAppointments();
		fetchAllEvents();
		fetchAllMeetings();
		fetchAllOpportunities();
	}, [isRefresh, selectedUser, company]);

	useEffect(() => {
		if (opportunities.length > 0) {
			headerCardsInfoDetails(opportunities);
		}
	}, [month, opportunities]);

	const setStatInfo = (key, count) =>
		setStats((prevStats) =>
			prevStats.map((stat) => {
				if (stat.name === key) {
					return { ...stat, value: count };
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
				color={"var(--menu_item_color)"}
			>
				<SalesCard
					opportunities={opportunities}
					headerCards={headerCards}
					setMonth={setMonth}
					currentMonth={currentMonth}
				/>
			</SimpleGrid>
			<SimpleGrid columns={{ base: 1, md: 1, lg: 2 }} spacing="1em" mt="4">
				<SalesChart company={company} selectedUser={selectedUser} user={user} />
			</SimpleGrid>
			<SimpleGrid columns={{ base: 1, md: 1, lg: 1 }} spacing="4" mt="4">
				<BoxCard px="1em" fontWeight="bold">
					<TextTitle title={"Upcoming"} mt={2} mb={2} />
					{tasks && (
						<UpcomingList
							tasks={tasks}
							events={events}
							meetings={meetings}
							appointments={appointments}
							selectedUser={selectedUser}
							setIsRefresh={setIsRefresh}
							company={company}
						/>
					)}
				</BoxCard>
			</SimpleGrid>
		</Box>
	);
};

export default LeftPane;
