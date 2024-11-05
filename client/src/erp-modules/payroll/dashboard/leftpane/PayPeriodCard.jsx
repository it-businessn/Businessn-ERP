import { HStack, VStack } from "@chakra-ui/react";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";

const PayPeriodCard = ({
	bg = "var(--bg_color_1)",
	border = "3px solid var(--main_color)",
	title1,
	title2,
	title3,
	isPeriod,
}) => {
	return (
		<VStack
			spacing={0}
			p="0.5em"
			w={"100%"}
			bg={bg}
			border={border}
			borderRadius="10px"
		>
			<TextTitle title={title1} size={isPeriod && "1em"} align={"center"} />
			<NormalTextTitle
				size="sm"
				title={title2}
				weight={isPeriod && "400"}
				align={"center"}
			/>
			{title3 && (
				<>
					<HStack
						w={"100%"}
						spacing={0}
						alignItems={"baseline"}
						justifyContent={"center"}
					>
						<NormalTextTitle title={"In"} align={"center"} />
						<TextTitle p={0} size="5xl" align={"center"} title={title3} />
						<NormalTextTitle title={"days"} align={"right"} size="lg" />
					</HStack>
					<TextTitle
						color="var(--primary_button_bg)"
						title={"Current"}
						align={"center"}
					/>
				</>
			)}
		</VStack>
	);
};

export default PayPeriodCard;
