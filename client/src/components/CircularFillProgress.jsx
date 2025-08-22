import { Box } from "@chakra-ui/react";

export const CircularFillProgress = ({ completionPercentage }) => {
	completionPercentage = 95;
	const rotation = completionPercentage * 3.6;
	const fillColorClass = completionPercentage === 100 ? "fill-complete" : "fill";
	const clipLeft = completionPercentage <= 50 ? 0 : 100 - completionPercentage * 2;
	const clipRight = completionPercentage >= 50 ? 100 : 100 - clipLeft;

	const color = completionPercentage >= 95 ? "var(--lead_cards_bg)" : "var(--main_color_black)";
	return (
		<Box position="relative" width="100px" height="100px">
			<div className="radial-progress">
				<div className="circle">
					<div
						className="mask"
						style={{
							clip: `rect(0px, ${clipRight}px, 100px, ${clipLeft}px)`,
							transform: `rotate(${rotation}deg)`,
						}}
					/>
					<div className={fillColorClass} />
				</div>
				<div
					className="label"
					style={{
						color,
					}}
				>{`${completionPercentage}%`}</div>
			</div>
		</Box>
	);
};
