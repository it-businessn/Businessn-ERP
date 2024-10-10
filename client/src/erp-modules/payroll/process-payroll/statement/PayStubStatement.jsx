import { Box, HStack, Stack } from "@chakra-ui/react";

import LocalStorageService from "services/LocalStorageService";
import payStubImg from "../../../../assets/coverImgPaystub.png";
import EmployeeInfo from "../preview-reports/EmployeeInfo";
import EmployeePayDetails from "../preview-reports/EmployeePayDetails";
import ChequeDetails from "./ChequeDetails";
import PayStubHeader from "./PayStubHeader";

const PayStubStatement = ({ data }) => {
	const companyNum =
		LocalStorageService.getItem("user")?.companyId?.registration_number;

	return (
		<Box w={"100%"} overflow={"hidden"}>
			<PayStubHeader />
			<Stack
				position="relative"
				padding={0}
				h={"calc(92vh - 17em)"}
				alignItems={"center"}
				spacing={2}
			>
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
				<HStack alignItems={"start"} spacing={5} p={5}>
					<EmployeeInfo data={data} companyNum={companyNum} />
					<EmployeePayDetails data={data} />
				</HStack>
			</Stack>
			<ChequeDetails data={data} />
		</Box>
	);
};
export default PayStubStatement;
