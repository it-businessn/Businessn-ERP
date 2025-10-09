import { HStack, Spacer, Stack, VStack } from "@chakra-ui/react";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";

const StatsCard = () => {
	const HEADER_CARDS = [
		{
			title: "Daily Average Statistics",
			bg: "var(--nav_gradient_blue)",
			items: [
				{ title: "Hours", value: 18 },
				{ title: "Cost", value: 1 },
				{ title: "People", value: 0 },
			],
		},
		{
			title: "Monthly Expense",
			bg: "var(--nav_gradient_orange)",
			items: [
				{ title: "Targeted Cost", value: 18 },
				{ title: "Current Cost", value: 4 },
			],
		},
		{
			title: "Coming Up",
			bg: "var(--nav_gradient_green)",
			items: [
				{ title: "Label", value: 5 },
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
					<HStack justify={"space-evenly"}>
						{card.items.map((_) => (
							<VStack
								flex={0.3}
								alignItems="center"
								key={_.title}
								color={"var(--main_color_black)"}
							>
								<TextTitle align="center" title={_.value} size={"lg"} />
								<NormalTextTitle title={_.title} align="center" />
							</VStack>
						))}
					</HStack>
				</Stack>
			))}
		</Stack>
	);
};

export default StatsCard;
