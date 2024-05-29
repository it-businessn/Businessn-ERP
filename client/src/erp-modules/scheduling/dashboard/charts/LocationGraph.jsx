import { Box, Flex, Select } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Doughnut } from "react-chartjs-2";

const LocationGraph = () => {
	const options = {
		plugins: {
			legend: {
				position: "bottom",
			},
		},
		tooltips: {
			callbacks: {
				label(tooltipItem, data) {
					return `Total Cost: $${
						data["datasets"][0].data[tooltipItem["index"]]
					}`;
				},
			},
		},
	};
	const data = {
		labels: ["Location 1", "Location 2", "Location 3", "Location 4"],
		datasets: [
			{
				data: [3000, 2500, 4000, 3500],
				backgroundColor: ["#537eee", "#49a86f", "#f6998b", "#7713c9"],
				hoverBackgroundColor: ["#537eee", "#49a86f", "#f6998b", "#7713c9"],
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
				<TextTitle title={"By location"} />
				<Select
					width="auto"
					border={"none"}
					fontSize={"xs"}
					ml={"1em"}
					visibility={"hidden"}
				>
					<option>Yearly</option>
					{/* <option>Last Month</option> */}
				</Select>
			</Flex>
			<Box w={{ base: "70%" }} mx={"auto"}>
				<Doughnut data={data} options={options} />
			</Box>
		</Box>
	);
};

export default LocationGraph;
