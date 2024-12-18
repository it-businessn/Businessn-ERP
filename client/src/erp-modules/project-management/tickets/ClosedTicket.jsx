import { HStack, IconButton, Tbody, Td, Tr } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import { getParamKey, getPayTypeStyle, getStatusStyle } from "erp-modules/payroll/timesheets/data";
import { useEffect, useState } from "react";
import { FaCheck, FaRegTrashAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { getAmount } from "utils/convertAmt";
import { getTimeCardFormat } from "utils/convertDate";

const ClosedTicket = ({ company, setShowAddEntry, showAddEntry, filter, setTicketRefresh }) => {
	const [tickets, setTickets] = useState(null);
	const [refresh, setRefresh] = useState(false);

	const [deleteRecordId, setDeleteRecordId] = useState(false);
	const [showDeletePopUp, setShowDeletePopUp] = useState(false);

	const initialFormData = {
		clockIn: null,
		clockOut: null,
		totalBreakHours: "",
		approve: undefined,
		company,
		recordId: null,
		empId: null,
	};
	const [formData, setFormData] = useState(initialFormData);
	const [ticketData, setTicketData] = useState(tickets);

	useEffect(() => {
		if (tickets) {
			setTicketData(tickets);
			setTicketRefresh(false);
		}
	}, [tickets]);

	const cols = [
		"Ticket Number",
		"Category",
		"Priority",
		"Assignee",
		"Originator",
		"Description",
		"Ticket Opened",
		"Ticket Closed",
		"Days Opened",
		"Status",
		"Action",
	];
	return (
		<TableLayout cols={cols} position="sticky" zIndex={3} top={-1} height="73vh">
			<Tbody>
				{(!ticketData || ticketData?.length === 0) && (
					<EmptyRowRecord data={ticketData} colSpan={cols.length} />
				)}
				{ticketData?.map(
					({
						_id,
						employeeId,
						approveStatus,
						payType,
						regPay,
						statWorkPay,
						dblOverTimePay,
						overTimePay,
						createdOn,
						regHoursWorked,
						overtimeHoursWorked,
						dblOvertimeHoursWorked,
						statDayHoursWorked,
						statDayHours,
						sickPayHours,
						vacationPayHours,
						statPay,
						sickPay,
						vacationPay,
						totalBreaks,
						clockIn,
						clockOut,
						totalBreakHours,
						totalWorkedHours,
						notDevice,
					}) => {
						const approveStatusBtnCss = getStatusStyle(approveStatus);
						const { type, color } = getPayTypeStyle(payType);

						const { param_key, param_hours } = getParamKey(payType);

						const param_pay_type =
							param_key === "regPay"
								? regPay
								: param_key === "overTimePay"
								? overTimePay
								: param_key === "dblOverTimePay"
								? dblOverTimePay
								: param_key === "statWorkPay"
								? statWorkPay
								: param_key === "statPay"
								? statPay
								: param_key === "sickPay"
								? sickPay
								: vacationPay;

						const param_hours_worked =
							param_hours === "regHoursWorked"
								? regHoursWorked
								: param_hours === "overtimeHoursWorked"
								? overtimeHoursWorked
								: param_hours === "dblOvertimeHoursWorked"
								? dblOvertimeHoursWorked
								: param_hours === "statDayHoursWorked"
								? statDayHoursWorked
								: param_hours === "statDayHours"
								? statDayHours
								: param_hours === "sickPayHours"
								? sickPayHours
								: param_hours === "vacationPayHours"
								? vacationPayHours
								: 0;

						const isStatPay = payType === "Statutory Pay";

						const isDisabled = !clockIn || !clockOut;

						return (
							<Tr key={_id} _hover={{ bg: "var(--phoneCall_bg_light)" }}>
								<Td py={0}>
									<TextTitle title={employeeId?.fullName} />
								</Td>
								<Td py={0}>
									<TextTitle title={clockIn && getTimeCardFormat(clockIn, notDevice, true)} />
								</Td>
								<Td py={0}>
									<NormalTextTitle size="sm" title={employeeId?.department?.[0]} />
								</Td>
								<Td textAlign={"right"} py={0} w={"90px"}>
									{getAmount(param_pay_type)}
								</Td>
								<Td py={0}>
									<NormalTextTitle color={color} size="sm" title={type} />
								</Td>

								<Td py={0} w={"80px"}>
									<NormalTextTitle
										// align={"center"}
										size="sm"
										title={param_hours_worked}
									/>
								</Td>
								<Td p={0} position={"sticky"} right={"0"} zIndex="1">
									<PrimaryButton
										cursor="text"
										color={approveStatusBtnCss.color}
										bg={approveStatusBtnCss.bg}
										name={approveStatus}
										size="xs"
										px={0}
										hover={{
											bg: approveStatusBtnCss.bg,
											color: approveStatusBtnCss.color,
										}}
									/>
								</Td>
								<Td py={0}>
									<HStack spacing={0}>
										<IconButton
											isDisabled={isDisabled}
											size={"xs"}
											icon={<FaCheck />}
											ml={-5}
											variant={"solid"}
											color={"var(--status_button_border)"}
											onClick={() => {
												setFormData((prev) => ({
													...prev,
													recordId: _id,
													approve: true,
												}));
											}}
										/>
										<IconButton
											isDisabled={isDisabled}
											size={"xs"}
											color={"var(--incorrect_ans)"}
											icon={<IoClose />}
											variant={"solid"}
											onClick={() => {
												setFormData((prev) => ({
													...prev,
													recordId: _id,
													approve: false,
												}));
											}}
										/>
										<IconButton
											size={"xs"}
											color={"var(--main_color_black)"}
											icon={<FaRegTrashAlt />}
											variant={"solid"}
											onClick={() => {
												setShowDeletePopUp(true);
												setDeleteRecordId(_id);
											}}
										/>
									</HStack>
								</Td>
							</Tr>
						);
					},
				)}
			</Tbody>
		</TableLayout>
	);
};

export default ClosedTicket;
