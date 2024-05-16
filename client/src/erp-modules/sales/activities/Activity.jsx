import { Box, Flex, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import HighlightButton from "components/ui/button/HighlightButton";
import { barOptions } from "constant";
import HorizontalBarChart from "./HorizontalBarChart";

const Activity = ({ activity, onClick, width }) => {
	return (
		<Box
			p="0.5em 1em"
			bg={"brand.primary_bg"}
			border="3px solid var(--main_color)"
			borderRadius="10px"
			fontWeight="bold"
			justifyContent="space-between"
			display="flex"
			flexDir={"column"}
		>
			<HStack>
				<VStack alignItems="self-start" spacing={0}>
					<Icon as={activity.icon} color={activity.color} boxSize={8} />
					<Text fontWeight="bold" fontSize={"sm"}>
						{activity.title}
					</Text>
				</VStack>
				<Box mt={-3} mx={"auto"} w={width}>
					<HorizontalBarChart
						label={activity.label}
						data={activity.count}
						options={barOptions}
					/>
				</Box>
			</HStack>

			<Flex p={0} borderTop="2px solid #e8ebf4" gap={0}>
				<HighlightButton name={activity.action} onClick={onClick} />
			</Flex>
		</Box>
	);
};

export default Activity;
