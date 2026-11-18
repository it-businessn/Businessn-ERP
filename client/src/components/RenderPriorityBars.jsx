import { Box } from "@chakra-ui/react";

export const RenderPriorityBars = (priority) => {
	const barCount = 3;
	const bars = [];
	// BUG-PM-02: a task or file without a priority crashed the whole list
	const level = String(priority || "").toLowerCase();

	for (let i = 0; i < barCount; i++) {
		const barColor =
			level === "high"
				? "rgb(228 45 46)"
				: level === "medium"
				? "orange.400"
				: "rgb(222 222 222)";
		bars.push(<Box key={i} h="2em" w="10px" bgColor={barColor} borderRadius="2px" />);
	}

	return bars;
};
