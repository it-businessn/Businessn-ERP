import SkeletonLoader from "components/SkeletonLoader";
import { config } from "react-spring";
import VerticalCarousel from "./VerticalCarousel";

const PayrollCard = ({ payGroupSchedule, closestRecordIndex }) => {
	const state = {
		goToSlide: 0,
		offsetRadius: 4,
		showNavigation: false,
		config: config.gentle,
	};

	return (
		<>
			{!payGroupSchedule && <SkeletonLoader />}
			{payGroupSchedule && (
				<VerticalCarousel
					slides={payGroupSchedule}
					offsetRadius={state.offsetRadius}
					showNavigation={state.showNavigation}
					animationConfig={state.config}
					closestRecordIndex={closestRecordIndex}
				/>
			)}
		</>
	);
};

export default PayrollCard;
