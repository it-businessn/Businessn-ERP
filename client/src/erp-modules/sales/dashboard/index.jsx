import {
	Avatar,
	Box,
	Flex,
	HStack,
	Select,
	SimpleGrid,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarService from "services/CalendarService";
import LocalStorageService from "services/LocalStorageService";
import UserService from "services/UserService";
import ChatMessages from "./ChatMessages";
import MiniCalendar from "./MiniCalendar";
import SalesCard from "./SalesCard";
import SalesChart from "./SalesChart";
import UpcomingList from "./Upcomings";

const CRMDashboard = () => {
	const user = LocalStorageService.getItem("user");
	const [events, setEvents] = useState(null);
	const [meetings, setMeetings] = useState(null);
	const [appointments, setAppointments] = useState(null);
	const [isRefresh, setIsRefresh] = useState(false);
	const [employees, setEmployees] = useState(null);
	const [selectedUser, setSelectedUser] = useState(user);

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
		const fetchAllEmployees = async () => {
			try {
				const response = await UserService.getAllUsers();
				setEmployees(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllEmployees();
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

	const handleChange = (event) => {
		setSelectedUser(
			employees.find(({ fullName }) => fullName === event.target.value),
		);
	};

	const role = selectedUser?.role;
	const isManager =
		role?.includes("Administrators") || role?.includes("Manager");

	return (
		<Box p={{ base: "1em" }} overflow={"hidden"}>
			<Flex w={"50%"}>
				<Text fontWeight="bold" mb={"0.5em"} flex={0.2}>
					CRM {isManager && "Manager"} Dashboard
				</Text>
				{isManager && employees && (
					<Select
						flex={0.4}
						borderRadius={"10px"}
						size={"sm"}
						color={"brand.primary_button_bg"}
						border={`1px solid var(--primary_button_bg)`}
						value={selectedUser?.fullName}
						onChange={handleChange}
					>
						{employees?.map(({ _id, fullName }) => (
							<option value={fullName} key={_id}>
								{fullName}
							</option>
						))}
					</Select>
				)}
			</Flex>
			<SimpleGrid
				columns={{ base: 1, md: 1, lg: 2 }}
				spacing="4"
				mt="4"
				templateColumns={{ lg: "70% 30%" }}
			>
				<Box>
					<SimpleGrid
						mb={"1em"}
						columns={{ base: 1, md: 2, lg: 4 }}
						spacing="1em"
						color={"brand.200"}
					>
						<SalesCard />
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
							<Text mt={2} mb={2} fontWeight="bold">
								Upcoming
							</Text>
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
				<Box
					overflow={"hidden"}
					overflowY={"auto"}
					p="1em"
					bg={"brand.primary_bg"}
					border="3px solid var(--main_color)"
					borderRadius="10px"
				>
					<VStack
						justify="center"
						align="center"
						mb="1"
						w={{ base: "auto", md: "106%" }}
						spacing={0}
					>
						<Avatar
							name={selectedUser?.fullName}
							src={selectedUser?.fullName}
						/>
						<Text fontWeight="bold">{selectedUser?.fullName}</Text>
						<Text fontSize={"xs"}>{selectedUser?.email}</Text>
					</VStack>
					<HStack spacing={2} justify={"space-between"}>
						{STATS.map(({ name, count }) => (
							<VStack spacing={0} key={name}>
								<Text fontSize="sm">{name}</Text>
								<Text fontWeight="bold">{count}</Text>
							</VStack>
						))}
						{/* <VStack spacing={0}>
							<Text fontSize="xs">Days till next</Text>
							<Text fontWeight="bold">3</Text>
						</VStack>
						<VStack spacing={0}>
							<Text fontSize="xs">Approval Date</Text>
							<Text fontWeight="bold">{formatDate(new Date())}</Text>
						</VStack>
						<VStack spacing={0}>
							<Text fontSize="xs">Payment Date</Text>
							<Text fontWeight="bold">{formatDate(new Date())}</Text>
						</VStack> */}
					</HStack>
					<MiniCalendar user={selectedUser.fullName} />
					<ChatMessages userId={selectedUser._id} />
				</Box>
			</SimpleGrid>
		</Box>
	);
};

export default CRMDashboard;
