import { Box, HStack, Icon, SimpleGrid, VStack } from "@chakra-ui/react";
import HighlightButton from "components/ui/button/HighlightButton";
import BoxCard from "components/ui/card";
import TextTitle from "components/ui/text/TextTitle";
import { RiAspectRatioLine } from "react-icons/ri";
import { SALES_ACTIVITY_CARDS } from "../customers/contacts/logs/data";
import Activity from "./Activity";
import Contest from "./Contest";
import GaugeChartComponent from "./GaugeChart";

const RightPane = ({ setShowSelectCustomer }) => (
	<SimpleGrid columns={1} spacing={4} templateRows={{ lg: "2% 14% 14% 22%" }}>
		<TextTitle title="Sales" />
		{SALES_ACTIVITY_CARDS.map((activity) => (
			<Activity
				activity={activity}
				key={activity.title}
				target={activity.target2}
				onClick={() => setShowSelectCustomer(true)}
				width={{ base: "50%", md: "40%", lg: "20%", xl: "20%" }}
			/>
		))}
		<BoxCard
			p="0.5em 1em"
			fontWeight="bold"
			justifyContent="space-between"
			display="flex"
			flexDir={"column"}
		>
			<HStack spacing={0}>
				<VStack alignItems="self-start" spacing={0}>
					<Icon as={RiAspectRatioLine} color={"grey"} boxSize={8} />
					<TextTitle title={"Sales Target"} size={"sm"} />
					<HighlightButton name={"Process new sale"} />
				</VStack>
				<Box mt={0} mx={"auto"} w={{ base: "50%", md: "80%", lg: "80%" }}>
					{/* <GaugeChartComponent value={70} maxValue={100} /> */}
					<GaugeChartComponent value={0} maxValue={100} />
				</Box>
			</HStack>
		</BoxCard>

		<Contest />
	</SimpleGrid>
);

export default RightPane;
