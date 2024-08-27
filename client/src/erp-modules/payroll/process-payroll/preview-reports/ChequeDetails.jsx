import { Box, HStack, VStack } from "@chakra-ui/react";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import { getAmount, monthDayYearFormat, toWords } from "utils";
import PayStubHeader from "./PayStubHeader";

const PaymentDateTitle = ({ payDate }) => (
	<TextTitle
		align={"right"}
		title={`Payment Date: ${monthDayYearFormat(payDate)}`}
		size={"xs"}
	/>
);

const InfoText = ({ title1, title2, title3, hasBg }) => (
	<HStack w={"100%"}>
		<NormalTextTitle width="30%" whiteSpace="wrap" title={title1} size={"xs"} />
		<TextTitle
			bg={hasBg && "var(--calendar_border)"}
			p={hasBg && 1}
			border={hasBg && "1px solid var(--main_color_black)"}
			whiteSpace="wrap"
			title={title2}
			size={"xs"}
			align={"left"}
		/>
		<TextTitle align={"left"} whiteSpace="wrap" title={title3} size={"xs"} />
	</HStack>
);

const ChequeDetails = ({ data }) => {
	const name = data.empId.fullName;
	const payDate = data.payPeriodPayDate;
	const netPay = getAmount(data.currentNetPay);
	const amountInWords = toWords.convert(data.currentNetPay);

	return (
		<VStack spacing={5} w={"100%"}>
			<PayStubHeader />
			<Box w={"100%"}>
				<PaymentDateTitle payDate={payDate} />
				<InfoText title1="Account holder:" title2={name} />
				<InfoText
					title1="The amount:"
					title2={amountInWords}
					title3={netPay}
					hasBg
				/>
				<InfoText title1="Payment method:" title2={"DIRECT DEPOSIT"} />
			</Box>
			<TextTitle
				align={"center"}
				color={"var(--filter_border_color)"}
				title={" THIS IS NOT A CHEQUE. DO NOT DEPOSIT."}
			/>
		</VStack>
	);
};

export default ChequeDetails;
