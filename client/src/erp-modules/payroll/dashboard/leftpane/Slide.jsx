import { VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { animated, useSpring } from "react-spring";
import { withGesture } from "react-with-gesture";
import { workViewPath } from "routes";
import { longFormat } from "utils/convertDate";
import PayPeriodDetailCard from "./PayPeriodDetailCard";

function Slide({ content, offsetRadius, index, animationConfig, moveSlide, delta, down, up }) {
	const styles = {
		0: {
			transform: "translateX(0%) translateY(-41.7%) scale(0.8)",
			top: "22%",
			opacity: 0,
		},
		1: {
			transform: "translateX(0%) translateY(-100%) scale(0.85)",
			top: "55%",
			opacity: 0.85,
		},
		2: {
			transform: "translateX(0%) translateY(-70%) scale(0.9)",
			top: "46%",
			opacity: 0.9,
		},
		3: {
			transform: "translateX(0%) translateY(-60%) scale(0.95)",
			top: "49%",
			opacity: 0.95,
		},
		4: {
			transform: "translateX(0%) translateY(-50%) scale(1)",
			top: "52%",
			opacity: 1,
		},
		5: {
			transform: "translateX(0%) translateY(-40%) scale(0.95)",
			top: "52%",
			opacity: 0.95,
		},
		6: {
			transform: "translateX(0%) translateY(-30%) scale(0.9)",
			top: "52%",
			opacity: 0.9,
		},
		7: {
			transform: "translateX(0%) translateY(-20%) scale(0.85)",
			top: "52%",
			opacity: 0.85,
		},
		8: {
			transform: "translateX(0%) translateY(-60%) scale(0.8)",
			top: "74%",
			opacity: 0,
		},
	};
	const animatedStyle = useSpring({
		to: styles[index],
		config: animationConfig,
	});

	const offsetFromMiddle = index - offsetRadius;
	const totalPresentables = 2 * offsetRadius + 1;

	const translateYoffset = 50 * (Math.abs(offsetFromMiddle) / (offsetRadius + 1));
	let translateY = -50;

	if (offsetRadius !== 0) {
		if (index === 0) {
			translateY = 0;
		} else if (index === totalPresentables - 1) {
			translateY = -100;
		}
	}
	if (offsetFromMiddle === 0 && down) {
		translateY += delta[1] / (offsetRadius + 1);
		if (translateY > -40) {
			moveSlide(-1);
		}
		if (translateY < -100) {
			moveSlide(1);
		}
	}
	if (offsetFromMiddle > 0) {
		translateY += translateYoffset;
	} else if (offsetFromMiddle < 0) {
		translateY -= translateYoffset;
	}
	const navigate = useNavigate();

	return (
		<animated.div
			style={{
				...animatedStyle,
				position: "absolute",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				width: "100%",
				zIndex: Math.abs(Math.abs(offsetFromMiddle) - 10),
				height: "70%",
			}}
		>
			<VStack
				onClick={() => moveSlide(offsetFromMiddle)}
				spacing={0}
				borderRadius="10px"
				width="100%"
				p="0.5em 0.8em"
				bg={"var(--empName_bg)"}
				color="var(--main_color)"
			>
				<PayPeriodDetailCard
					payNum={content.payPeriod}
					borderTopLeftRadius={"10px"}
					borderTopRightRadius={"10px"}
					header={"Pay Period:"}
					text1={`${longFormat(content?.payPeriodStartDate)} -`}
					text2={longFormat(content?.payPeriodEndDate)}
					actionText="Manage Payroll"
					pb={0}
					handleClick={() => navigate(workViewPath)}
				/>
				{content && (
					<PayPeriodDetailCard
						header={"Processing Date:"}
						text1={longFormat(content?.payPeriodProcessingDate)}
						actionText={content?.name}
						pb={0}
						bg={content?.bg}
						color={content?.color}
						handleClick={() => navigate(workViewPath)}
					/>
				)}
				<PayPeriodDetailCard
					header={"Pay Date:"}
					text1={longFormat(content?.payPeriodPayDate)}
					isOutlineButton
					borderBottomLeftRadius={"10px"}
					borderBottomRightRadius={"10px"}
					// handleClick={() => setShowReport(true)}
				/>
			</VStack>
		</animated.div>
	);
}

export default withGesture()(Slide);
