import { Box } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Line } from "react-chartjs-2";
import SchedulerService from "services/SchedulerService";

const StaffOverview = ({ company, selectedCrew }) => {
	const [dailyTotals, setDailyTotals] = useState(null);

	const options = {
		scales: {
			y: {
				beginAtZero: true,
				grid: {
					color: "rgba(0, 0, 0, 0.1)",
					borderDash: [3, 3],
					drawBorder: false,
				},
				ticks: {
					font: {
						weight: "bold",
						family: "Arial, Helvetica, sans-serif",
					},
				},
			},
			x: {
				grid: {
					display: false,
				},
				ticks: {
					font: {
						weight: "bold",
						family: "Arial, Helvetica, sans-serif",
					},
					autoSkip: false,
				},
			},
		},
		plugins: {
			legend: { position: "bottom" },
			tooltip: {
				callbacks: {
					label: function (context) {
						const month = context.label; // x-axis label
						const value = context.dataset.data[context.dataIndex]; // y-axis value
						return `${month}: $${value}`; // e.g., "Sep: $100"
					},
				},
			},
		},
		layout: {
			padding: { left: 1, right: 1, top: 0, bottom: 0 },
		},
	};

	useEffect(() => {
		const fetchTotals = async () => {
			try {
				const { data } = await SchedulerService.getDailyTotals(company, selectedCrew);

				const monthlyTotals = Array(12).fill(0);
				data.forEach((item) => {
					monthlyTotals[item._id - 1] = item.maxRunningTotal; // month is 1-based
				});

				const graphData = {
					labels: [
						"Jan",
						"Feb",
						"Mar",
						"Apr",
						"May",
						"Jun",
						"Jul",
						"Aug",
						"Sep",
						"Oct",
						"Nov",
						"Dec",
					],
					datasets: [
						{
							label: "Running Total",
							data: monthlyTotals,
							backgroundColor: "#537eee",
							borderColor: "#537eee",
							borderWidth: 2,
							fill: false,
							cubicInterpolationMode: "monotone",
							pointRadius: 0,
						},
					],
				};
				setDailyTotals(graphData);
			} catch (error) {}
		};
		if (selectedCrew) fetchTotals();
	}, [selectedCrew]);

	return (
		<Box
			color={"var(--nav_color)"}
			p="1em"
			bg={"var(--primary_bg)"}
			border="3px solid var(--main_color)"
			borderRadius="1px"
			fontWeight="bold"
		>
			<TextTitle title={"Average Headcount By Location"} />
			<Box w={{ base: "650px" }} mx={"auto"}>
				<Line data={dailyTotals} options={options} />
			</Box>
		</Box>
	);
};

export default StaffOverview;
