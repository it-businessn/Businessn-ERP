import { HStack, IconButton, Input, Tbody, Td, Tr } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import InputFormControl from "components/ui/form/InputFormControl";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
// import TimesheetService from "services/TimesheetService";
import { getDefaultDate } from "utils";
import { getParamKey, getStatusStyle } from "./data";

const Timesheet = ({ cols, data, company, setRefresh }) => {
	const initialFormData = {
		startTime: "",
		endTime: "",
		totalBreaks: "",
		approve: undefined,
		company,
		recordId: null,
	};
	const [formData, setFormData] = useState(initialFormData);
	const [timesheetData, setTimesheetData] = useState(null);

	const handleSave = async () => {
		try {
			const updatedRec = timesheetData.find(
				(record) => record._id === formData.recordId,
			);

			formData.startTime = updatedRec.startTime;
			formData.totalBreaks = updatedRec.totalBreaks;
			formData.endTime = updatedRec.endTime;
			formData.company = updatedRec.companyName;

			// if (formData.recordId) {
			// 	await TimesheetService.updateTimesheet(formData, formData.recordId);
			// 	setRefresh((prev) => !prev);
			// }
		} catch (error) {}
	};

	useEffect(() => {
		if (data) {
			setTimesheetData(data);
		}
	}, [data]);

	const handleTimeChange = (id, field, value) => {
		const updatedData = timesheetData.map((record) =>
			record._id === id ? { ...record, [field]: value } : record,
		);
		setTimesheetData(updatedData);
	};

	useEffect(() => {
		if (formData.approve !== undefined) {
			handleSave();
		}
	}, [formData]);

	const renderEditableInput = (id, field, value, param_hours, isStatPay) => (
		<>
			<Input
				readOnly={isStatPay}
				onBlur={() => handleSave(param_hours)}
				value={value}
				onChange={(e) => {
					setFormData({
						param_hours,
						recordId: id,
					});
					handleTimeChange(id, field, e.target.value);
				}}
				placeholder="HH:mm"
				size="sm"
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
		<TableLayout isTimesheet cols={cols} height="75vh">
			<Tbody>
				{timesheetData?.map(
					({
						_id,
						employeeId,
						approveStatus,
						payType,
						clockIns,
						clockOuts,
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
						startTime,
						endTime,
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

						return (
							<Tr key={_id}>
								<Td py={0}>
									<TextTitle title={employeeId?.fullName} />
								</Td>
								<Td py={0}>
									<TextTitle title={getDefaultDate(createdOn)} />
								</Td>
								<Td py={0}>
									<PrimaryButton
										color={approveStatusBtnCss.color}
										bg={approveStatusBtnCss.bg}
										name={approveStatus}
										size="xs"
										px={0}
										hover={"transparent"}
									/>
								</Td>
								<Td py={0}>
									<TextTitle
										size={"xs"}
										weight="normal"
										title={employeeId?.department?.[0]}
									/>
								</Td>
								<Td py={0}>{param_pay_type}</Td>
								<Td py={0}>{payType}</Td>
								<Td px={0}>
									{renderEditableInput(
										_id,
										"startTime",
										startTime,
										param_hours,
										isStatPay,
									)}
								</Td>
								<Td py={0}>
									{renderEditableInput(
										_id,
										"endTime",
										endTime,

										param_hours,
										isStatPay,
									)}
								</Td>
								<Td py={0}>
									<InputFormControl
										readOnly={isStatPay}
										label={""}
										name="totalBreaks"
										valueText={totalBreaks}
										handleChange={(e) => {
											setFormData({
												startTime,
												endTime,
												totalBreaks: e.target.value,
												param_hours,
												recordId: _id,
												approve: undefined,
											});
										}}
										handleConfirm={() => handleSave()}
									/>
								</Td>
								<Td py={0}>{hhMMFormattedTime}</Td>
								<Td py={0}>
									<HStack spacing={0}>
										<IconButton
											size={"xs"}
											icon={<FaCheck />}
											variant={"solid"}
											color={"var(--status_button_border)"}
											onClick={() => {
												setFormData({
													startTime,
													endTime,
													totalBreaks,
													param_hours,
													recordId: _id,
													approve: true,
												});
											}}
										/>
										<IconButton
											size={"xs"}
											color={"var(--incorrect_ans)"}
											icon={<IoClose />}
											variant={"solid"}
											onClick={() => {
												setFormData({
													startTime,
													endTime,
													totalBreaks,
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
