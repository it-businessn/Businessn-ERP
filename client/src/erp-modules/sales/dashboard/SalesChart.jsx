import { Box, Flex, Select, Text } from "@chakra-ui/react";
import LinkButton from "components/ui/button/LinkButton";
import { BAR_DATA } from "constant";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

const SalesChart = () => {
	const navigate = useNavigate();
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
			legend: {
				display: false,
			},
		},
		layout: {
			padding: {
				left: 10,
				right: 10,
				top: 0,
				bottom: 0,
			},
		},
	};
	return (
		<>
			{BAR_DATA.map((bar) => (
				<Box
					key={bar.title}
					color={"brand.nav_color"}
					px="1em"
					bg={"brand.primary_bg"}
					border="3px solid var(--main_color)"
					borderRadius="10px"
					fontWeight="bold"
				>
					<Flex
						justify="space-between"
						align="center"
						mb="1"
						color={"brand.nav_color"}
						w={{ base: "auto", md: "103%" }}
					>
						<Text fontWeight="bold">{bar.title}</Text>
						<Select width="auto" border={"none"} fontSize={"xs"} ml={"1em"}>
							<option>Last Week</option>
							<option>Last Month</option>
						</Select>
					</Flex>
					<Box w={{ base: "70%", md: "65%", lg: "70%", xl: "70%" }} mx={"auto"}>
						<Bar data={bar.data} options={options} />
					</Box>
					<LinkButton
						name={`Log ${bar.link}`}
						onClick={() => navigate("/sales/activities")}
					/>
				</Box>
			))}
		</>
	);
};

export default SalesChart;
