import { HStack, Image, VStack } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import LocalStorageService from "services/LocalStorageService";
import { getFormattedAddress } from "utils/common";
import payStubLogo from "../../../../assets/logos/BusinessN_lightLogo.jpg";

const PayStubHeader = ({ companyInfo, flex, isMobile }) => {
	const companyDetails = companyInfo || LocalStorageService.getItem("user")?.companyId;
	return (
		<HStack justifyContent={"space-between"} flex={flex}>
			<Image objectFit="cover" height={"50px"} w={"100%"} src={payStubLogo} alt="Company logo" />
			{!isMobile && (
				<>
					<VStack spacing={0} align={"end"} ml={-4}>
						<TextTitle color={"var(--main_color_black)"} size={"sm"} title={companyDetails?.name} />
						<TextTitle
							color={"var(--main_color_black)"}
							size={"xs"}
							whiteSpace="wrap"
							title={getFormattedAddress(companyDetails?.address)}
						/>
					</VStack>
					<TextTitle
						align={"center"}
						color={"var(--nav_color)"}
						size={"lg"}
						title={"EARNINGS STATEMENT"}
					/>
				</>
			)}
		</HStack>
	);
};

export default PayStubHeader;
