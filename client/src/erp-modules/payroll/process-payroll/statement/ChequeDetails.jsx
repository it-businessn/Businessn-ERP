import { Box, HStack, Stack } from "@chakra-ui/react";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import { toWords } from "utils";
import { getAmount } from "utils/convertAmt";
import { monthDayYearFormat } from "utils/convertDate";
import PayStubHeader from "./PayStubHeader";

const PaymentDateTitle = ({ payDate }) => (
	<TextTitle
		p="0 2em"
		align="right"
		title={`Payment Date: ${monthDayYearFormat(payDate)}`}
		size={"xs"}
	/>
);

const InfoText = ({ title1, title2, title3, hasBg }) => (
	<HStack w={"100%"}>
		<NormalTextTitle width={"200px"} title={title1} size={"xs"} />
		<TextTitle
			width={"100%"}
			bg={hasBg && "var(--calendar_border)"}
			p={hasBg && 1}
			border={hasBg && "1px solid var(--main_color_black)"}
			whiteSpace="wrap"
			title={title2}
			size={"xs"}
			align={"left"}
		/>
		<TextTitle align={"left"} width={"300px"} title={title3} size={"xs"} />
	</HStack>
);

const ChequeDetails = ({ data, companyInfo }) => {
	const name = data?.empId?.fullName;
	const payDate = data.payPeriodPayDate;

	const isSuperficialType = data?.reportType === "4";
	const isManualType = data?.reportType === "3";

	data.currentNetPay = isSuperficialType ? 0 : data.currentNetPay;
	const paymentType = isManualType ? "Manual" : "DIRECT DEPOSIT";

	const netPay = getAmount(data.currentNetPay);
	const amountInWords = toWords.convert(data.currentNetPay);

	return (
		<Stack w={"100%"} mt={5} h={"16em"} justifyContent={"space-between"}>
			<PayStubHeader companyInfo={companyInfo} />
			<Box w={"100%"} pl={5}>
				<PaymentDateTitle payDate={payDate} />
				<InfoText title1="Account holder:" title2={name} />
				<InfoText title1="The amount:" title2={amountInWords} title3={netPay} hasBg />
				<InfoText title1="Payment method:" title2={paymentType} />
			</Box>
			<TextTitle
				align={"center"}
				color={"var(--filter_border_color)"}
				title={"THIS IS NOT A CHEQUE. DO NOT DEPOSIT."}
			/>
		</Stack>
	);
};

export default ChequeDetails;
