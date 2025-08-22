import { Box } from "@chakra-ui/react";

export const RenderPriorityBars = (priority) => {
	const barCount = 3;
	const bars = [];

	for (let i = 0; i < barCount; i++) {
		const barColor =
			priority.toLowerCase() === "high"
				? "rgb(228 45 46)"
				: priority.toLowerCase() === "medium"
				? "orange.400"
				: "rgb(222 222 222)";
		bars.push(<Box key={i} h="2em" w="10px" bgColor={barColor} borderRadius="2px" />);
	}

	return bars;
};
