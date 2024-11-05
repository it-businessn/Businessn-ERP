import { HStack, VStack } from "@chakra-ui/react";
import OutlineButton from "components/ui/button/OutlineButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";

const PayPeriodDetailCard = ({
	header,
	text1,
	text2,
	handleClick,
	actionText,
	bg,
	color,
	isOutlineButton,
}) => (
	<HStack
		w={"100%"}
		justifyContent={"space-between"}
		color="var(--main_color)"
		px="1em"
		bg={"var(--empName_bg)"}
		border="3px solid var(--bg_color_1)"
		borderRadius="10px"
		my={2}
	>
		<VStack
			w={"70%"}
			py={2}
			spacing={0}
			alignItems={"center"}
			justifyContent={"center"}
		>
			<TextTitle size={"1.1em"} align={"center"} title={header} />
			<NormalTextTitle size="sm" align={"center"} title={text1} />
			{text2 && <NormalTextTitle size="sm" align={"center"} title={text2} />}
		</VStack>
		{isOutlineButton ? (
			<OutlineButton
				minW={"30%"}
				label={"View Register"}
				onClick={handleClick}
				bg={"var(--primary_bg)"}
			/>
		) : (
			<PrimaryButton
				hover={{
					color,
					bg,
				}}
				bg={bg}
				color={color}
				minW={"30%"}
				name={actionText}
				loadingText="Loading"
				onOpen={handleClick}
			/>
		)}
	</HStack>
);

export default PayPeriodDetailCard;
