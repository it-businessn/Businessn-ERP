import { Box } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Bar } from "react-chartjs-2";

const ProjectOverview = ({ expenseData }) => {
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
				stacked: true,
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
				stacked: true,
			},
		},
		plugins: {
			legend: { position: "bottom" },
		},
		layout: {
			// padding: {
			// 	left: 10,
			// 	right: 10,
			// 	top: 0,
			// 	bottom: 0,
			// },
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
