import {
	Box,
	Flex,
	IconButton,
	Image,
	SimpleGrid,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import flag from "../../assets/world.png";

export default function ROEFromXML() {
	const componentRef = useRef();
	const [isPrintDisabled, setIsPrintDisabled] = useState(false);
	const [reportFileName, setReportFileName] = useState(null);
	const employee = {
		uniqueIdentifier: "SADP",
		employerName: "THE OWNERS OF STRATA CORPORATION NW1378",
		employerAddress: "3601 NICO WYND DRIVE",
		city: "SURREY",
		province: "BC",
		craPayroll: "126166701RP0001",
		sin: "XXX XX9 822",
		firstDay: "16-04-2025",
		lastDay: "24-08-2025",
		finalPayPeriod: "24-08-2025",
		payPeriodType: "B - Bi-weekly",
		name: "test",
		address: "2972 Chantrell Place, Surrey, BC V4P 1V2",
		occupation: "Unknown",
		payPeriods: [
			{ pp: 1, endingDate: "24-08-2025", earnings: 1437.52, hours: 68.75 },
			{ pp: 2, endingDate: "10-08-2025", earnings: 956.36, hours: 50.25 },
			{ pp: 3, endingDate: "27-07-2025", earnings: 1142.59, hours: 59.23 },
			{ pp: 4, endingDate: "13-07-2025", earnings: 1014.7, hours: 52.94 },
			{ pp: 5, endingDate: "26-06-2025", earnings: 918.3, hours: 47.5 },
		],
	};
	useEffect(() => {
		setReportFileName("asf");
	}, []);
	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
		onBeforeGetContent: () => {
			document.title = reportFileName;
		},
	});

	const handleClick = () => {
		// setIsPrintDisabled(true);
		setTimeout(() => handlePrint(), 1000);
	};
	return (
		<>
			<IconButton
				size={"lg"}
				icon={<FaPrint />}
				aria-label="Print"
				variant="round"
				onClick={handleClick}
				// isDisabled={isPrintDisabled}
			/>
			<Box
				ref={componentRef}
				position="relative"
				p={4}
				mx="auto"
				borderWidth="1px"
				borderColor="gray.800"
				bg="white"
				fontFamily="sans-serif"
				fontSize="xs"
				h={"100%"}
			>
				{/* Watermark */}
				<Text
					position="absolute"
					top="50%"
					left="50%"
					transform="translate(-50%, -50%) rotate(-45deg)"
					fontSize="10em"
					fontWeight="bold"
					color="gray.300"
					opacity={0.5}
					pointerEvents="none"
					zIndex={0}
					w={"100%"}
				>
					DRAFT COPY
				</Text>
				<Box
					position="relative"
					zIndex={1}
					p={4}
					bg="white"
					borderWidth="1px"
					borderColor="gray.300"
					fontFamily="Arial, sans-serif"
					fontSize="10px"
				>
					{/* Header */}
					<Flex justify="space-between" align="center" mb={2}>
						<Flex align="center" gap={2}>
							<Image src={flag} alt="Canada" boxSize="10" />
							<Box>
								<Text fontWeight="bold" fontSize="10px">
									Service Canada
								</Text>
								<Text fontSize="8px">RECORD OF EMPLOYMENT (ROE)</Text>
							</Box>
						</Flex>
						<Box textAlign="right" fontSize="8px">
							<Text>Protected when completed - B</Text>
						</Box>
					</Flex>

					{/* Serial Numbers */}
					<SimpleGrid columns={4} gap={1} mb={2}>
						<Box borderWidth="0.5px" p={1}>
							1 SERIAL NO.
						</Box>
						<Box borderWidth="0.5px" p={1}>
							2 SERIAL NO. OF ROE AMENDED OR REPLACED
						</Box>
						<Box borderWidth="0.5px" p={1}>
							3 EMPLOYER'S PAYROLL REFERENCE NUMBER
						</Box>
						<Box borderWidth="0.5px" p={1}>
							UNIQUE IDENTIFIER: {employee.uniqueIdentifier}
						</Box>
					</SimpleGrid>

					{/* Employer Info */}
					<SimpleGrid columns={4} gap={1} mb={2}>
						<Box borderWidth="0.5px" p={1} colSpan={2}>
							<Text fontWeight="bold">4 EMPLOYER'S NAME AND ADDRESS</Text>
							<Text>{employee.employerName}</Text>
							<Text>{employee.employerAddress}</Text>
							<Text>
								{employee.city}, {employee.province}
							</Text>
						</Box>
						<Box borderWidth="0.5px" p={1}>
							<Text>5 CRA PAYROLL ACCOUNT NUMBER</Text>
							<Text>{employee.craPayroll}</Text>
						</Box>
						<Box borderWidth="0.5px" p={1}>
							<Text>8 SOCIAL INSURANCE NUMBER</Text>
							<Text>{employee.sin}</Text>
						</Box>
						<Box borderWidth="0.5px" p={1}>
							<Text>6 PAY PERIOD TYPE</Text>
							<Text>{employee.payPeriodType}</Text>
						</Box>
						<Box borderWidth="0.5px" p={1}>
							<Text>10 FIRST DAY WORKED</Text>
							<Text>{employee.firstDay}</Text>
						</Box>
						<Box borderWidth="0.5px" p={1}>
							<Text>11 LAST DAY FOR WHICH PAID</Text>
							<Text>{employee.lastDay}</Text>
						</Box>
						<Box borderWidth="0.5px" p={1}>
							<Text>12 FINAL PAY PERIOD ENDING DATE</Text>
							<Text>{employee.finalPayPeriod}</Text>
						</Box>
					</SimpleGrid>

					{/* Employee Info */}
					<SimpleGrid columns={4} gap={1} mb={2}>
						<Box borderWidth="0.5px" p={1} colSpan={3}>
							<Text fontWeight="bold">9 EMPLOYEE'S NAME AND ADDRESS</Text>
							<Text>{employee.name}</Text>
							<Text>{employee.address}</Text>
						</Box>
						<Box borderWidth="0.5px" p={1}>
							<Text>13 OCCUPATION</Text>
							<Text>{employee.occupation}</Text>
						</Box>
					</SimpleGrid>

					{/* Earnings Table */}
					<Box overflowX="auto" mb={2}>
						<Table variant="simple" size="sm">
							<Thead>
								<Tr>
									<Th borderWidth="0.5px" p={1} fontSize="8px">
										PP
									</Th>
									<Th borderWidth="0.5px" p={1} fontSize="8px">
										PAY PERIOD ENDING DATE
									</Th>
									<Th borderWidth="0.5px" p={1} fontSize="8px">
										INSURABLE EARNINGS
									</Th>
									<Th borderWidth="0.5px" p={1} fontSize="8px">
										INSURABLE HOURS
									</Th>
								</Tr>
							</Thead>
							<Tbody>
								{employee.payPeriods.map((pp, idx) => (
									<Tr key={idx}>
										<Td borderWidth="0.5px" p={1} fontSize="8px">
											{pp.pp}
										</Td>
										<Td borderWidth="0.5px" p={1} fontSize="8px">
											{pp.endingDate}
										</Td>
										<Td borderWidth="0.5px" p={1} fontSize="8px">
											{pp.earnings}
										</Td>
										<Td borderWidth="0.5px" p={1} fontSize="8px">
											{pp.hours}
										</Td>
									</Tr>
								))}
							</Tbody>
						</Table>
					</Box>

					{/* Footer */}
					<Box fontSize="8px" mt={2}>
						<Text>Prepared for employee preview before XML submission</Text>
					</Box>
				</Box>
			</Box>
		</>
	);
}
