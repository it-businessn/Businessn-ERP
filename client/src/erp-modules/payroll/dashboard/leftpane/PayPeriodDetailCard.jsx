import { Box, HStack, VStack } from "@chakra-ui/react";
import OutlineButton from "components/ui/button/OutlineButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
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
	borderTopLeftRadius,
	borderTopRightRadius,
	borderBottomLeftRadius,
	borderBottomRightRadius,
	payNum,
	pb,
}) => (
	<Box
		w={"100%"}
		ml={"1.5em"}
		borderTopLeftRadius={borderTopLeftRadius}
		borderTopRightRadius={borderTopRightRadius}
		borderBottomLeftRadius={borderBottomLeftRadius}
		borderBottomRightRadius={borderBottomRightRadius}
	>
		{payNum && (
			<TextTitle
				align={"right"}
				p={"0 2em 0 0 "}
				title={`Pay Period ${payNum}`}
			/>
		)}
		<HStack justifyContent={"space-between"} p="1em" pb={pb} bg={"#1c6b96"}>
			<VStack spacing={0} alignItems={"start"} justifyContent={"center"}>
				<TextTitle color={"var(--filter_border_color)"} title={header} />
				<TextTitle title={text1} />
				{text2 && <TextTitle title={text2} />}
			</VStack>
			{isOutlineButton ? (
				<OutlineButton
					w={"130px"}
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
					w={"130px"}
					name={actionText}
					loadingText="Loading"
					onOpen={handleClick}
				/>
			)}
		</HStack>
	</Box>
);

export default PayPeriodDetailCard;
