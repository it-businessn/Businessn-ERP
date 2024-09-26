import { VStack } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";

const PayPeriodCard = ({
	color = "var(--nav_color)",
	bg = "var(--primary_bg)",
	border = "3px solid var(--main_color)",
	title1,
	title2,
	title3,
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
			<TextTitle title={title1} align={"center"} />
			<TextTitle title={title2} align={"center"} />
			{title3 && (
				<TextTitle title={title3} align={"center"} size="lg" mb={"1em"} />
			)}
		</VStack>
	);
};

export default PayPeriodCard;
