import { HStack } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";

const BasicInfo = ({ title1, title2, mt, border, weight }) => (
	<HStack w={"100%"} mt={mt} spacing={border && 0}>
		<TextTitle
			title={title1}
			size="xs"
			border={border}
			align={!title2 && "center"}
			weight={weight}
		/>
		{title2 && (
			<TextTitle align="center" title={title2} size="xs" border={border} />
		)}
	</HStack>
);
export default BasicInfo;
