import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import SelectBox from "components/ui/select/SelectBox";
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarService from "services/CalendarService";
import LeadsService from "services/LeadsService";
import LocalStorageService from "services/LocalStorageService";
import UserService from "services/UserService";
import { isManager } from "utils";
import { HEADER_CARDS } from "./data";
import LeftPane from "./leftpane";
import RightPane from "./rightpane";

const CRMDashboard = () => {
	const user = LocalStorageService.getItem("user");
	const [headerCards, setHeaderCards] = useState(HEADER_CARDS);
	const [opportunities, setOpportunities] = useState(null);
	const [events, setEvents] = useState(null);
	const [meetings, setMeetings] = useState(null);
	const [appointments, setAppointments] = useState(null);
	const [isRefresh, setIsRefresh] = useState(false);
	const [employees, setEmployees] = useState(null);
	const [selectedUser, setSelectedUser] = useState(user);
	const currentDate = new Date();
	const currentMonth = currentDate.getMonth() + 1;
	const [month, setMonth] = useState(currentMonth);
	const STATS = [
		{
			name: "Events",
			count: 0,
		},
		{
			name: "Meetings",
			count: 0,
		},
		{
			name: "Appointments",
			count: 0,
		},
	];
	const [stats, setStats] = useState(STATS);

	const role = user?.role;

	const headerCardsInfoDetails = (data) => {
		const pipelineData = data[0]?.pipeline;
		const salesData = data[0]?.salesMade;

		headerCards[0].value = data?.find((_) => _.month === month)?.count;
		headerCards[1].value = pipelineData;
		headerCards[2].value = pipelineData;
		headerCards[3].value = salesData;
	};

	const setStatInfo = (key, count) =>
		setStats((prevStats) =>
			prevStats.map((stat) => {
				if (stat.name === key) {
					return { ...stat, count };
				}
				return stat;
			}),
		);

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
		const fetchAllEmployees = async () => {
			try {
				const response = await UserService.getAllUsers();
				setEmployees(response.data.filter(({ role }) => !isManager(role)));
			} catch (error) {
				console.error(error);
			}
		};

		fetchAllAppointments();
		fetchAllEmployees();
		fetchAllEvents();
		fetchAllMeetings();
		fetchAllOpportunities();
	}, [isRefresh, selectedUser]);

	useEffect(() => {
		headerCards[0].value = opportunities?.find(
			(_) => _.month === parseInt(month),
		)?.count;
	}, [month]);

	const handleChange = (value) => {
		if (value === "") {
			setSelectedUser(user);
		} else {
			setSelectedUser(employees.find(({ fullName }) => fullName === value));
		}
	};

	return (
		<Box p={{ base: "1em" }} overflow={"hidden"}>
			<Flex w={"50%"}>
				<Text fontWeight="bold" mb={"0.5em"} w={"50%"}>
					CRM {isManager(role) && "Manager"} Dashboard
				</Text>
				{isManager(role) && employees && (
					<SelectBox
						handleChange={handleChange}
						data={employees}
						name="fullName"
						border="1px solid var(--primary_button_bg)"
						color={"brand.primary_button_bg"}
						value={selectedUser?.fullName}
						placeholder="Select"
						size={"sm"}
					/>
				)}
			</Flex>
			<SimpleGrid
				columns={{ base: 1, md: 1, lg: 2 }}
				spacing="4"
				mt="4"
				templateColumns={{ lg: "70% 30%" }}
			>
				<LeftPane
					appointments={appointments}
					currentMonth={currentMonth}
					events={events}
					headerCards={headerCards}
					meetings={meetings}
					opportunities={opportunities}
					setIsRefresh={setIsRefresh}
					setMonth={setMonth}
					selectedUser={selectedUser}
				/>
				<RightPane stats={stats} selectedUser={selectedUser} />
			</SimpleGrid>
		</Box>
	);
};

export default CRMDashboard;
