import { HStack, Image, VStack } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import payStubLogo from "../../../../assets/logos/BusinessN_lightLogo.jpg";

const PayStubHeader = ({ companyInfo, flex }) => {
	const { address, name } = companyInfo;
	const { city, state, streetNumber, postalCode, country } = address;
	return (
		<HStack justifyContent={"space-between"} flex={flex}>
			<Image objectFit="cover" height={"50px"} w={"100%"} src={payStubLogo} alt="Company logo" />
			<VStack spacing={0} align={"end"} ml={-4}>
				<TextTitle color={"var(--main_color_black)"} size={"sm"} title={name} />
				<TextTitle
					color={"var(--main_color_black)"}
					size={"xs"}
					title={`${streetNumber} ${city} ${state} ${country} ${postalCode}`}
				/>
			</VStack>
			<TextTitle
				align={"center"}
				color={"var(--nav_color)"}
				size={"lg"}
				title={"EARNINGS STATEMENT"}
			/>
		</HStack>
	);
};

export default PayStubHeader;
