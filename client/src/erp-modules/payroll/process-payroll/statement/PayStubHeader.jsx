import { HStack, Image, VStack } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import payStubLogo from "../../../../assets/logos/BusinessN_light.jpg";

const PayStubHeader = () => (
	<HStack justifyContent={"start"} w={"100%"}>
		<Image
			height={"70px"}
			w={"250px"}
			objectFit="cover"
			src={payStubLogo}
			alt="Company logo"
		/>
		<VStack spacing={0}>
			<TextTitle
				color={"var(--main_color_black)"}
				size={"xs"}
				title={"THE OWNERS OF STRATA CORPORATION NW1378"}
			/>
			<TextTitle
				color={"var(--main_color_black)"}
				size={"xs"}
				title={"3601 NICO WYND DRIVE SURREY BC V4P 1J1"}
			/>
		</VStack>
	</HStack>
);

export default PayStubHeader;
