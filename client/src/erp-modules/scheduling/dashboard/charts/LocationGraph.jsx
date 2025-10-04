import { Box, Flex, Select } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Doughnut } from "react-chartjs-2";
import SchedulerService from "services/SchedulerService";

const LocationGraph = ({ company }) => {
	const [dailyTotals, setDailyTotals] = useState(null);
	const options = {
		plugins: {
			legend: {
				position: "bottom",
			},
		},
		tooltips: {
			callbacks: {
				label(tooltipItem, data) {
					return `Total Cost: $${data["datasets"][0].data[tooltipItem["index"]]}`;
				},
			},
		},
	};

	useEffect(() => {
		const colors = ["#537eee", "#49a86f", "#7713c9"];
		const fetchTotals = async () => {
			try {
				const { data } = await SchedulerService.getLocationMonthlyTotals(company);

				const graphData = {
					labels: data.map((item) => item._id),
					datasets: [
						{
							data: data.map((item) => item.totalRunning),
							backgroundColor: colors.slice(0, data.length),
							hoverBackgroundColor: colors.slice(0, data.length),
						},
					],
				};
				setDailyTotals(graphData);
			} catch (error) {}
		};
		fetchTotals();
	}, []);

	return (
		<Box
			color={"var(--nav_color)"}
			px="1em"
			bg={"var(--primary_bg)"}
			border="3px solid var(--main_color)"
			borderRadius="1px"
			fontWeight="bold"
		>
			<Flex justify="space-between" align="center" mb="1" color={"var(--nav_color)"}>
				<TextTitle title={"Overview for Location"} />
				<Select width="200px" size={"sm"}>
					<option>Month</option>
				</Select>
			</Flex>
			<Box w={{ base: "70%" }} mx={"auto"}>
				<Doughnut data={dailyTotals} options={options} />
			</Box>
		</Box>
	);
};

export default LocationGraph;
