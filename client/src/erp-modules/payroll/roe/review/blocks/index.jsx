import {
	Box,
	Checkbox,
	HStack,
	Stack,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	VStack,
} from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";

export const Block1 = () => {
	return (
		<Box flex={0.5} pl={1} border="1px solid" borderRight={0}>
			1 SERIAL NO.
		</Box>
	);
};

export const Block2 = () => {
	return (
		<Box flex={1} pl={1} border="1px solid" borderRight={0}>
			2 SERIAL NO. OF ROE AMENDED OR REPLACED
		</Box>
	);
};

export const Block3 = ({ refNum }) => {
	return (
		<VStack alignItems={"start"} spacing={0.5} pl={1} flex={1} border="1px solid">
			<Text> 3 EMPLOYER'S PAYROLL REFERENCE NUMBER</Text>

			<Text pl={2} h={!refNum && "15px"}>
				{refNum}
			</Text>
		</VStack>
	);
};

export const Block4 = ({ companyInfo }) => {
	return (
		<Box>
			<Text borderLeft={"1px solid"} ml={"-1px"} p={1} mt={"-17px"}>
				4 EMPLOYER'S NAME AND ADDRESS
			</Text>
			<Text p={1} textTransform={"uppercase"}>
				{companyInfo?.name}
			</Text>
			<Text p={1} textTransform={"uppercase"}>
				{companyInfo?.address?.streetNumber}
			</Text>
			<Text p={1} textTransform={"uppercase"}>
				{companyInfo?.address?.city}
			</Text>
			<Text p={1} textTransform={"uppercase"}>
				{companyInfo?.address?.country}
			</Text>
		</Box>
	);
};

export const Block5 = ({ accNum }) => {
	return (
		<Box pl={1} pt={1} pb={0.95}>
			<VStack>
				<Text>5 CRA PAYROLL ACCOUNT NUMBER </Text>
				<Text> {accNum}</Text>
			</VStack>
		</Box>
	);
};

export const Block6 = ({ payPeriod }) => {
	return (
		<Box p={1} w={"100%"} borderTop={"1px solid"}>
			<VStack alignItems={"self-start"} spacing={0}>
				<Text> 6 PAY PERIOD TYPE </Text>
				<Text> {`${payPeriod?.code} - ${payPeriod?.name}`}</Text>
			</VStack>
		</Box>
	);
};

export const Block7 = ({ companyInfo }) => {
	return (
		<Box flex={0.7} borderTop="1px solid" p={1} pt={0.8} pb={0} borderLeft="1px solid">
			7 POSTAL CODE {companyInfo.address.postalCode}
		</Box>
	);
};

export const Block8 = ({ sin }) => {
	return (
		<Box w={"100%"} pl={1}>
			<HStack>
				<Text flex={0.8}>8 SOCIAL INSURANCE NUMBER </Text>
				<Text flex={0.2}> {sin} </Text>
			</HStack>
		</Box>
	);
};

export const Block9 = ({ empInfo }) => {
	return (
		<Box pl={1}>
			<Text borderLeft={"1px solid"} ml={"-1px"} p={1} mt={"-17px"}>
				9 EMPLOYEE'S NAME AND ADDRESS
			</Text>
			<Text p={1} textTransform={"uppercase"}>
				{empInfo.firstName} {empInfo.middleName} {empInfo.lastName}
			</Text>
			<Text p={1} textTransform={"uppercase"}>
				{empInfo?.streetAddressSuite} {empInfo.streetAddress}
			</Text>
			<Text p={1} textTransform={"uppercase"}>
				{empInfo.city}, {empInfo.province}
			</Text>
			<Text p={1} textTransform={"uppercase"}>
				{empInfo.country}, {empInfo.postalCode}
			</Text>
		</Box>
	);
};

export const Block10 = ({ firstDayWorked }) => {
	const day = moment.utc(firstDayWorked).date();
	const month = moment.utc(firstDayWorked).month();
	const year = moment.utc(firstDayWorked).year();
	return (
		<Box borderTop="1px solid" w={"100%"} pl={1}>
			<HStack>
				<Text flex={0.8}>10 FIRST DAY WORKED</Text>
				<HStack flex={0.2}>
					<VStack spacing={0}>
						<Text fontSize={"8px"}>D</Text>
						<Text fontSize={"8px"}>{day}</Text>
					</VStack>
					<VStack spacing={0}>
						<Text fontSize={"8px"}>m</Text>
						<Text fontSize={"8px"}>{month}</Text>
					</VStack>
					<VStack spacing={0}>
						<Text fontSize={"8px"}>y</Text>
						<Text fontSize={"8px"}>{year}</Text>
					</VStack>
				</HStack>
			</HStack>
		</Box>
	);
};

export const Block11 = ({ lastDayWorked }) => {
	const day = moment.utc(lastDayWorked).date();
	const month = moment.utc(lastDayWorked).month();
	const year = moment.utc(lastDayWorked).year();
	return (
		<Box borderTop="1px solid" w={"100%"} pl={1}>
			<HStack>
				<Text flex={0.8}>11 LAST DAY FOR WHICH PAID</Text>
				<HStack flex={0.2}>
					<VStack spacing={0}>
						<Text fontSize={"8px"}>D</Text>
						<Text fontSize={"8px"}>{day}</Text>
					</VStack>
					<VStack spacing={0}>
						<Text fontSize={"8px"}>m</Text>
						<Text fontSize={"8px"}>{month}</Text>
					</VStack>
					<VStack spacing={0}>
						<Text fontSize={"8px"}>y</Text>
						<Text fontSize={"8px"}>{year}</Text>
					</VStack>
				</HStack>
			</HStack>
		</Box>
	);
};

export const Block12 = ({ finalPayPeriodEndDate }) => {
	const day = moment.utc(finalPayPeriodEndDate).date();
	const month = moment.utc(finalPayPeriodEndDate).month();
	const year = moment.utc(finalPayPeriodEndDate).year();
	return (
		<Box borderTop="1px solid" w={"100%"} pl={1}>
			<HStack>
				<Text flex={0.8}>12 FINAL PAY PERIOD ENDING DATE</Text>
				<HStack flex={0.2}>
					<VStack spacing={0}>
						<Text fontSize={"8px"}>D</Text>
						<Text fontSize={"8px"}>{day}</Text>
					</VStack>
					<VStack spacing={0}>
						<Text fontSize={"8px"}>m</Text>
						<Text fontSize={"8px"}>{month}</Text>
					</VStack>
					<VStack spacing={0}>
						<Text fontSize={"8px"}>y</Text>
						<Text fontSize={"8px"}>{year}</Text>
					</VStack>
				</HStack>
			</HStack>
		</Box>
	);
};

export const Block13 = () => {
	return (
		<Box borderTop="1px solid" w={"100%"} pl={1}>
			13 OCCUPATION <Text>&nbsp;</Text>
		</Box>
	);
};

export const Block14 = ({ recallDate, expectedRecallDate }) => {
	const day = moment.utc(recallDate).date();
	const month = moment.utc(recallDate).month();
	const year = moment.utc(recallDate).year();

	return (
		<Box borderTop="1px solid" w={"100%"} p={1} pb={1}>
			14 EXPECTED DATE OF RECALL
			<HStack flex={0.2}>
				<VStack spacing={0}>
					<Text fontSize={"8px"}>D</Text>
					<Text fontSize={"8px"}>{day || ""}</Text>
				</VStack>
				<VStack spacing={0}>
					<Text fontSize={"8px"}>m</Text>
					<Text fontSize={"8px"}>{month || ""}</Text>
				</VStack>
				<VStack spacing={0}>
					<Text fontSize={"8px"}>y</Text>
					<Text fontSize={"8px"}>{year || ""}</Text>
				</VStack>
			</HStack>
			<Text> {expectedRecallDate}</Text>
		</Box>
	);
};

export const Block15a = ({ hours }) => {
	return (
		<Box pl={1} w={"100%"}>
			<HStack>
				<Text flex={0.6}>15a TOTAL INSURABLE HOURS ACCORDING TO CHART 565</Text>
				<Text flex={0.4}> {hours}</Text>
			</HStack>
		</Box>
	);
};

export const Block15b = ({ amt }) => {
	return (
		<Box borderTop="1px solid" w={"100%"} pl={1}>
			<HStack>
				<Text flex={0.6}>15b TOTAL INSURABLE EARNINGS ACCORDING TO CHART 3463</Text>
				<Text flex={0.4}> {amt}</Text>
			</HStack>
		</Box>
	);
};

export const Block15c = ({ earningsData, payPeriod }) => {
	const [set1, setSet1] = useState([]);
	const [set2, setSet2] = useState([]);

	useEffect(() => {
		if (earningsData?.length) {
			const evenRecords = [];
			const oddRecords = [];
			let evenIndex = 1;
			let oddIndex = 2;
			// earningsData.forEach((record, index) => {
			// 	if (index % 2 === 0) {
			// 		evenRecords.push({ ...record, newIndex: evenIndex });
			// 		evenIndex += 2;
			// 	} else {
			// 		oddRecords.push({ ...record, newIndex: oddIndex });
			// 		oddIndex += 2;
			// 	}
			// });
			// const totalPayPeriod = payPeriod.totalPayPeriod;
			const totalPayPeriod = 53;
			const createBlankRecord = (index) => {
				return {
					insurableHours: null,
					payPeriodNum: null,
					payPeriodEndDate: null,
					currentGrossPay: null,
					newIndex: index,
				};
			};
			for (let i = 0; i < totalPayPeriod; i++) {
				const record = earningsData[i];

				if (i % 2 === 0) {
					if (record) {
						evenRecords.push({ ...record, newIndex: evenIndex });
					} else {
						evenRecords.push(createBlankRecord(evenIndex));
					}
					evenIndex += 2;
				} else {
					if (record) {
						oddRecords.push({ ...record, newIndex: oddIndex });
					} else {
						oddRecords.push(createBlankRecord(oddIndex));
					}
					oddIndex += 2;
				}
			}
			setSet1(evenRecords);
			setSet2(oddRecords);
		}
	}, [earningsData]);

	return (
		<HStack w={"100%"} border="1px solid" spacing={1}>
			<Table
				variant="unstyled"
				size="sm"
				border="1px solid black"
				borderCollapse="collapse"
				flex={0.5}
				className="roe-15c"
			>
				<Thead>
					<Tr>
						<Th w={"30px"} border="1px solid black" textAlign="center">
							<VStack spacing={0}>
								<Text>15C </Text>
								<Text>PP</Text>
							</VStack>
						</Th>
						<Th
							w={"100px"}
							border="1px solid black"
							textAlign="center"
							p={0}
							px={1}
							fontSize={"10px"}
						>
							<Text whiteSpace={"pre-wrap"} textAlign={"center"}>
								PAY PERIOD ENDING DATE
							</Text>
						</Th>
						<Th
							w={"80px"}
							border="1px solid black"
							textAlign="center"
							p={0}
							px={1}
							fontSize={"10px"}
						>
							<Text whiteSpace={"pre-wrap"} textAlign={"center"}>
								INSURABLE EARNINGS
							</Text>
						</Th>
						<Th
							w={"50px"}
							border="1px solid black"
							textAlign="center"
							p={0}
							px={0.5}
							fontSize={"10px"}
						>
							<Text whiteSpace={"pre-wrap"} textAlign={"center"}>
								INSURABLE HOURS
							</Text>
						</Th>
					</Tr>
				</Thead>
				<Tbody>
					{set1?.map(
						({ payPeriodNum, payPeriodEndDate, currentGrossPay, insurableHours, newIndex }) => (
							<Tr key={`${payPeriodNum}_${newIndex}`}>
								<Td w={"30px"} border="1px solid black" textAlign="center">
									{newIndex}
								</Td>
								<Td w={"100px"} border="1px solid black" textAlign="center">
									{payPeriodEndDate && moment.utc(payPeriodEndDate).format("YYYY-MM-DD")}
								</Td>
								<Td w={"80px"} border="1px solid black" textAlign="center">
									{currentGrossPay}
								</Td>
								<Td w={"50px"} border="1px solid black" textAlign="center">
									{insurableHours}
								</Td>
							</Tr>
						),
					)}
				</Tbody>
			</Table>
			<Table
				variant="unstyled"
				size="sm"
				border="1px solid black"
				borderCollapse="collapse"
				flex={0.5}
				className="roe-15c"
			>
				<Thead>
					<Tr>
						<Th w={"30px"} border="1px solid black" textAlign="center">
							<VStack spacing={0}>
								<Text>15C </Text>
								<Text>PP</Text>
							</VStack>
						</Th>
						<Th
							w={"100px"}
							border="1px solid black"
							textAlign="center"
							p={0}
							px={1}
							fontSize={"10px"}
						>
							<Text whiteSpace={"pre-wrap"} textAlign={"center"}>
								PAY PERIOD ENDING DATE
							</Text>
						</Th>
						<Th
							w={"80px"}
							border="1px solid black"
							textAlign="center"
							p={0}
							px={1}
							fontSize={"10px"}
						>
							<Text whiteSpace={"pre-wrap"} textAlign={"center"}>
								INSURABLE EARNINGS
							</Text>
						</Th>
						<Th
							w={"50px"}
							border="1px solid black"
							textAlign="center"
							p={0}
							px={0.5}
							fontSize={"10px"}
						>
							<Text whiteSpace={"pre-wrap"} textAlign={"center"}>
								INSURABLE HOURS
							</Text>
						</Th>
					</Tr>
				</Thead>
				<Tbody>
					{set2?.map(
						({ payPeriodNum, payPeriodEndDate, currentGrossPay, insurableHours, newIndex }) => (
							<Tr key={`${payPeriodNum}_${newIndex}`}>
								<Td w={"30px"} border="1px solid black" textAlign="center">
									{newIndex}
								</Td>
								<Td w={"100px"} border="1px solid black" textAlign="center">
									{payPeriodEndDate && moment.utc(payPeriodEndDate).format("YYYY-MM-DD")}
								</Td>
								<Td w={"80px"} border="1px solid black" textAlign="center">
									{currentGrossPay}
								</Td>
								<Td w={"50px"} border="1px solid black" textAlign="center">
									{insurableHours}
								</Td>
							</Tr>
						),
					)}
				</Tbody>
			</Table>
		</HStack>
	);
};

export const Block16 = ({ reasonCode, contactName, contactNumber }) => {
	return (
		<Box borderTop="1px solid" w={"100%"} pl={1}>
			16 REASON FOR ISSUING THIS ROE <br />
			{reasonCode} <br />
			FOR FURTHER INFORMATION, CONTACT
			<br /> {contactName} <br />
			TELEPHONE NO {contactNumber}
		</Box>
	);
};

export const Block17 = ({
	vacationPayCode,
	vacationPayAmount,
	vacationPayStartDate,
	vacationPayEndDate,
	statHolidays,
	otherMonies,
}) => {
	return (
		<Box borderTop="1px solid" w={"100%"} pl={1}>
			17 SEPARATION PAYMENTS <br /> A - VACATION PAY
			<HStack pl={2}>
				<Text>{vacationPayCode}</Text>
				<Text> {vacationPayAmount}</Text>
			</HStack>
			<HStack pl={2}>
				<Text flex={0.5}>Start Date (D/M/Y):{vacationPayStartDate}</Text>
				<Text flex={0.5}> End Date (D/M/Y):{vacationPayEndDate}</Text>
			</HStack>
			B - STATUTORY HOLIDAY PAY
			<HStack h={"80px"} alignItems={"self-start"}>
				<HStack flex={0.5}>
					<VStack>
						<Text>D</Text>
						{/* <Text>D</Text> statHolidays*/}
					</VStack>
					<VStack>
						<Text>m</Text>
						{/* <Text>D</Text> */}
					</VStack>
					<VStack>
						<Text>y</Text>
						{/* <Text>D</Text> */}
					</VStack>
				</HStack>
				<HStack flex={0.5}>
					<VStack>
						<Text>D</Text>
						{/* <Text>D</Text> */}
					</VStack>
					<VStack>
						<Text>m</Text>
						{/* <Text>D</Text> */}
					</VStack>
					<VStack>
						<Text>y</Text>
						{/* <Text>D</Text> */}
					</VStack>
				</HStack>
			</HStack>
			C - OTHER MONIES (SPECIFY)
			{/* otherMonies */}
			<HStack>
				<Text flex={0.5}>Start Date (D/M/Y):</Text>
				<Text flex={0.5}>End Date (D/M/Y):</Text>
			</HStack>
			<br />
			<HStack>
				<Text flex={0.5}>Start Date (D/M/Y):</Text>
				<Text flex={0.5}>End Date (D/M/Y):</Text>
			</HStack>
			<br />
			<HStack>
				<Text flex={0.5}>Start Date (D/M/Y):</Text>
				<Text flex={0.5}>End Date (D/M/Y):</Text>
			</HStack>
		</Box>
	);
};

export const Block18 = ({ comments }) => {
	return (
		<Box borderTop="1px solid" w={"100%"} pl={1} h={"80px"}>
			18 COMMENTS
			<br /> {comments}
		</Box>
	);
};

export const Block19 = ({ specialPayments }) => {
	return (
		<Box borderTop="1px solid" w={"100%"} pl={1}>
			<HStack alignItems={"self-start"} spacing={1}>
				<Text>19</Text>
				<Text>
					PAID SICK/MATERNITY/PARENTAL/COMPASSIONATE CARE/PARENTS OF CRITICALLY ILL CHILDREN LEAVE
					OR GROUP WAGE LOSS INDEMNITY PAYMENT
				</Text>
			</HStack>
			<Table variant="unstyled" size={"sm"}>
				<Thead>
					<Tr>
						<Th w={"100px"}></Th>
						<Th p={0} px={1} fontSize={"10px"}>
							<VStack spacing={0}>
								<Text>START DATE </Text>
								<Text>(D/M/Y)</Text>
							</VStack>
						</Th>
						<Th p={0} px={1} fontSize={"10px"}>
							<VStack spacing={0}>
								<Text>END DATE </Text>
								<Text>(D/M/Y)</Text>
							</VStack>
						</Th>
						<Th p={0} px={0.5} fontSize={"10px"} w={"50px"}>
							AMOUNT &nbsp;
						</Th>
						<Th p={0} px={1} fontSize={"10px"} whiteSpace={"pre-wrap"} w={"50px"}>
							PER DAY &nbsp;&nbsp;
						</Th>
						<Th p={0} px={1} whiteSpace={"pre-wrap"} w={"50px"} fontSize={"10px"}>
							PER WEEK
						</Th>
					</Tr>
				</Thead>
				<Tbody>
					<Tr>
						<Td pt={0} fontSize={"10px"}>
							PSL
						</Td>
						<Td pt={0} fontSize={"10px"}></Td>
						<Td pt={0} fontSize={"10px"}></Td>
						<Td pt={0} fontSize={"10px"}></Td>
						<Td pt={1} fontSize={"10px"}>
							<Checkbox size={"sm"} />
						</Td>
						<Td pt={0.2} fontSize={"10px"}>
							<Checkbox size={"sm"} />
						</Td>
					</Tr>
					<Tr>
						<Td pt={0} fontSize={"10px"}>
							WLI - Not ins
						</Td>
						<Td pt={0} fontSize={"10px"}></Td>
						<Td pt={0} fontSize={"10px"}></Td>
						<Td pt={0} fontSize={"10px"}></Td>
						<Td pt={0} fontSize={"10px"}>
							<Checkbox size={"sm"} />
						</Td>
						<Td pt={0} fontSize={"10px"}>
							<Checkbox size={"sm"} />
						</Td>
					</Tr>
					<Tr>
						<Td pt={0} fontSize={"10px"}>
							PSL
						</Td>
						<Td pt={0} fontSize={"10px"}></Td>
						<Td pt={0} fontSize={"10px"}></Td>
						<Td pt={0} fontSize={"10px"}></Td>
						<Td pt={0} fontSize={"10px"}>
							<Checkbox size={"sm"} />
						</Td>
						<Td pt={0} fontSize={"10px"}>
							<Checkbox size={"sm"} />
						</Td>
					</Tr>
					<Tr>
						<Td pt={0} fontSize={"10px"}>
							WLI - Not ins
						</Td>
						<Td pt={0} fontSize={"10px"}></Td>
						<Td pt={0} fontSize={"10px"}></Td>
						<Td pt={0} fontSize={"10px"}></Td>
						<Td pt={0} fontSize={"10px"}>
							<Checkbox size={"sm"} />
						</Td>
						<Td pt={0} fontSize={"10px"}>
							<Checkbox size={"sm"} />
						</Td>
					</Tr>
				</Tbody>
			</Table>
		</Box>
	);
};

export const Block20 = ({ preferredCommunication }) => {
	return (
		<Box flex={0.5} pl={1}>
			20 COMMUNICATION PREFERRED IN
			<Stack direction="row" spacing={6}>
				<Checkbox size={"sm"} isChecked={preferredCommunication == "E"} colorScheme={"gray"}>
					English
				</Checkbox>
				<Checkbox size={"sm"} isChecked={preferredCommunication == "F"}>
					Français
				</Checkbox>
			</Stack>
		</Box>
	);
};

export const Block21 = ({ issuerTelNumber }) => {
	return (
		<Box flex={0.5} borderLeft="1px solid" pl={1}>
			21 TELEPHONE NO <br />
			{issuerTelNumber}
		</Box>
	);
};

export const Block22 = ({ issuerName, dateIssued }) => {
	return (
		<Box borderTop="1px solid" w={"100%"} pl={1}>
			22 NAME OF ISSUER
			<Text pl={5}> {issuerName}</Text>
			<Text pl={1}> DATE ISSUED (D/M/Y){dateIssued}</Text>
		</Box>
	);
};
