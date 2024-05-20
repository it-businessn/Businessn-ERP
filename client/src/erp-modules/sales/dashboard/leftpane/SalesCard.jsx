import { Box, Flex, Icon, Select, Text } from "@chakra-ui/react";
import "react-big-calendar/lib/css/react-big-calendar.css";

const SalesCard = ({ headerCards, setMonth, currentMonth }) => {
	const handleMonth = (e) => setMonth(e.target.value);

	return (
		<>
			{headerCards.map((card, index) => (
				<Box
					key={card.title}
					px="1em"
					bg={"brand.primary_bg"}
					border="3px solid var(--main_color)"
					borderRadius="10px"
					fontWeight="bold"
					display={"flex"}
					flexDir={"column"}
					justifyContent={"space-between"}
				>
					<Flex
						justify="space-between"
						align="center"
						mb="1"
						w={{ base: "auto", md: "106%" }}
					>
						<Icon as={card.icon} color={card.color} boxSize={5} />

						<Select
							visibility={index !== 0 && "hidden"}
							width="auto"
							border={"none"}
							fontSize={"xs"}
							p={0}
							onChange={handleMonth}
						>
							<option value={currentMonth}>This month</option>
							<option value={currentMonth - 1}>Last month</option>
						</Select>
					</Flex>
					<Text fontSize="xs" fontWeight="bold">
						{card.title}
					</Text>
					<Flex align="center" color={"brand.600"}>
						<Text mr="3" fontWeight="900">
							{card.value}
						</Text>
						{/* <Icon mr="1" as={card.subIcon} color="green.500" />
						<Text color="green.500" fontSize="xs">
							{card.percent}
						</Text> */}
					</Flex>
				</Box>
			))}
		</>
	);
};

export default SalesCard;
