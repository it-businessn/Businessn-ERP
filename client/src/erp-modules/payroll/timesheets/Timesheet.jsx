import { HStack, IconButton, Input, Tbody, Td, Tr } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import useTimesheet from "hooks/useTimesheet";
import moment from "moment";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import TimesheetService from "services/TimesheetService";
import { getDefaultDate, getTimeFormat } from "utils";
import { getParamKey, getStatusStyle } from "./data";

const Timesheet = ({
	company,
	userId,
	refresh,
	filter,
	setRefresh,
	setTimesheetRefresh,
}) => {
	const showPicker = (className) => {
		const timeInput = document.getElementsByClassName(className);
		if (timeInput) {
			timeInput[0].showPicker();
		}
	};
	// const timesheets = useTimesheet(company, userId, refresh, filter);
	const timesheets = useTimesheet(company, userId, refresh);
	const initialFormData = {
		clockIn: null,
		clockOut: null,
		totalBreakHours: "",
		approve: undefined,
		company,
		recordId: null,
	};
	const [formData, setFormData] = useState(initialFormData);
	const [timesheetData, setTimesheetData] = useState(timesheets);

	useEffect(() => {
		if (timesheets) {
			setTimesheetData(timesheets);
			setTimesheetRefresh(false);
		}
	}, [timesheets]);

	const handleTimeChange = (key, value) => {
		const updatedData = timesheetData?.map((record) =>
			record._id === formData.recordId
				? {
						...record,
						[key]: value,
				  }
				: record,
		);
		setTimesheetData(updatedData);
	};

	const handleSubmit = async () => {
		try {
			const updatedRec = timesheetData.find(
				(record) => record._id === formData.recordId,
			);
			formData.clockIn = updatedRec.clockIn;
			formData.clockOut = updatedRec.clockOut;
			formData.company = updatedRec.companyName;

			if (formData.recordId) {
				await TimesheetService.updateTimesheet(formData, formData.recordId);
				setRefresh((prev) => !prev);
			}
		} catch (error) {}
	};
	useEffect(() => {
		if (formData.approve !== undefined) {
			handleSubmit();
		}
	}, [formData.approve]);

	const handleClick = (e) => {
		const cursorPos = e.target.selectionStart;
		if (cursorPos === 3) {
			e.target.setSelectionRange(3, 3);
		}
	};

	const handleKeyDown = (e) => {
		const cursorPos = e.target.selectionStart;
		const disabledClick = cursorPos === 2 || cursorPos === 3;
		if (disabledClick && (e.key === "Backspace" || e.key === "Delete")) {
			e.preventDefault();
		}

		if (disabledClick && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
			e.preventDefault();
			if (e.key === "ArrowLeft") {
				e.target.setSelectionRange(1, 1);
			} else if (e.key === "ArrowRight") {
				e.target.setSelectionRange(3, 3);
			}
		}
	};

	const renderEditableInput = (id, field, value, param_hours, isStatPay) => (
		<>
			<Input
				readOnly={true}
				// onBlur={() => handleSubmit(param_hours)}
				value={value}
				// onChange={(e) => {
				// 	setFormData({
				// 		param_hours,
				// 		recordId: id,
				// 	});
				// 	handleTimeChange(id, field, e.target.value);
				// }}
				// onKeyDown={handleKeyDown}
				// onClick={handleClick}
				placeholder="HH:mm"
				size="sm"
				maxLength={5}
				// isInvalid={!!errors[`${id}-${field}`]}
			/>
			{/* {errors[`${id}-${field}`] && (
				<Text color="red.500" fontSize="sm">
					{errors[`${id}-${field}`]}
				</Text>
			)} */}
		</>
	);

	return (
		<TableLayout
			isTimesheet
			cols={[
				"Employee Name",
				"Worked Date",
				"Status",
				"Department",
				"Pay Rate",
				"Pay Type",
				"Start Time",
				"End Time",
				"Break/Lunch",
				"Total Worked Hours",
				"Action",
			]}
			height="71vh"
		>
			<Tbody>
				{!timesheetData?.length && <EmptyRowRecord />}
				{timesheetData?.map(
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
					}) => {
						const approveStatusBtnCss = getStatusStyle(approveStatus);

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
								: vacationPayHours;

						const isStatPay = payType === "Statutory Pay";

						const hhMMFormattedTime = `${(param_hours_worked / 60).toFixed(
							0,
						)}:${param_hours_worked % 60}`;

						const isDisabled = !clockIn || !clockOut;

						return (
							<Tr key={_id} _hover={{ bg: "var(--phoneCall_bg_light)" }}>
								<Td py={0}>
									<TextTitle title={employeeId?.fullName} />
								</Td>
								<Td py={0}>
									<TextTitle title={getDefaultDate(clockIn)} />
								</Td>
								<Td p={0}>
									<PrimaryButton
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
									<NormalTextTitle
										size={"xs"}
										title={employeeId?.department?.[0]}
									/>
								</Td>
								<Td py={0}>{param_pay_type}</Td>
								<Td py={0}>{payType}</Td>
								<Td p={0}>
									<Input
										onBlur={() => handleSubmit(param_hours)}
										className={`timeClockInInput ${_id}`}
										type="time"
										name="clockIn"
										value={clockIn ? getTimeFormat(clockIn) : ""}
										onClick={() => showPicker(`timeClockInInput ${_id}`)}
										onChange={(e) => {
											setFormData({
												param_hours,
												recordId: _id,
												clockIn: e.target.value,
											});
											handleTimeChange(
												"clockIn",
												moment.utc(formData.clockIn, "HH:mm"),
											);
										}}
										required
									/>
								</Td>
								<Td p={0} pl={3}>
									<Input
										onBlur={() => handleSubmit(param_hours)}
										className={`timeClockOutInput ${_id}`}
										type="time"
										name="clockOut"
										value={clockOut ? getTimeFormat(clockOut) : ""}
										onClick={() => showPicker(`timeClockOutInput ${_id}`)}
										onChange={(e) => {
											setFormData({
												param_hours,
												recordId: _id,
												clockOut: e.target.value,
											});
											handleTimeChange(
												"clockOut",
												moment.utc(formData.clockOut, "HH:mm"),
											);
										}}
										required
									/>
								</Td>
								<Td p={0} pl={3}>
									{renderEditableInput(
										_id,
										"totalBreakHours",
										totalBreakHours,
										param_hours,
										isStatPay,
									)}
								</Td>
								<Td py={0}>{totalWorkedHours}</Td>
								<Td py={0}>
									<HStack spacing={0}>
										<IconButton
											isDisabled={isDisabled}
											size={"xs"}
											icon={<FaCheck />}
											variant={"solid"}
											color={"var(--status_button_border)"}
											onClick={() => {
												setFormData({
													clockIn,
													clockOut,
													totalBreakHours,
													param_hours,
													recordId: _id,
													approve: true,
												});
											}}
										/>
										<IconButton
											isDisabled={isDisabled}
											size={"xs"}
											color={"var(--incorrect_ans)"}
											icon={<IoClose />}
											variant={"solid"}
											onClick={() => {
												setFormData({
													clockIn,
													clockOut,
													totalBreakHours,
													param_hours,
													recordId: _id,
													approve: false,
												});
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

export default Timesheet;
