import { SimpleGrid } from "@chakra-ui/react";
import PageLayout from "layouts/PageLayout";
import "react-big-calendar/lib/css/react-big-calendar.css";
import LocalStorageService from "services/LocalStorageService";
import LocationGraph from "./charts/LocationGraph";
import ProjectOverview from "./charts/ProjectOverview";
import StaffOverview from "./charts/StaffOverview";
import StatsCard from "./charts/StatsCard";

export const MONTHS = [
	{ name: "January", value: 1 },
	{ name: "February", value: 2 },
	{ name: "March", value: 3 },
	{ name: "April", value: 4 },
	{ name: "May", value: 5 },
	{ name: "June", value: 6 },
	{ name: "July", value: 7 },
	{ name: "August", value: 8 },
	{ name: "September", value: 9 },
	{ name: "October", value: 10 },
	{ name: "November", value: 11 },
	{ name: "December", value: 12 },
];

const SchedulingDashboard = () => {
	const company = LocalStorageService.getItem("selectedCompany");

	return (
		<PageLayout title={"Dashboard"}>
			<SimpleGrid
				columns={{ base: 1, md: 1, lg: 2 }}
				spacing="4"
				mr="4"
				templateColumns={{ lg: "70% 30%" }}
			>
				<StaffOverview company={company} />
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
				<LocationGraph company={company} />
			</SimpleGrid>
		</PageLayout>
	);
};

export default SchedulingDashboard;
