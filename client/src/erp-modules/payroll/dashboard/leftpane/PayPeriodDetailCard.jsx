import { Box, Flex, HStack, Spacer } from "@chakra-ui/react";
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
		ml={"0.5em"}
		borderTopLeftRadius={borderTopLeftRadius}
		borderTopRightRadius={borderTopRightRadius}
		borderBottomLeftRadius={borderBottomLeftRadius}
		borderBottomRightRadius={borderBottomRightRadius}
	>
		{payNum && (
			<TextTitle size="sm" align={"right"} p={"0 2em 0 0 "} title={`Pay Period ${payNum}`} />
		)}
		<HStack p="0.8em" pb={pb} w="100%" justifyContent="start">
			<Flex gap={1}>
				<TextTitle
					width="auto"
					size="sm"
					color={"var(--filter_border_color)"}
					title={`${header} :`}
				/>
				<TextTitle width="auto" size="sm" title={text1} />
				{text2 && <TextTitle width="auto" size="sm" title={text2} />}
			</Flex>
			<Spacer />
			{isOutlineButton ? (
				<OutlineButton
					label={"View Register"}
					onClick={handleClick}
					bg={"var(--primary_bg)"}
					size="sm"
				/>
			) : (
				<PrimaryButton
					hover={{
						color,
						bg,
					}}
					bg={bg}
					size="sm"
					color={color}
					w={"120px"}
					name={actionText}
					loadingText="Loading"
					onOpen={handleClick}
				/>
			)}
		</HStack>
	</Box>
);

export default PayPeriodDetailCard;
