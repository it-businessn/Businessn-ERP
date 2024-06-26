import { Flex, Text } from "@chakra-ui/react";
import GaugeChart from "react-gauge-chart";

const GaugeChartComponent = ({ value, maxValue }) => {
	return (
		<Flex
			direction="column"
			position="relative"
			w={{ base: "80%", md: "80%", xl: "57%" }}
			mx={"auto"}
		>
			<GaugeChart
				id="gauge-chart"
				nrOfLevels={2}
				arcWidth={0.3}
				arcsLength={[1.5, 1]}
				// colors={["var(--primary_button_bg)", "var(--filter_border_color)"]}
				colors={["var(--filter_border_color)", "var(--filter_border_color)"]}
				arcPadding={0}
				cornerRadius={0}
				needleColor="var(--gauge_needle)"
				animate={true}
				needleBaseSize={1}
				textColor={"transparent"}
				percent={value / maxValue}
			/>
			<Text
				position="absolute"
				left="10%"
				bottom="0px"
				transform="translateX(-50%)"
				color="var(--main_color_black)"
			>
				$0
			</Text>
			<Text
				position="absolute"
				left="50%"
				bottom={{ base: "-20px", md: "-10px" }}
				transform="translateX(-50%)"
				color="var(--main_color_black)"
			>
				Remaining $2000
			</Text>
			<Text
				position="absolute"
				top={{ base: "-5px", md: "0" }}
				left="50%"
				transform="translate(-50%, -50%)"
				color="var(--main_color_black)"
			>
				$0
			</Text>
			<Text
				position="absolute"
				bottom="0px"
				right={{ base: "-80px", md: "-10%" }}
				transform="translateX(-50%)"
				color="var(--main_color_black)"
			>
				Target $2000
			</Text>
		</Flex>
	);
};

export default GaugeChartComponent;
