import { Box, HStack, VStack } from "@chakra-ui/react";

import payStubImg from "../../../../assets/coverImgPaystub.png";
import ChequeDetails from "./ChequeDetails";
import EmployeeInfo from "./EmployeeInfo";
import EmployeePayDetails from "./EmployeePayDetails";
import PayStubHeader from "./PayStubHeader";

const PayStubStatement = ({ data }) => (
	<VStack spacing={0} w={"100%"}>
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
			<HStack alignItems={"start"} spacing={3} p={6}>
				<EmployeeInfo data={data} />
				<EmployeePayDetails data={data} />
			</HStack>
		</Box>
		<ChequeDetails data={data} />
	</VStack>
);

export default PayStubStatement;
