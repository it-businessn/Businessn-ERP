import { Box } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Doughnut } from "react-chartjs-2";

const LocationGraph = ({ roleMonthlyTotals }) => {
	const options = {
		plugins: { legend: { position: "bottom" } },
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
			<TextTitle title={"Monthly Running Cost By Roles"} />

			<Box w={{ base: "70%" }} mx={"auto"}>
				<Doughnut data={roleMonthlyTotals} options={options} />
			</Box>
		</Box>
	);
};

export default LocationGraph;
