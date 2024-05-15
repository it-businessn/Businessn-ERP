import { Box, SimpleGrid } from "@chakra-ui/react";
import CardTitle from "components/ui/card/CardTitle";
import "react-big-calendar/lib/css/react-big-calendar.css";
import SalesCard from "./SalesCard";
import SalesChart from "./SalesChart";
import UpcomingList from "./Upcomings";

const LeftPane = ({
	appointments,
	currentMonth,
	events,
	headerCards,
	meetings,
	opportunities,
	selectedUser,
	setIsRefresh,
	setMonth,
}) => {
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
