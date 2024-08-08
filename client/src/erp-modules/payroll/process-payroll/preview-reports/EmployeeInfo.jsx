import { HStack, VStack } from "@chakra-ui/react";
import Logo from "components/logo";
import TextTitle from "components/ui/text/TextTitle";
import { formatDateBar } from "utils";

const EmployeeInfo = ({ employee: data, closestRecord }) => {
	const { payPeriodPayDate, payPeriod, payPeriodStartDate, payPeriodEndDate } =
		closestRecord;
	return (
		<VStack
			spacing={1}
			textAlign={"center"}
			alignItems="center"
			bg={"var(--primary_bg)"}
			py={5}
			h={"76vh"}
			w={"30%"}
		>
			<Logo isCover isForgotPassword />
			<TextTitle size={"xl"} title={data.empId.fullName} />
			<HStack w={"70%"} mt={5}>
				<TextTitle align="left" title={"Net Pay:"} size={"lg"} />
				<TextTitle
					align="right"
					title={`$${data.inputsTotal.currentNetPay.toFixed(2)}`}
					size={"lg"}
				/>
			</HStack>
			<HStack w={"70%"}>
				<TextTitle align="left" title={"Pay Date:"} size={"lg"} />
				<TextTitle
					align="right"
					title={formatDateBar(payPeriodPayDate)}
					size={"lg"}
				/>
			</HStack>
			<HStack w={"70%"} mt={12}>
				<TextTitle align="left" title={"Employee#:"} size={"lg"} />
				<TextTitle align="right" title={data.empId.employeeId} size={"lg"} />
			</HStack>
			<HStack w={"70%"}>
				<TextTitle align="left" title={"Company#:"} size={"lg"} />
				<TextTitle align="right" title={"NA"} size={"lg"} />
			</HStack>
			<HStack w={"70%"} mt={8}>
				<TextTitle
					align="left"
					title={"Pay Period #:"}
					size={"lg"}
					weight="normal"
				/>
				<TextTitle
					align="right"
					weight="normal"
					title={payPeriod}
					size={"lg"}
				/>
			</HStack>
			<HStack w={"70%"}>
				<TextTitle
					weight="normal"
					align="center"
					title={`${formatDateBar(payPeriodStartDate)} - ${formatDateBar(
						payPeriodEndDate,
					)}`}
					size={"lg"}
				/>
			</HStack>
		</VStack>
	);
};

export default EmployeeInfo;
