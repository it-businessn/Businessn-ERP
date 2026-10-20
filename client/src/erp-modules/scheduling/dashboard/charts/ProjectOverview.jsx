import { Box } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Bar } from "components/ui/charts";

const ProjectOverview = ({ expenseData }) => {
	const options = {
		scales: {
			y: {
				beginAtZero: true,
				// chart.js v4: grid.drawBorder -> border.display, grid.borderDash -> border.dash
				grid: {
					color: "rgba(0, 0, 0, 0.1)",
				},
				border: {
					display: false,
					dash: [3, 3],
				},
				ticks: {
					font: {
						weight: "bold",
						family: "Arial, Helvetica, sans-serif",
					},
				},
				stacked: false,
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
				stacked: false,
			},
		},
		plugins: {
			legend: { position: "bottom" },
		},
	};

	return (
		<Box
			color={"var(--nav_color)"}
			p="1em"
			bg={"var(--primary_bg)"}
			border="3px solid var(--main_color)"
			borderRadius="1px"
			fontWeight="bold"
		>
			<TextTitle title={"Cost Overview"} />
			<Box w={{ base: "650px" }} mx={"auto"}>
				<Bar data={expenseData} options={options} />
			</Box>
		</Box>
	);
};

export default ProjectOverview;
