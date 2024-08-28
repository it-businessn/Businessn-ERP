import { Box, HStack } from "@chakra-ui/react";

import payStubImg from "../../../../assets/coverImgPaystub.png";
import EmployeeInfo from "../preview-reports/EmployeeInfo";
import EmployeePayDetails from "../preview-reports/EmployeePayDetails";
import ChequeDetails from "./ChequeDetails";
import PayStubHeader from "./PayStubHeader";

const PayStubStatement = ({ data }) => (
	<Box w={"100%"} overflow={"hidden"}>
		<PayStubHeader />
		<Box position="relative" padding={0}>
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
			<HStack alignItems={"start"} spacing={5} p={6}>
				<EmployeeInfo data={data} />
				<EmployeePayDetails data={data} />
			</HStack>
		</Box>
		<ChequeDetails data={data} />
	</Box>
);
export default PayStubStatement;
