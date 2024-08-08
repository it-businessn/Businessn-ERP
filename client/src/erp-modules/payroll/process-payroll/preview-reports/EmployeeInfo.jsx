import { HStack, VStack } from "@chakra-ui/react";
import Logo from "components/logo";
import TextTitle from "components/ui/text/TextTitle";

const EmployeeInfo = ({ employee }) => {
	console.log(employee);
	return (
		<VStack
			spacing={1}
			textAlign={"center"}
			alignItems="center"
			bg={"var(--primary_bg)"}
			py={5}
			h={"76vh"}
			w={"38%"}
		>
			<Logo isCover isForgotPassword />
			<TextTitle size={"xl"} title={employee.empId.fullName} />
			<HStack w={"70%"} mt={5}>
				<TextTitle align="left" title={"Net Pay:"} size={"lg"} />
				<TextTitle align="right" title={"employee?.netPay"} size={"lg"} />
			</HStack>
			<HStack w={"70%"}>
				<TextTitle align="left" title={"Pay Date:"} size={"lg"} />
				<TextTitle align="right" title={"employee?.netPay"} size={"lg"} />
			</HStack>
			<HStack w={"70%"} mt={12}>
				<TextTitle align="left" title={"Employee#:"} size={"lg"} />
				<TextTitle align="right" title={"employee?.netPay"} size={"lg"} />
			</HStack>
			<HStack w={"70%"}>
				<TextTitle align="left" title={"Company#:"} size={"lg"} />
				<TextTitle align="right" title={"employee?.netPay"} size={"lg"} />
			</HStack>
			<HStack w={"70%"} mt={8}>
				<TextTitle align="left" title={"Pay Period #:"} size={"lg"} />
				<TextTitle align="right" title={"employee?.netPay"} size={"lg"} />
			</HStack>
			<HStack w={"70%"}>
				<TextTitle align="center" title={"Company#:"} size={"lg"} />
			</HStack>
		</VStack>
	);
};

export default EmployeeInfo;
