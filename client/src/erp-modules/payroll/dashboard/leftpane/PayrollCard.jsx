import { config } from "react-spring";
import VerticalCarousel from "./VerticalCarousel";

const PayrollCard = ({
	prevSchedule,
	closestRecord,
	runType,
	nextSchedule,
	company,
	payGroupSchedule,
	closestRecordIndex,
}) => {
	const state = {
		goToSlide: 0,
		offsetRadius: 4,
		showNavigation: false,
		config: config.gentle,
	};

	return (
		payGroupSchedule && (
			<VerticalCarousel
				slides={payGroupSchedule}
				offsetRadius={state.offsetRadius}
				showNavigation={state.showNavigation}
				animationConfig={state.config}
				closestRecordIndex={closestRecordIndex}
			/>
		)
	);
};

export default PayrollCard;
