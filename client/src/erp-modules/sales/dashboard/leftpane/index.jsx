import { Box, SimpleGrid } from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import LeadsService from "services/LeadsService";
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
				const { data } = await LeadsService.getGroupedOpportunitiesByCompany(company);
				setOpportunities(data);
				const pipelineData = data[0]?.pipeline || 0;
				const salesData = data[0]?.salesMade || 0;

				headerCards[0].value = data?.find((_) => _.month === month)?.count || 0;
				headerCards[1].value = pipelineData;
				headerCards[2].value = pipelineData;
				headerCards[3].value = salesData;
			} catch (error) {
				console.error(error);
			}
		};

		fetchAllOpportunities();
	}, []);

	useEffect(() => {
		if (opportunities.length > 0) {
			headerCardsInfoDetails(opportunities);
		}
	}, [month, opportunities]);

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
					<UpcomingList
						selectedUser={selectedUser}
						setIsRefresh={setIsRefresh}
						company={company}
						isRefresh={isRefresh}
						setStats={setStats}
					/>
				</BoxCard>
			</SimpleGrid>
		</Box>
	);
};

export default LeftPane;
