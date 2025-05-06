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
		ml={"0.5em"}
		borderTopLeftRadius={borderTopLeftRadius}
		borderTopRightRadius={borderTopRightRadius}
		borderBottomLeftRadius={borderBottomLeftRadius}
		borderBottomRightRadius={borderBottomRightRadius}
	>
		{payNum && (
			<TextTitle size="sm" align={"right"} p={"0 2em 0 0 "} title={`Pay Period ${payNum}`} />
		)}
		<HStack justifyContent={"space-between"} p="0.8em" pb={pb}>
			<VStack spacing={0} alignItems={"start"} justifyContent={"center"}>
				<TextTitle size="sm" color={"var(--filter_border_color)"} title={header} />
				<TextTitle size="sm" title={text1} />
				{text2 && <TextTitle size="sm" title={text2} />}
			</VStack>
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
