import { Box } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Doughnut } from "react-chartjs-2";
import SchedulerService from "services/SchedulerService";

const LocationGraph = ({ company, selectedMonth, selectedCrew }) => {
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
	function getBrightColor(index, total) {
		const hue = (index * (360 / total)) % 360;
		return `hsl(${hue}, 40%, 55%)`;
	}

	useEffect(() => {
		const fetchTotals = async () => {
			try {
				const { data } = await SchedulerService.getLocationMonthlyTotals(
					company,
					selectedMonth,
					selectedCrew,
				);

				const graphData = {
					labels: data.map((item) => item.role),
					datasets: [
						{
							data: data.map((item) => item.maxRunningTotal),
							backgroundColor: data.map((_, i) => getBrightColor(i, data.length)),
							hoverBackgroundColor: data.map((_, i) => getBrightColor(i, data.length)),
						},
					],
				};
				setDailyTotals(graphData);
			} catch (error) {}
		};
		if (selectedCrew) fetchTotals();
	}, [selectedMonth, selectedCrew]);

	return (
		<Box
			color={"var(--nav_color)"}
			p="1em"
			bg={"var(--primary_bg)"}
			border="3px solid var(--main_color)"
			borderRadius="1px"
			fontWeight="bold"
		>
			<TextTitle title={"Monthly Running Cost By Roles"} />

			<Box w={{ base: "70%" }} mx={"auto"}>
				<Doughnut data={dailyTotals} options={options} />
			</Box>
		</Box>
	);
};

export default LocationGraph;
