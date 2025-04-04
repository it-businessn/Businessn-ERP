import { Box, HStack, Stack } from "@chakra-ui/react";

import LocalStorageService from "services/LocalStorageService";
import payStubImg from "../../../../assets/coverImgPaystub.png";
import EmployeeInfo from "../preview-reports/EmployeeInfo";
import EmployeePayDetails from "../preview-reports/EmployeePayDetails";
import ChequeDetails from "./ChequeDetails";
import PayStubHeader from "./PayStubHeader";

const PayStubStatement = ({ data, height, overflow = "hidden" }) => {
	const companyInfo = LocalStorageService.getItem("user")?.companyId;

	return (
		<Box w={"100%"} overflow={overflow} height={height}>
			<PayStubHeader companyInfo={companyInfo} />
			<Stack position="relative" alignItems="center" spacing={2}>
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
