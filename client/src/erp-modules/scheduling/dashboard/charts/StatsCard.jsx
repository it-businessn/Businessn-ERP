import { HStack, Spacer, Stack, VStack } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";

const StatsCard = () => {
	const HEADER_CARDS = [
		{
			title: "Daily Statistics",
			bg: "var(--nav_gradient_blue)",
			items: [
				{ title: "Scheduled", value: 18 },
				{ title: "On call", value: 1 },
				{ title: "Time off", value: 0 },
			],
		},
		{
			title: "Pending Approvals",
			bg: "var(--nav_gradient_orange)",
			items: [
				{ title: "Time off requests", value: 18 },
				{ title: "Shift trade approvals", value: 4 },
				{ title: "Open shift bids", value: 0 },
			],
		},
		{
			title: "Coming Up",
			bg: "var(--nav_gradient_green)",
			items: [
				{ title: "Skill Expirations", value: 5 },
				{ title: "To Do's", value: 3 },
			],
		},
	];
	return (
		<Stack justifyContent={"space-between"}>
			{HEADER_CARDS.map((card) => (
				<Stack
					key={card.title}
					p="1em"
					bg={card.bg}
					border="3px solid var(--main_color)"
					borderRadius="10px"
					fontWeight="bold"
				>
					<HStack>
						<TextTitle title={card.title} />
						<Spacer />
					</HStack>
					<HStack justify={"space-around"}>
						{card.items.map((_) => (
							<VStack align="center" key={_.title} color={"brand.600"}>
								<TextTitle title={_.value} size={"lg"} />
								<TextTitle title={_.title} weight="normal" align="center" />
							</VStack>
						))}
					</HStack>
				</Stack>
			))}
		</Stack>
	);
};

export default StatsCard;
