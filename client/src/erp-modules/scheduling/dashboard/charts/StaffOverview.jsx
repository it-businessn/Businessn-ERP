import { Box, Flex, Select } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Line } from "react-chartjs-2";

const StaffOverview = () => {
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
			},
		},
		plugins: {
			legend: { position: "bottom" },
		},
		layout: {
			padding: {
				left: 1,
				right: 1,
				top: 0,
				bottom: 0,
			},
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
				label: "Assigned",
				data: [1, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 38],
				backgroundColor: "#537eee",
				borderColor: "#537eee",
				borderWidth: 2,
				fill: false,
				cubicInterpolationMode: "monotone",
				pointRadius: 0,
			},
			{
				label: "Revenue",
				data: [51, 61, 71, 81, 91, 110, 111, 121, 131, 141, 151, 161],
				backgroundColor: "#f6998b",
				borderColor: "#f6998b",
				borderWidth: 2,
				fill: false,
				cubicInterpolationMode: "monotone",
				pointRadius: 0, // Remove dots on the line
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
				<TextTitle title={"Staffing Overview for all Positions"} />
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
				<Line data={data} options={options} />
			</Box>
		</Box>
	);
};

export default StaffOverview;
