import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import { Box, Icon, Text } from "@chakra-ui/react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaAward } from "react-icons/fa";
import { GiDiamondTrophy } from "react-icons/gi";
import { TfiTarget } from "react-icons/tfi";

const HeaderCards = () => {
	const HEADER_CARDS = [
		{
			color: "#a5a4e0",
			icon: TfiTarget,
			title: "Hours left to schedule",
			subIcon: TfiTarget,
			value: 15,
			percent: "10%",
		},
		{
			color: "#9fd4d0",
			icon: FaAward,
			title: "Current % of projected revenue",
			subIcon: ArrowDownIcon,
			value: "55%",
			percent: "2.22%",
		},
		{
			color: "#cda4a8",
			icon: GiDiamondTrophy,
			title: "Current % away from targeted % of projected revenue",
			subIcon: ArrowUpIcon,
			value: "78%",
			percent: "3.34%",
		},
	];
	return (
		<>
			{HEADER_CARDS.map((card) => (
				<Box
					key={card.title}
					p="1em"
					bg={"brand.primary_bg"}
					border="3px solid var(--main_color)"
					borderRadius="10px"
					fontWeight="bold"
				>
					<Icon as={card.icon} color={card.color} boxSize={5} />
					<Text fontSize="xs" fontWeight="bold">
						{card.title}
					</Text>
					<Text mr="3" fontWeight="900">
						{card.value}
					</Text>
				</Box>
			))}
		</>
	);
};

export default HeaderCards;
