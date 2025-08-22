import { CircularProgress, CircularProgressLabel } from "@chakra-ui/react";

export const CircularProgressBarCell = ({ completionPercentage, size, color, top }) => {
	const getProgressColor = (value) =>
		value <= 0
			? "#edebe9"
			: value > 0 && value <= 14
			? "rgb(228 46 43)"
			: value > 14 && value <= 29
			? "rgb(254 100 53)"
			: value > 29 && value <= 44
			? "rgb(255 146 50)"
			: value > 44 && value <= 59
			? "rgb(252 190 56)"
			: value > 59 && value <= 74
			? "rgb(196 226 49)"
			: value > 74 && value <= 89
			? "rgb(110 205 25)"
			: value > 89 && value <= 99
			? "rgb(22 179 83)"
			: "rgb(3 150 151)";

	return (
		<CircularProgress
			size={size}
			value={completionPercentage}
			color={color || getProgressColor(completionPercentage)}
		>
			<CircularProgressLabel top={top}>{`${completionPercentage}%`}</CircularProgressLabel>
		</CircularProgress>
	);
};
// const countClosedSubitems = (subitems) => {
// 	return subitems?.length > 0
// 		? subitems?.filter((subitem) => subitem.isOpen === false)?.length
// 		: 0;
// };
