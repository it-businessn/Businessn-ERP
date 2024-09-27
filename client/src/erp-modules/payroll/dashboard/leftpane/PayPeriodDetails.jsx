import { HStack, VStack } from "@chakra-ui/react";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";

const PayPeriodDetails = () => {
	return (
		<VStack spacing={3} alignItems={"start"}>
			<HStack w={"100%"} justifyContent={"space-between"} alignItems={"start"}>
				<TextTitle title={"Employees"} />
				<VStack>
					<TextTitle align="end" title={"March 2024 (03/2024)"} />
					<NormalTextTitle align="end" title={"0 Payslips"} />
				</VStack>
			</HStack>
			<HStack w={"100%"} justifyContent={"space-between"} alignItems={"start"}>
				<TextTitle title={"Vacations"} />
				<VStack>
					<TextTitle align="end" title={"March 2024 (03/2024)"} />
					<NormalTextTitle align="end" title={"0 Payslips"} />
				</VStack>
			</HStack>
		</VStack>
	);
};

export default PayPeriodDetails;
