import {
	HStack,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Tbody,
	Td,
	Text,
	Tooltip,
	Tr,
} from "@chakra-ui/react";
import OutlineButton from "components/ui/button/OutlineButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useRef } from "react";
import { FaBook, FaEye, FaFileAlt, FaMoneyBillWave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { payrollReportPath, ROUTE_PATH } from "routes";
import { isExtraPay } from "utils";
import { dayMonthYear, formatDateRange } from "utils/convertDate";
import { PAYGROUP_COLS } from "../data";

const WorkviewTable = ({
	payGroupSchedule,
	closestRecordIndex,
	height = "calc(100vh - 670px)",
	autoScroll = false,
	handleRegister,
	handleTotalsReport,
	handleJournalsReport,
	isEarningTable,
	cols = PAYGROUP_COLS,
	viewLabel = "View Register",
	textAlign,
	selectedYear,
}) => {
	const rowRefs = useRef([]);
	const scrollToRow = (index) => {
		if (rowRefs.current[index]) {
			rowRefs.current[index].scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
		}
	};

	useEffect(() => {
		if (payGroupSchedule && autoScroll) {
			scrollToRow(closestRecordIndex);
		}
	}, [payGroupSchedule]);

	const navigate = useNavigate();

	const handleView = () => navigate(`${payrollReportPath}/${selectedYear}`);

	const handlePay = (payPeriod) =>
		navigate(`${ROUTE_PATH.PAYROLL}${ROUTE_PATH.PROCESS}/${payPeriod}/${selectedYear}`);

	const renderActionButtons = (
		payPeriodNum,
		payPeriod,
		isExtraRun,
		isViewAction,
		isDisabledAction,
		payPeriodPayDate,
	) => {
		const mainAction =
			isViewAction || isEarningTable ? (
				<OutlineButton
					w="100px"
					label={viewLabel}
					size="xs"
					onClick={() => {
						handleRegister(
							isExtraPay(payPeriodNum || payPeriod, isExtraRun),
							isExtraRun,
							payPeriodPayDate,
						);
					}}
					leftIcon={<FaFileAlt />}
				/>
			) : (
				<PrimaryButton
					minW="100px"
					bg={isDisabledAction ? "var(--calendar_border)" : "var(--primary_button_bg)"}
					hover={{
						bg: isDisabledAction ? "var(--calendar_border)" : "var(--primary_button_bg)",
					}}
					isDisabled={isDisabledAction}
					name={"Pay now"}
					size="xs"
					leftIcon={<FaMoneyBillWave />}
					onOpen={() => handlePay(payPeriodNum || payPeriod)}
				/>
			);

		if (isEarningTable) {
			return mainAction;
		}

		return (
			<HStack spacing={2}>
				{mainAction}
				<Menu>
					<Tooltip label="View Reports" hasArrow>
						<MenuButton
							as={IconButton}
							icon={<FaEye />}
							variant="ghost"
							size="sm"
							isDisabled={isDisabledAction}
							_hover={{ bg: "gray.100" }}
							color="gray.600"
						/>
					</Tooltip>
					<MenuList>
						<MenuItem
							icon={<FaFileAlt />}
							onClick={() =>
								handleTotalsReport(
									isExtraPay(payPeriodNum || payPeriod, isExtraRun),
									isExtraRun,
									payPeriodPayDate,
								)
							}
						>
							View Funding Totals
						</MenuItem>
						<MenuItem
							icon={<FaBook />}
							onClick={() =>
								handleJournalsReport(
									isExtraPay(payPeriod, isExtraRun),
									isExtraRun,
									payPeriodPayDate,
								)
							}
						>
							View Journal
						</MenuItem>
					</MenuList>
				</Menu>
			</HStack>
		);
	};

	return (
		<TableLayout
			cols={cols}
			w={"100%"}
			height={height}
			position="sticky"
			zIndex="docked"
			top={-1}
			textAlign="center"
			autoScroll={autoScroll}
		>
			<Tbody>
				{(!payGroupSchedule || payGroupSchedule?.length === 0) && (
					<EmptyRowRecord data={payGroupSchedule} colSpan={cols.length} />
				)}
				{payGroupSchedule?.map(
					(
						{
							payPeriod,
							payPeriodProcessingDate,
							payPeriodStartDate,
							payPeriodEndDate,
							payPeriodPayDate,
							isProcessed,
							color,
							name,
							bg,
							isViewAction,
							isDisabledStatus,
							isDisabledAction,
							isExtraRun,
							payPeriodNum,
							scheduleFrequency,
						},
						index,
					) => (
						<Tr key={`${payPeriod}_${index}`} ref={(el) => (rowRefs.current[index] = el)}>
							<Td p={1} pl={8}>
								{`${isExtraPay(payPeriodNum || payPeriod, isExtraRun)}`}
							</Td>
							<Td p={1} textAlign={textAlign}>
								{dayMonthYear(payPeriodPayDate)}
							</Td>
							<Td p={1} textAlign={textAlign}>
								{formatDateRange(payPeriodStartDate, payPeriodEndDate)}
							</Td>
							{!isEarningTable && (
								<Td p={1} pl={5}>
									<TextTitle title={dayMonthYear(payPeriodProcessingDate)} />
								</Td>
							)}
							{!isEarningTable && (
								<Td p={1} w={autoScroll && "120px"} textAlign={autoScroll ? "center" : textAlign}>
									{/* <PrimaryButton
										color={color}
										bg={bg}
										name={name}
										size="xs"
										px={0}
										isDisabled={isDisabledStatus}
										hover={{
											bg,
											color,
										}}
										w={"92px"}
									/> */}

									<Text
										align="center"
										py={1}
										borderRadius="full"
										fontSize="sm"
										fontWeight="medium"
										color={color}
										bg={bg}
										opacity={isDisabledStatus ? 0.5 : 1}
									>
										{name}
									</Text>
								</Td>
							)}
							<Td p={1} w={autoScroll && "150px"} textAlign={autoScroll ? "center" : textAlign}>
								{autoScroll ? (
									isViewAction ? (
										<OutlineButton
											label={"View"}
											size="xs"
											onClick={handleView}
											w={"95px"}
											leftIcon={<FaFileAlt />}
										/>
									) : (
										<PrimaryButton
											minW="100px"
											bg={isDisabledAction ? "var(--calendar_border)" : "var(--primary_button_bg)"}
											hover={{
												bg: isDisabledAction && "var(--calendar_border)",
											}}
											isDisabled={isDisabledAction}
											name={"Pay now"}
											size="xs"
											leftIcon={<FaMoneyBillWave />}
											onOpen={() => handlePay(isExtraPay(payPeriodNum || payPeriod, isExtraRun))}
										/>
									)
								) : (
									renderActionButtons(
										payPeriodNum,
										payPeriod,
										isExtraRun,
										isViewAction,
										isDisabledAction,
										payPeriodPayDate,
									)
								)}
							</Td>
						</Tr>
					),
				)}
			</Tbody>
		</TableLayout>
	);
};

export default WorkviewTable;
