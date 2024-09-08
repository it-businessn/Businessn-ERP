import { HStack, Image, VStack } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import payStubLogo from "../../../../assets/logos/BusinessN_lightLogo.jpg";

const PayStubHeader = () => (
	<HStack justifyContent={"space-between"}>
		<Image
			objectFit="cover"
			height={"50px"}
			w={"280px"}
			src={payStubLogo}
			alt="Company logo"
		/>
		<VStack spacing={0} align={"end"}>
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
		<TextTitle
			width="50%"
			align={"center"}
			color={"var(--nav_color)"}
			size={"lg"}
			title={"EARNINGS STATEMENT"}
		/>
	</HStack>
);

export default PayStubHeader;
