import { HStack, VStack } from "@chakra-ui/react";
import Logo from "components/logo";
import TextTitle from "components/ui/text/TextTitle";

const PayStubHeader = () => (
	<HStack spacing={0} w={"70%"}>
		<Logo isCover />
		<VStack spacing={0} ml={-20}>
			<TextTitle
				color={"var(--calendar_color)"}
				size={"xs"}
				title={"THE OWNERS OF STRATA CORPORATION NW1378"}
			/>
			<TextTitle
				color={"var(--calendar_color)"}
				size={"xs"}
				title={"3601 NICO WYND DRIVE SURREY BC V4P 1J1"}
			/>
		</VStack>
	</HStack>
);

export default PayStubHeader;
