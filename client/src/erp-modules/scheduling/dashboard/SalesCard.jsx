import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import { Box, Flex, Icon, Select, Text } from "@chakra-ui/react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaAward } from "react-icons/fa";
import { GiDiamondTrophy } from "react-icons/gi";
import { HiOutlineReceiptPercent } from "react-icons/hi2";
import { TfiTarget } from "react-icons/tfi";

const SalesCard = () => {
	const HEADER_CARDS = [
		{
			color: "#cda4a8",
			icon: TfiTarget,
			title: "New Opportunities",
			subIcon: TfiTarget,
			value: 100,
			percent: "10%",
		},
		{
			color: "#9fd4d0",
			icon: FaAward,
			title: "No. of opportunities in the pipeline",
			subIcon: ArrowDownIcon,
			value: 55,
			percent: "2.22%",
		},
		{
			color: "#a5a4e0",
			icon: GiDiamondTrophy,
			title: "Value of opportunities in the pipeline",
			subIcon: ArrowUpIcon,
			value: "$345",
			percent: "3.34%",
		},
		{
			color: "#e0bb6c",
			icon: HiOutlineReceiptPercent,
			title: "Total Sales",
			subIcon: ArrowUpIcon,
			value: "122",
			percent: "1.22%",
		},
	];
	return (
		<>
			{HEADER_CARDS.map((card) => (
				<Box
					key={card.title}
					px="1em"
					bg={"brand.primary_bg"}
					border="3px solid var(--main_color)"
					borderRadius="10px"
					fontWeight="bold"
				>
					<Flex
						justify="space-between"
						align="center"
						mb="1"
						w={{ base: "auto", md: "106%" }}
					>
						<Icon as={card.icon} color={card.color} boxSize={5} />
						<Select width="auto" border={"none"} fontSize={"xs"} p={0}>
							<option>This month</option>
							<option>Last month</option>
						</Select>
					</Flex>
					<Text fontSize="xs" fontWeight="bold">
						{card.title}
					</Text>
					<Flex align="center" color={"brand.600"}>
						<Text mr="3" fontWeight="900">
							{card.value}
						</Text>
						<Icon mr="1" as={card.subIcon} color="green.500" />
						<Text color="green.500" fontSize="xs">
							{card.percent}
						</Text>
					</Flex>
				</Box>
			))}
		</>
	);
};

export default SalesCard;
