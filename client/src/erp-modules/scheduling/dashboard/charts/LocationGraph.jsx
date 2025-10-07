import { Box, Flex, Select } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Doughnut } from "react-chartjs-2";
import SchedulerService from "services/SchedulerService";
import { CURRENT_MONTH } from "utils/convertDate";
import { MONTHS } from "..";

const LocationGraph = ({ company }) => {
	const [dailyTotals, setDailyTotals] = useState(null);
	const [selectedMonth, setSelectedMonth] = useState(CURRENT_MONTH);
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
		const colors = ["#537eee", "#49a86f", "#d68e67"];
		const fetchTotals = async () => {
			try {
				const { data } = await SchedulerService.getLocationMonthlyTotals(company, selectedMonth);

				const graphData = {
					labels: data.map((item) => item._id),
					datasets: [
						{
							data: data.map((item) => item.maxRunningTotal),
							backgroundColor: colors.slice(0, data.length),
							hoverBackgroundColor: colors.slice(0, data.length),
						},
					],
				};
				setDailyTotals(graphData);
			} catch (error) {}
		};
		fetchTotals();
	}, [selectedMonth]);

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
			</Flex>
			<Box w={{ base: "70%" }} mx={"auto"}>
				<Doughnut data={dailyTotals} options={options} />
			</Box>
		</Box>
	);
};

export default LocationGraph;
