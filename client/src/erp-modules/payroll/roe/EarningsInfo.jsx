import {
	Box,
	Flex,
	HStack,
	IconButton,
	Stack,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import moment from "moment";
import { useEffect, useState } from "react";
import { BiMerge } from "react-icons/bi";
import PayrollService from "services/PayrollService";
import { convertDecimal, getAmount } from "utils/convertAmt";

const EarningsInfo = ({ formData, setFormData, company, roeEmpId }) => {
	const cols = ["ROE PP", "Payroll PP", "PP End Date", "Insurable Earnings", "Insurable Hours"];
	const [earningsData, setEarningsData] = useState([]);
	const [set1, setSet1] = useState([]);
	const [set2, setSet2] = useState([]);
	const [totalInsurableHours, setTotalInsurableHours] = useState(0);
	const [totalInsurableEarnings, setTotalInsurableEarnings] = useState(0);
	useEffect(() => {
		const fetchEmpPayStubs = async () => {
			try {
				const { data } = await PayrollService.getEmpEarningInfo(company, roeEmpId);
				data?.map(
					(_) =>
						(_.insurableHours =
							_?.totalRegHoursWorked +
							_?.totalOvertimeHoursWorked +
							_?.totalDblOvertimeHoursWorked +
							_?.totalSickHoursWorked +
							_?.totalSprayHoursWorked +
							_?.totalStatDayHoursWorked +
							_?.totalStatHours +
							_?.totalVacationHoursWorked +
							_?.totalFirstAidHoursWorked),
				);
				const totalHours = data?.reduce((acc, item) => {
					return acc + item?.insurableHours;
				}, 0);
				setTotalInsurableHours(totalHours);

				const totalEarnings = data?.reduce((acc, item) => {
					return acc + item?.currentGrossPay;
				}, 0);
				setTotalInsurableEarnings(totalEarnings);
				setEarningsData(data);
			} catch (error) {
				console.error(error);
			}
		};
		if (roeEmpId) fetchEmpPayStubs();
	}, [roeEmpId]);

	useEffect(() => {
		if (earningsData.length) {
			const evenRecords = [];
			const oddRecords = [];
			let evenIndex = 1;
			let oddIndex = 2;
			earningsData.forEach((record, index) => {
				if (index % 2 === 0) {
					evenRecords.push({ ...record, newIndex: evenIndex });
					evenIndex += 2;
				} else {
					oddRecords.push({ ...record, newIndex: oddIndex });
					oddIndex += 2;
				}
			});
			setSet1(evenRecords);
			setSet2(oddRecords);
		}
	}, [earningsData]);

	const handleFieldChange = (section, field, value) => {
		setFormData({
			...formData,
			[section]: {
				...formData[section],
				[field]: value,
			},
		});
	};

	return (
		<Flex height="100%">
			<Box overflowY="auto" css={tabScrollCss}>
				<Stack spacing={3} p={5}>
					<TextTitle size="xl" title="Period Information" />
					<HStack
						spacing={3}
						justifyContent="space-between"
						alignItems="baseline"
						height="50vh"
						overflow="auto"
					>
						<Table bg="var(--lead_cards_bg)" variant="simple">
							<Thead position="sticky" top={-1} zIndex={3}>
								<Tr>
									{cols?.map((col, index) => (
										<Th key={`${col}_${index}`} pl={index === 0 && "1em !important"}>
											<TextTitle size="md" title={col} />
										</Th>
									))}
								</Tr>
							</Thead>
							<Tbody>
								{set1?.map(
									({
										payPeriodNum,
										payPeriodEndDate,
										currentGrossPay,
										insurableHours,
										newIndex,
									}) => (
										<Tr key={`${payPeriodNum}_${newIndex}`}>
											<Td py={0}>
												<NormalTextTitle align="center" title={newIndex} />
											</Td>

											<Td py={1}>
												<NormalTextTitle align="center" title={payPeriodNum} />
											</Td>
											<Td py={1}>
												<NormalTextTitle
													align="center"
													title={moment(payPeriodEndDate).format("YYYY-MM-DD")}
												/>
											</Td>
											<Td py={1}>
												<NormalTextTitle align="center" title={getAmount(currentGrossPay)} />
											</Td>
											<Td py={1}>
												<NormalTextTitle align="center" title={convertDecimal(insurableHours)} />
											</Td>
										</Tr>
									),
								)}
							</Tbody>
						</Table>
						<IconButton
							ml={"1em"}
							size="sm"
							icon={<BiMerge />}
							aria-label="Refresh"
							variant="round"
						/>
						<Table bg="var(--lead_cards_bg)" variant="simple">
							<Thead position="sticky" top={-1} zIndex={3}>
								<Tr>
									{cols?.map((col, index) => (
										<Th key={`${col}_${index}`} pl={index === 0 && "1em !important"}>
											<TextTitle size="md" title={col} />
										</Th>
									))}
								</Tr>
							</Thead>
							<Tbody>
								{set2?.map(
									({
										payPeriodNum,
										payPeriodEndDate,
										currentGrossPay,
										insurableHours,
										newIndex,
									}) => (
										<Tr key={`${payPeriodNum}_${newIndex}`}>
											<Td py={0}>
												<NormalTextTitle align="center" title={newIndex} />
											</Td>

											<Td py={1}>
												<NormalTextTitle align="center" title={payPeriodNum} />
											</Td>
											<Td py={1}>
												<NormalTextTitle
													align="center"
													title={moment(payPeriodEndDate).format("YYYY-MM-DD")}
												/>
											</Td>
											<Td py={1}>
												<NormalTextTitle align="center" title={getAmount(currentGrossPay)} />
											</Td>
											<Td py={1}>
												<NormalTextTitle align="center" title={convertDecimal(insurableHours)} />
											</Td>
										</Tr>
									),
								)}
							</Tbody>
						</Table>
					</HStack>
					<Stack alignItems="end" w={"100%"}>
						<HStack alignItems="start" w="25%" justifyContent="space-between">
							<TextTitle title="Total Insurable Hours:" whiteSpace="wrap" align={"right"} />
							<NormalTextTitle
								title={convertDecimal(totalInsurableHours)}
								align={"right"}
								width="100px"
							/>
						</HStack>
						<HStack alignItems="start" w="25%" justifyContent="space-between">
							<TextTitle title="Total Insurable Dollars:" whiteSpace="wrap" align={"right"} />
							<NormalTextTitle
								title={getAmount(totalInsurableEarnings)}
								align={"right"}
								width="100px"
							/>
						</HStack>
					</Stack>
				</Stack>
			</Box>
		</Flex>
	);
};

export default EarningsInfo;
