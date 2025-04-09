import { Box, HStack, Stack } from "@chakra-ui/react";

import LocalStorageService from "services/LocalStorageService";
import payStubImg from "../../../../assets/coverImgPaystub.png";
import EmployeeInfo from "../preview-reports/EmployeeInfo";
import EmployeePayDetails from "../preview-reports/EmployeePayDetails";
import ChequeDetails from "./ChequeDetails";
import MobilePayStub from "./MobilePayStub";
import PayStubHeader from "./PayStubHeader";

const PayStubStatement = ({ data, height, overflow = "hidden", isMobile }) => {
	const companyInfo = LocalStorageService.getItem("user")?.companyId;
	return isMobile ? (
		<MobilePayStub companyInfo={companyInfo} reportData={data} />
	) : (
		<Box
			w={"100%"}
			flexDir="column"
			display="flex"
			overflow={overflow}
			height={height}
			justifyContent="space-between"
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
