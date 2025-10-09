import { HStack, Select, SimpleGrid, Spacer } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import useCrews from "hooks/useCrews";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import LocalStorageService from "services/LocalStorageService";
import { CURRENT_MONTH } from "utils/convertDate";
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
	const { crews, selectedCrew, setSelectedCrew } = useCrews(company);
	const [selectedMonth, setSelectedMonth] = useState(CURRENT_MONTH);

	return (
		<PageLayout title={""}>
			<HStack pb={3} alignItems={"center"} justifyContent={"space-between"} spacing={4}>
				<HStack flex={0.7} alignItems={"center"} justifyContent={"space-between"}>
					<TextTitle ml={3} title={"Dashboard"} />
					<Select
						width="200px"
						size={"sm"}
						value={selectedCrew || ""}
						onChange={(event) => {
							if (event.target.value) setSelectedCrew(event.target.value);
						}}
					>
						{crews?.map(({ name }) => (
							<option key={name} value={name}>
								{name}
							</option>
						))}
					</Select>
				</HStack>
				<HStack flex={0.3}>
					<Select
						width="200px"
						size={"sm"}
						value={selectedMonth || ""}
						onChange={(event) => {
							const month = parseInt(event.target.value);
							setSelectedMonth(month);
						}}
					>
						{MONTHS?.map(({ name, value }) => (
							<option key={value} value={value}>
								{name}
							</option>
						))}
					</Select>
					<Spacer />
				</HStack>
			</HStack>
			<SimpleGrid
				columns={{ base: 1, md: 1, lg: 2 }}
				spacing="4"
				mr="4"
				templateColumns={{ lg: "70% 30%" }}
			>
				<StaffOverview company={company} selectedCrew={selectedCrew} />
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
				<LocationGraph company={company} selectedMonth={selectedMonth} />
			</SimpleGrid>
		</PageLayout>
	);
};

export default SchedulingDashboard;
