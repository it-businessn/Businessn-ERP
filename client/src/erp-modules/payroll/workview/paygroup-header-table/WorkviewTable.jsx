import { HStack, Tbody, Td, Tr } from "@chakra-ui/react";
import OutlineButton from "components/ui/button/OutlineButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { payrollReportPath, ROUTE_PATH } from "routes";
import { isExtraPay } from "utils";
import { dayMonthYear, formatDateRange } from "utils/convertDate";
import { PAYGROUP_COLS } from "../data";

const WorkviewTable = ({
	payGroupSchedule,
	closestRecordIndex,
	height = "26vh",
	autoScroll = false,
	handleRegister,
	isEarningTable,
	cols = PAYGROUP_COLS,
	viewLabel = "View Register",
	textAlign,
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

	const handleView = () => navigate(payrollReportPath);

	const handlePay = (payPeriod) =>
		navigate(`${ROUTE_PATH.PAYROLL}${ROUTE_PATH.PROCESS}/${payPeriod}`);

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
						},
						index,
					) => (
						<Tr key={`${payPeriod}_${index}`} ref={(el) => (rowRefs.current[index] = el)}>
							<Td p={1} pl={8}>
								{isEarningTable ? payPeriodNum : isExtraPay(payPeriod, isExtraRun)}
							</Td>
							{!isEarningTable && (
								<Td p={1} pl={5}>
									<TextTitle title={dayMonthYear(payPeriodProcessingDate)} />
								</Td>
							)}
							<Td p={1} textAlign={textAlign}>
								{dayMonthYear(payPeriodPayDate)}
							</Td>
							<Td p={1} textAlign={textAlign}>
								{formatDateRange(payPeriodStartDate, payPeriodEndDate)}
							</Td>
							{!isEarningTable && (
								<Td p={1} w={autoScroll && "120px"} textAlign={autoScroll ? "center" : textAlign}>
									<PrimaryButton
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
									/>
								</Td>
							)}
							<Td p={1} w={autoScroll && "150px"} textAlign={autoScroll ? "center" : textAlign}>
								{autoScroll ? (
									isViewAction ? (
										<OutlineButton label={"View"} size="xs" onClick={handleView} w={"95px"} />
									) : (
										<PrimaryButton
											bg={isDisabledAction ? "var(--calendar_border)" : "var(--primary_button_bg)"}
											hover={{
												bg: isDisabledAction && "var(--calendar_border)",
											}}
											isDisabled={isDisabledAction}
											name={"Pay now"}
											size="xs"
											onOpen={() => handlePay(isExtraPay(payPeriod, isExtraRun))}
										/>
									)
								) : (
									<HStack justifyContent={"left"}>
										{isViewAction || isEarningTable ? (
											<OutlineButton
												label={viewLabel}
												size="xs"
												onClick={() => {
													if (isEarningTable) {
														return handleRegister(payPeriodNum);
													}
													handleRegister(isExtraPay(payPeriod, isExtraRun), isExtraRun);
												}}
											/>
										) : (
											<PrimaryButton
												bg={
													isDisabledAction ? "var(--calendar_border)" : "var(--primary_button_bg)"
												}
												hover={{
													bg: isDisabledAction
														? "var(--calendar_border)"
														: "var(--primary_button_bg)",
												}}
												isDisabled={isDisabledAction}
												name={"Pay now"}
												w={"99px"}
												size="xs"
												onOpen={() => handlePay(payPeriod)}
											/>
										)}
										{!isEarningTable && (
											<OutlineButton
												label={"View Journal"}
												size="xs"
												// onClick={handleClick}
											/>
										)}
									</HStack>
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
