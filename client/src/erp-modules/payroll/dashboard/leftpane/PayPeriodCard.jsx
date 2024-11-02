import { HStack, VStack } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";

const PayPeriodCard = ({
	color = "var(--nav_color)",
	bg = "var(--primary_bg)",
	border = "3px solid var(--main_color)",
	title1,
	title2,
	title3,
	isPeriod,
}) => {
	return (
		<VStack
			spacing={0}
			color={color}
			p="1em"
			w={"100%"}
			bg={bg}
			border={border}
			borderRadius="10px"
		>
			<TextTitle title={title1} size={isPeriod && "1.25em"} align={"center"} />
			<TextTitle title={title2} weight={isPeriod && "500"} align={"center"} />
			{title3 && (
				<HStack w={"100%"} spacing={0}>
					<TextTitle title={"In"} size="lg" />
					<TextTitle size="6xl" title={title3} />
					<TextTitle title={"days"} size="lg" />
				</HStack>
			)}
		</VStack>
	);
};

export default PayPeriodCard;
