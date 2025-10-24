import { Box, Text } from "@chakra-ui/react";
import SkeletonLoader from "components/SkeletonLoader";
import { config } from "react-spring";
import VerticalCarousel from "./VerticalCarousel";

const PayrollCard = ({ payGroupSchedule, closestRecordIndex }) => {
	const state = {
		config: config.gentle,
		showNavigation: true,
	};

	return (
		<Box width="100%" px="1em">
			{!payGroupSchedule && <SkeletonLoader />}
			{payGroupSchedule?.length > 0 ? (
				<VerticalCarousel
					slides={payGroupSchedule}
					showNavigation={state.showNavigation}
					animationConfig={state.config}
					closestRecordIndex={closestRecordIndex || 0}
				/>
			) : (
				<Text>No pay periods available</Text>
			)}
		</Box>
	);
};

export default PayrollCard;
