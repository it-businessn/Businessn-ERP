import { Box, HStack, Stack } from "@chakra-ui/react";

import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import LocalStorageService from "services/LocalStorageService";
import payStubImg from "../../../../assets/coverImgPaystub.png";
import EmployeeInfo from "../preview-reports/EmployeeInfo";
import EmployeePayDetails from "../preview-reports/EmployeePayDetails";
import ChequeDetails from "./ChequeDetails";
import PayStubHeader from "./PayStubHeader";

// *****DO NOT CHANGE CSS OR DESIGN STYLE ****
const PayStubStatement = ({ data, height, overflow = "hidden" }) => {
	const companyInfo = LocalStorageService.getItem("user")?.companyId;
	return (
		<Box
			w="auto"
			flexDir="column"
			display="flex"
			overflow={overflow}
			height={height}
			justifyContent="space-between"
			css={tabScrollCss}
		>
			<PayStubHeader flex={0.1} companyInfo={companyInfo} />
			<Stack alignItems="center" flex={1} position={"relative"}>
				<Box
					w={"100%"}
					h={"100%"}
					top={0}
					left={0}
					position={"absolute"}
					backgroundImage={payStubImg}
					backgroundSize="contain"
					backgroundPosition="center"
					backgroundColor="var(--lead_cards_border)"
					backgroundBlendMode="overlay"
					filter={"opacity(0.2)"}
				/>
				<HStack alignItems="start" spacing={3}>
					<EmployeeInfo data={data} companyNum={companyInfo?.registration_number} />
					<EmployeePayDetails data={data} />
				</HStack>
			</Stack>
			<ChequeDetails data={data} companyInfo={companyInfo} />
		</Box>
	);
};
export default PayStubStatement;
