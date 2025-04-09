import {
	Box,
	Divider,
	Heading,
	HStack,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	VStack,
} from "@chakra-ui/react";

import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";

const MobilePayStub = ({ reportData, companyInfo }) => {
	return console.log("reportData====", reportData, "companyInfo=====", companyInfo);
	const paystubData = {
		company: {
			name: "Acme Corp",
			address: "1234 Innovation Way, Tech City, USA",
			phone: "(555) 123-4567",
		},
		employee: {
			name: "Jane Doe",
			id: "EMP4567",
			position: "Product Designer",
			department: "Design",
		},
		payPeriod: {
			start: "Mar 1, 2025",
			end: "Mar 15, 2025",
			payDate: "Mar 16, 2025",
		},
		employerBenefits: [
			{ type: "Health Insurance", amount: "$300.00" },
			{ type: "401(k) Match", amount: "$150.00" },
		],
		vacationAccruals: {
			accrued: "1.25 days",
			used: "0.5 days",
			available: "5.75 days",
		},
		earnings: [
			{ label: "Regular Pay", amount: "$2,000.00" },
			{ label: "Overtime", amount: "$300.00" },
		],
		deductions: [
			{ label: "Federal Tax", amount: "$350.00" },
			{ label: "State Tax", amount: "$100.00" },
			{ label: "Insurance", amount: "$75.00" },
		],
		grossPay: "$2,300.00",
		netPay: "$1,775.00",
	};
	return (
		<Box p={4}>
			<Box borderWidth="1px" borderRadius="lg" bg="white" mx="auto" fontSize="sm">
				<VStack align="start" spacing={4} w="full">
					<HStack justify="space-between" w="full">
						<Box>
							<TextTitle title={paystubData.company.name} />
							<NormalTextTitle title={paystubData.company.address} />
							<NormalTextTitle title={paystubData.company.phone} />
						</Box>
						<Box textAlign="right">
							<TextTitle title={`Employee: ${paystubData.employee.name}`} />
							<Text>
								<strong>ID:</strong> {paystubData.employee.id}
							</Text>
							<Text>
								<strong>Position:</strong> {paystubData.employee.position}
							</Text>
							<Text>
								<strong>Department:</strong> {paystubData.employee.department}
							</Text>
						</Box>
					</HStack>

					<Divider />

					<Box w="full">
						<Heading size="sm">Pay Period</Heading>
						<HStack justify="space-between" mt={1}>
							<Text>
								<strong>Start:</strong> {paystubData.payPeriod.start}
							</Text>
							<Text>
								<strong>End:</strong> {paystubData.payPeriod.end}
							</Text>
							<Text>
								<strong>Pay Date:</strong> {paystubData.payPeriod.payDate}
							</Text>
						</HStack>
					</Box>

					<Box w="full">
						<Heading size="sm" mb={2}>
							Employer Benefits
						</Heading>
						<Table size="sm">
							<Thead bg="gray.100">
								<Tr>
									<Th>Type</Th>
									<Th isNumeric>Amount</Th>
								</Tr>
							</Thead>
							<Tbody>
								{paystubData.employerBenefits.map((item, i) => (
									<Tr key={i}>
										<Td>{item.type}</Td>
										<Td isNumeric>{item.amount}</Td>
									</Tr>
								))}
							</Tbody>
						</Table>
					</Box>
					<Box w="full">
						<Heading size="sm" mb={2}>
							Vacation Benefit Accruals
						</Heading>
						<HStack justify="space-between">
							<Text>
								<strong>Accrued:</strong> {paystubData.vacationAccruals.accrued}
							</Text>
							<Text>
								<strong>Used:</strong> {paystubData.vacationAccruals.used}
							</Text>
							<Text>
								<strong>Available:</strong> {paystubData.vacationAccruals.available}
							</Text>
						</HStack>
					</Box>

					{/* Earnings */}
					<Box w="full">
						<Heading size="sm" mb={2}>
							Earnings
						</Heading>
						<Table size="sm">
							<Thead bg="gray.100">
								<Tr>
									<Th>Description</Th>
									<Th isNumeric>Amount</Th>
								</Tr>
							</Thead>
							<Tbody>
								{paystubData.earnings.map((item, i) => (
									<Tr key={i}>
										<Td>{item.label}</Td>
										<Td isNumeric>{item.amount}</Td>
									</Tr>
								))}
							</Tbody>
						</Table>
					</Box>

					{/* Deductions */}
					<Box w="full">
						<Heading size="sm" mb={2}>
							Deductions
						</Heading>
						<Table size="sm">
							<Thead bg="gray.100">
								<Tr>
									<Th>Description</Th>
									<Th isNumeric>Amount</Th>
								</Tr>
							</Thead>
							<Tbody>
								{paystubData.deductions.map((item, i) => (
									<Tr key={i}>
										<Td>{item.label}</Td>
										<Td isNumeric>{item.amount}</Td>
									</Tr>
								))}
							</Tbody>
						</Table>
					</Box>

					{/* Summary */}
					<Box w="full">
						<Divider my={2} />
						<HStack justify="space-between" fontWeight="bold" fontSize="md">
							<Text>Gross Pay:</Text>
							<Text>{paystubData.grossPay}</Text>
						</HStack>
						<HStack justify="space-between" fontWeight="bold" fontSize="lg">
							<Text>Net Pay:</Text>
							<Text>{paystubData.netPay}</Text>
						</HStack>
					</Box>

					{/* Cheque Footer */}
					<Box
						w="full"
						mt={6}
						p={4}
						border="2px dashed red"
						borderRadius="md"
						bg="gray.50"
						textAlign="center"
					>
						<Text fontWeight="bold" fontSize="md" mb={1}>
							Payable by Cheque to: {paystubData.employee.name}
						</Text>
						<Text fontSize="xl" fontWeight="bold" mb={1}>
							{paystubData.netPay}
						</Text>
						<Text fontSize="sm" color="red.600" fontWeight="bold">
							*** DO NOT DEPOSIT ***
						</Text>
					</Box>
				</VStack>
			</Box>
		</Box>
	);
};
export default MobilePayStub;
