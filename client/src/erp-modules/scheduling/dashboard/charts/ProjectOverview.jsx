import { Box, Flex, Select } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Bar } from "react-chartjs-2";

const ProjectOverview = () => {
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
						family: "Inter Variable,-apple-system,system-ui,sans-serif",
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
						family: "Inter Variable,-apple-system,system-ui,sans-serif",
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
	const data = {
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
				label: "Total Expense",
				backgroundColor: "#537eee",
				borderColor: "#537eee",
				borderWidth: 1,
				hoverBackgroundColor: "#537eee",
				hoverBorderColor: "#537eee",
				data: [81, 128, 88, 138, 158, 148, 168, 178, 188, 198, 280, 228],
			},
			{
				label: "Targeted Expense",
				backgroundColor: "#6299ae",
				borderColor: "#6299ae",
				borderWidth: 1,
				hoverBackgroundColor: "#6299ae",
				hoverBorderColor: "#6299ae",
				data: [98, 81, 98, 108, 88, 108, 88, 128, 128, 138, 138, 148],
			},
		],
	};
	return (
		<Box
			color={"brand.nav_color"}
			px="1em"
			bg={"brand.primary_bg"}
			border="3px solid var(--main_color)"
			borderRadius="1px"
			fontWeight="bold"
		>
			<Flex
				justify="space-between"
				align="center"
				mb="1"
				color={"brand.nav_color"}
			>
				<TextTitle title={"Project Overview"} />
				<Select
					width="auto"
					border={"none"}
					fontSize={"xs"}
					ml={"1em"}
					// visibility={"hidden"}
				>
					<option>Yearly</option>
					{/* <option>Last Month</option> */}
				</Select>
			</Flex>
			<Box w={{ base: "70%" }} mx={"auto"}>
				<Bar data={data} options={options} />
			</Box>
		</Box>
	);
};

export default ProjectOverview;
