import { Box, HStack, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from "@chakra-ui/react";
import { dmy, maskSIN } from "../../roeUtils";

// ROE-01: the blocks of the Service Canada ROE, laid out as on the printed
// form (review tab and print copy). Dates are D / M / Y with the month 1-12.

/** A printed check box (prints the same everywhere, unlike a form control). */
const Tick = ({ checked, label }) => (
	<HStack spacing={1}>
		<Box
			w="10px"
			h="10px"
			border="1px solid black"
			fontSize="9px"
			lineHeight="9px"
			textAlign="center"
			fontWeight="bold"
			role="img"
			aria-label={`${label || "box"} ${checked ? "checked" : "not checked"}`}
		>
			{checked ? "X" : ""}
		</Box>
		{label && <Text>{label}</Text>}
	</HStack>
);

const num2 = (v) => (v === null || v === undefined || v === "" ? "" : Number(v).toFixed(2));

/** D M Y date as on the form. */
export const DateDMY = ({ date }) => {
	const { day, month, year } = dmy(date);
	return (
		<HStack spacing={2} fontSize="9px" lineHeight={1.1}>
			{[
				["D", day],
				["M", month],
				["Y", year],
			].map(([label, value]) => (
				<VStack key={label} spacing={0} minW="18px">
					<Text fontSize="8px">{label}</Text>
					<Text>{value || " "}</Text>
				</VStack>
			))}
		</HStack>
	);
};

const DateRow = ({ label, date }) => (
	<Box borderTop="1px solid" w="100%" pl={1}>
		<HStack justify="space-between" pr={1}>
			<Text>{label}</Text>
			<DateDMY date={date} />
		</HStack>
	</Box>
);

export const Block1 = () => (
	<Box flex={0.5} pl={1} border="1px solid" borderRight={0}>
		1 SERIAL NO.
	</Box>
);

export const Block2 = () => (
	<Box flex={1} pl={1} border="1px solid" borderRight={0}>
		2 SERIAL NO. OF ROE AMENDED OR REPLACED
	</Box>
);

export const Block3 = ({ refNum }) => (
	<VStack alignItems="start" spacing={0.5} pl={1} flex={1} border="1px solid">
		<Text>3 EMPLOYER'S PAYROLL REFERENCE NUMBER</Text>
		<Text pl={2} minH="15px">
			{refNum}
		</Text>
	</VStack>
);

export const Block4 = ({ companyInfo }) => {
	const a = companyInfo?.address || {};
	return (
		<Box>
			<Text borderLeft="1px solid" ml="-1px" p={1} mt="-17px">
				4 EMPLOYER'S NAME AND ADDRESS
			</Text>
			{[companyInfo?.name, [a.streetNumber, a.streetName].filter(Boolean).join(" "), a.city, a.state]
				.filter(Boolean)
				.map((line) => (
					<Text key={line} p={1} textTransform="uppercase">
						{line}
					</Text>
				))}
		</Box>
	);
};

export const Block5 = ({ accNum }) => (
	<Box pl={1} pt={1} pb={1} w="100%">
		<Text>5 CRA PAYROLL ACCOUNT NUMBER</Text>
		<Text pl={2}>{accNum}</Text>
	</Box>
);

export const Block6 = ({ payPeriod }) => (
	<Box p={1} w="100%" borderTop="1px solid">
		<Text>6 PAY PERIOD TYPE</Text>
		<Text pl={2}>{payPeriod ? `${payPeriod.code} - ${payPeriod.name}` : ""}</Text>
	</Box>
);

export const Block7 = ({ companyInfo }) => (
	<Box flex={0.7} borderTop="1px solid" p={1} pt={0.8} pb={0} borderLeft="1px solid">
		7 POSTAL CODE {companyInfo?.address?.postalCode || ""}
	</Box>
);

export const Block8 = ({ sin }) => (
	<Box w="100%" pl={1}>
		<HStack justify="space-between" pr={1}>
			<Text>8 SOCIAL INSURANCE NUMBER</Text>
			<Text>{maskSIN(sin)}</Text>
		</HStack>
	</Box>
);

export const Block9 = ({ empInfo }) => (
	<Box pl={1}>
		<Text borderLeft="1px solid" ml="-1px" p={1} mt="-17px">
			9 EMPLOYEE'S NAME AND ADDRESS
		</Text>
		{[
			[empInfo?.firstName, empInfo?.middleName, empInfo?.lastName].filter(Boolean).join(" "),
			[empInfo?.streetAddressSuite, empInfo?.streetAddress].filter(Boolean).join(" "),
			[empInfo?.city, empInfo?.province, empInfo?.postalCode].filter(Boolean).join(", "),
		]
			.filter(Boolean)
			.map((line) => (
				<Text key={line} p={1} textTransform="uppercase">
					{line}
				</Text>
			))}
	</Box>
);

export const Block10 = ({ firstDayWorked }) => (
	<DateRow label="10 FIRST DAY WORKED" date={firstDayWorked} />
);

export const Block11 = ({ lastDayWorked }) => (
	<DateRow label="11 LAST DAY FOR WHICH PAID" date={lastDayWorked} />
);

export const Block12 = ({ finalPayPeriodEndDate }) => (
	<DateRow label="12 FINAL PAY PERIOD ENDING DATE" date={finalPayPeriodEndDate} />
);

export const Block13 = ({ occupation }) => (
	<Box borderTop="1px solid" w="100%" pl={1}>
		13 OCCUPATION
		<Text pl={2} minH="15px" textTransform="uppercase">
			{occupation}
		</Text>
	</Box>
);

export const Block14 = ({ recallDate, expectedRecallDate }) => {
	const returning = String(expectedRecallDate || "").startsWith("Y");
	return (
		<Box borderTop="1px solid" w="100%" p={1}>
			<Text>14 EXPECTED DATE OF RECALL</Text>
			<HStack justify="space-between">
				<Text>{expectedRecallDate}</Text>
				{returning && <DateDMY date={recallDate} />}
			</HStack>
		</Box>
	);
};

export const Block15a = ({ hours }) => (
	<Box pl={1} w="100%">
		<HStack justify="space-between" pr={2}>
			<Text>15A TOTAL INSURABLE HOURS ACCORDING TO CHART</Text>
			<Text fontWeight="bold">{num2(hours)}</Text>
		</HStack>
	</Box>
);

export const Block15b = ({ amt }) => (
	<Box borderTop="1px solid" w="100%" pl={1}>
		<HStack justify="space-between" pr={2}>
			<Text>15B TOTAL INSURABLE EARNINGS ACCORDING TO CHART</Text>
			<Text fontWeight="bold">{num2(amt)}</Text>
		</HStack>
	</Box>
);

const HeadCell = ({ children, w }) => (
	<Th w={w} border="1px solid black" textAlign="center" p={0} px={1} fontSize="8px">
		<Text whiteSpace="pre-wrap" textAlign="center">
			{children}
		</Text>
	</Th>
);

const Column15c = ({ rows }) => (
	<Table variant="unstyled" size="sm" borderCollapse="collapse" flex={0.5} className="roe-15c">
		<Thead>
			<Tr>
				<HeadCell w="30px">PP</HeadCell>
				<HeadCell w="90px">PAY PERIOD ENDING DATE</HeadCell>
				<HeadCell w="80px">INSURABLE EARNINGS</HeadCell>
				<HeadCell w="50px">INSURABLE HOURS</HeadCell>
			</Tr>
		</Thead>
		<Tbody>
			{rows.map(({ roePP, payPeriodEndDate, currentGrossPay, insurableHours }) => (
				<Tr key={roePP}>
					<Td border="1px solid black" textAlign="center">
						{roePP}
					</Td>
					<Td border="1px solid black">
						{payPeriodEndDate ? <DateDMY date={payPeriodEndDate} /> : " "}
					</Td>
					<Td border="1px solid black" textAlign="right">
						{num2(currentGrossPay)}
					</Td>
					<Td border="1px solid black" textAlign="right">
						{num2(insurableHours)}
					</Td>
				</Tr>
			))}
		</Tbody>
	</Table>
);

/** Block 15C: ROE PP 1 = final pay period; odd numbers left, even right. */
export const Block15c = ({ earningsData, payPeriod }) => {
	const periods = earningsData || [];
	// blank rows up to the number of periods the pay period type reports
	const total = Math.max(periods.length, payPeriod?.maxPeriods || 27);
	const rows = Array.from({ length: total }, (_, i) => ({ ...periods[i], roePP: i + 1 }));
	return (
		<Stack w="100%" spacing={0}>
			<Text pl={1}>15C INSURABLE EARNINGS BY PAY PERIOD</Text>
			<HStack w="100%" spacing={1} align="start">
				<Column15c rows={rows.filter((_, i) => i % 2 === 0)} />
				<Column15c rows={rows.filter((_, i) => i % 2 === 1)} />
			</HStack>
		</Stack>
	);
};

export const Block16 = ({ reasonCode, contactName, contactNumber, contactExt }) => (
	<Box borderTop="1px solid" w="100%" pl={1}>
		<Text>16 REASON FOR ISSUING THIS ROE</Text>
		<Text pl={2}>{reasonCode}</Text>
		<Text>FOR FURTHER INFORMATION, CONTACT</Text>
		<Text pl={2}>{contactName}</Text>
		<Text>
			TELEPHONE NO. {contactNumber}
			{contactExt ? ` EXT. ${contactExt}` : ""}
		</Text>
	</Box>
);

const filled = (rows, key) => (rows || []).filter((r) => r?.[key]);

export const Block17 = ({
	vacationPayCode,
	vacationPayAmount,
	vacationPayStartDate,
	vacationPayEndDate,
	statHolidays,
	otherMonies,
}) => (
	<Box borderTop="1px solid" w="100%" pl={1} pr={1}>
		<Text>17 SEPARATION PAYMENTS</Text>
		<Text>A - VACATION PAY</Text>
		<HStack pl={2} justify="space-between">
			<Text>{vacationPayCode}</Text>
			<Text>{num2(vacationPayAmount || "")}</Text>
		</HStack>
		{(vacationPayStartDate || vacationPayEndDate) && (
			<HStack pl={2} justify="space-between">
				<HStack>
					<Text>Start Date</Text>
					<DateDMY date={vacationPayStartDate} />
				</HStack>
				<HStack>
					<Text>End Date</Text>
					<DateDMY date={vacationPayEndDate} />
				</HStack>
			</HStack>
		)}
		<Text>B - STATUTORY HOLIDAY PAY</Text>
		<Stack pl={2} spacing={0} minH="30px">
			{filled(statHolidays, "date").map((sh) => (
				<HStack key={sh.date} justify="space-between">
					<DateDMY date={sh.date} />
					<Text>{num2(sh.amount)}</Text>
				</HStack>
			))}
		</Stack>
		<Text>C - OTHER MONIES (SPECIFY)</Text>
		<Stack pl={2} spacing={0} minH="30px">
			{filled(otherMonies, "code").map((om) => (
				<HStack key={`${om.code}_${om.startDate}`} justify="space-between">
					<Text>{om.code}</Text>
					{om.startDate && <DateDMY date={om.startDate} />}
					{om.endDate && <DateDMY date={om.endDate} />}
					<Text>{num2(om.amount)}</Text>
				</HStack>
			))}
		</Stack>
	</Box>
);

export const Block18 = ({ comments }) => (
	<Box borderTop="1px solid" w="100%" pl={1} minH="60px">
		18 COMMENTS
		<Text pl={2} whiteSpace="pre-wrap">
			{comments}
		</Text>
	</Box>
);

export const Block19 = ({ specialPayments }) => (
	<Box borderTop="1px solid" w="100%" pl={1}>
		<Text>
			19 PAID SICK/MATERNITY/PARENTAL/COMPASSIONATE CARE/PARENTS OF CRITICALLY ILL CHILDREN LEAVE OR
			GROUP WAGE LOSS INDEMNITY PAYMENT
		</Text>
		<Table variant="unstyled" size="sm">
			<Thead>
				<Tr>
					{["", "START DATE", "END DATE", "AMOUNT", "PER DAY", "PER WEEK"].map((h) => (
						<Th key={h || "code"} p={0} px={1} fontSize="8px">
							{h}
						</Th>
					))}
				</Tr>
			</Thead>
			<Tbody>
				{filled(specialPayments, "code").map((sp) => (
					<Tr key={`${sp.code}_${sp.startDate}`}>
						<Td p={0} px={1}>
							{sp.code}
						</Td>
						<Td p={0} px={1}>
							{sp.startDate && <DateDMY date={sp.startDate} />}
						</Td>
						<Td p={0} px={1}>
							{sp.endDate && <DateDMY date={sp.endDate} />}
						</Td>
						<Td p={0} px={1}>
							{num2(sp.amount)}
						</Td>
						<Td p={0} px={1}>
							<Tick checked={sp.period === "D"} />
						</Td>
						<Td p={0} px={1}>
							<Tick checked={sp.period === "W"} />
						</Td>
					</Tr>
				))}
			</Tbody>
		</Table>
	</Box>
);

export const Block20 = ({ preferredCommunication }) => (
	<Box flex={0.5} pl={1}>
		20 COMMUNICATION PREFERRED IN
		<Stack direction="row" spacing={6}>
			<Tick checked={(preferredCommunication || "E") === "E"} label="English" />
			<Tick checked={preferredCommunication === "F"} label="Français" />
		</Stack>
	</Box>
);

export const Block21 = ({ issuerTelNumber, issuerExt }) => (
	<Box flex={0.5} borderLeft="1px solid" pl={1}>
		21 TELEPHONE NO.
		<Text pl={2}>
			{issuerTelNumber}
			{issuerExt ? ` EXT. ${issuerExt}` : ""}
		</Text>
	</Box>
);

export const Block22 = ({ issuerName, dateIssued }) => (
	<Box borderTop="1px solid" w="100%" pl={1}>
		<HStack justify="space-between" pr={1}>
			<Box>
				22 NAME OF ISSUER
				<Text pl={2} textTransform="uppercase">
					{issuerName}
				</Text>
			</Box>
			<HStack>
				<Text>DATE ISSUED</Text>
				<DateDMY date={dateIssued} />
			</HStack>
		</HStack>
	</Box>
);
