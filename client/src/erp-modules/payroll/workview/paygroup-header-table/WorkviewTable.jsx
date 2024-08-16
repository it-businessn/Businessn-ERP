import { HStack, Tbody, Td, Tr } from "@chakra-ui/react";
import OutlineButton from "components/ui/button/OutlineButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "routes";
import { formatDateBar, formatDateRange, isExtraPay } from "utils";
import { PAYGROUP_COLS } from "../data";

const WorkviewTable = ({
	payGroupSchedule,
	closestRecordIndex,
	height = "26vh",
	autoScroll,
	handleRegister,
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

	const handleView = () =>
		navigate(`${ROUTE_PATH.PAYROLL}${ROUTE_PATH.REPORT}`);

	const handlePay = (payPeriod) =>
		navigate(`${ROUTE_PATH.PAYROLL}${ROUTE_PATH.PROCESS}/${payPeriod}`);

	return (
		<TableLayout
			cols={PAYGROUP_COLS}
			w={"100%"}
			height={height}
			position="sticky"
			zIndex="docked"
			textAlign="center"
		>
			<Tbody>
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
						},
						index,
					) => (
						<Tr
							key={`${payPeriod}_${index}`}
							ref={(el) => (rowRefs.current[index] = el)}
						>
							<Td p={1} pl={8}>
								{isExtraPay(payPeriod, isExtraRun)}
							</Td>
							<Td p={1} pl={5}>
								<TextTitle title={formatDateBar(payPeriodProcessingDate)} />
							</Td>
							<Td p={1} textAlign={"center"}>
								{formatDateBar(payPeriodPayDate)}
							</Td>
							<Td p={1} textAlign={"center"}>
								{formatDateRange(payPeriodStartDate, payPeriodEndDate)}
							</Td>
							<Td p={1} textAlign={"center"}>
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
								/>
							</Td>
							<Td p={1} textAlign={"center"}>
								{autoScroll ? (
									isViewAction ? (
										<OutlineButton
											label={"View"}
											size="xs"
											onClick={handleView}
										/>
									) : (
										<PrimaryButton
											bg={
												isDisabledAction
													? "var(--calendar_border)"
													: "var(--primary_button_bg)"
											}
											hover={{
												bg: isDisabledAction && "var(--calendar_border)",
											}}
											isDisabled={isDisabledAction}
											name={"Pay now"}
											size="xs"
											onOpen={() => handlePay(payPeriod)}
										/>
									)
								) : (
									<HStack spacing={8} justifyContent={"center"}>
										{isViewAction ? (
											<OutlineButton
												label={"View Register"}
												size="xs"
												onClick={() => handleRegister(payPeriod)}
											/>
										) : (
											<PrimaryButton
												bg={
													isDisabledAction
														? "var(--calendar_border)"
														: "var(--primary_button_bg)"
												}
												hover={{
													bg: isDisabledAction
														? "var(--calendar_border)"
														: "var(--primary_button_bg)",
												}}
												isDisabled={isDisabledAction}
												name={"Pay now"}
												size="xs"
												onOpen={() => handlePay(payPeriod)}
											/>
										)}
										<OutlineButton
											label={"View Journal"}
											size="xs"
											// onClick={handleClick}
										/>
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
