import { HStack, IconButton, Input, Tbody, Td, Tr, useToast } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import DeletePopUp from "components/ui/modal/DeletePopUp";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import { COLS } from "constant";
import { useEffect, useState } from "react";
import { FaCheck, FaRegTrashAlt } from "react-icons/fa";
import { GoPlusCircle } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { TbCornerRightUp } from "react-icons/tb";
import TimesheetService from "services/TimesheetService";
import { getAmount } from "utils/convertAmt";
import {
	getClockInTimeFormat,
	getTimeCardFormat,
	getTimeFormat,
	getUTCTime,
	isSameAsToday,
} from "utils/convertDate";
import {
	BREAK_TYPES_TITLE,
	getParamKey,
	getPayTypeStyle,
	getSourceStyle,
	getStatusStyle,
	PAY_TYPES_TITLE,
	TIMESHEET_SOURCE,
	TIMESHEET_STATUS_LABEL,
} from "./data";
import ExtraTimeEntryModal from "./ExtraTimeEntryModal";

const Timesheet = ({
	company,
	setShowAddEntry,
	showAddEntry,
	filter,
	pageNum,
	setPageNum,
	setTimesheetRefresh,
	timesheets,
	setTimesheets,
}) => {
	const [totalPage, setTotalPages] = useState(1);
	const [refresh, setRefresh] = useState(false);
	const limit = 40;

	useEffect(() => {
		const fetchAllEmployeeTimesheet = async () => {
			setTimesheetData(null);

			try {
				const { data } = await TimesheetService.getFilteredTimesheets(company, filter, {
					page: pageNum,
					limit,
				});
				const { totalPages, page, items } = data;

				items?.map((_) => {
					const isOvertime = _.payType === PAY_TYPES_TITLE.OVERTIME_PAY;
					if (isOvertime) {
						_.startTime = getUTCTime(_.clockIn);
						_.endTime = getUTCTime(_.clockOut);
					} else {
						_.startTime = getClockInTimeFormat(_.clockIn);
						_.endTime = _.clockOut ? getTimeFormat(_.clockOut) : "";
					}
					_.isEditable = _.source !== TIMESHEET_SOURCE.EMP;
					_.isAppOrTad = _.manualAdded || _.source === TIMESHEET_SOURCE.TAD;
					if (_.isEditable && _.isAppOrTad) {
						_.isEditable = !isSameAsToday(_.clockIn);
					}
					_.isActionDisabled = _.startTime === "" || _.endTime === "";
					_.showAddBreak = _.payType.includes("Break")
						? _.approveStatus === TIMESHEET_STATUS_LABEL.APPROVED
						: _.isEditable;
					return _;
				});
				setTimesheets(items);
				setTotalPages(totalPages > 0 ? totalPages : 1);
				setPageNum(page);
			} catch (error) {
				console.error(error);
			}
		};
		if (filter?.startDate) {
			fetchAllEmployeeTimesheet();
		}
	}, [
		pageNum,
		filter?.startDate,
		filter?.endDate,
		filter?.filteredEmployees,
		filter?.filteredDept,
		refresh,
	]);

	const [deleteRecordId, setDeleteRecordId] = useState(false);
	const [showDeletePopUp, setShowDeletePopUp] = useState(false);

	const showPicker = (className) => {
		const timeInput = document.getElementsByClassName(className);
		if (timeInput) {
			timeInput[0].showPicker();
		}
	};

	useEffect(() => {
		const fetchAllTimecards = async () => {
			try {
				const post = await TimesheetService.addTimecard([]);
				if (post.data) {
					// setRefresh(true);
				}
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllTimecards();
	}, []);

	const initialFormData = {
		clockIn: null,
		clockOut: null,
		regBreakHoursWorked: "",
		approve: undefined,
		company,
		recordId: null,
		empId: null,
		payType: "",
		source: TIMESHEET_SOURCE.MANAGER,
	};
	const [formData, setFormData] = useState(initialFormData);
	const [timesheetData, setTimesheetData] = useState([]);

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
	const addRow = (index) => {
		const newRows = [...timesheetData];
		const {
			regPay,
			statWorkPay,
			dblOverTimePay,
			overTimePay,
			createdOn,
			regHoursWorked,
			breakHoursWorked,
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
			regBreakHoursWorked,
			totalWorkedHours,
			notDevice,
			employee,
			payType,
			source,
		} = timesheetData[index];

		const emptyBreakRecord = {
			_id: Date.now(),
			approveStatus: "Pending",
			payType: `${payType} Break`,
			regPay,
			statWorkPay,
			dblOverTimePay,
			overTimePay,
			createdOn,
			regHoursWorked,
			breakHoursWorked,
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
			regBreakHoursWorked,
			totalWorkedHours,
			notDevice,
			employee,
			startTime: "",
			endTime: "",
			source,
		};
		newRows.splice(index + 1, 0, emptyBreakRecord);
		setTimesheetData(newRows);
	};

	const handleDelete = async (id) => {
		try {
			const record = await TimesheetService.deleteEntry({ deleted: true }, deleteRecordId);
			if (record) {
				setRefresh((prev) => !prev);
				handleClose();
			}
		} catch (error) {
			console.error("Error deleting time entry:", error);
			handleClose();
		}
	};

	const handleClose = () => setShowDeletePopUp(false);

	const toast = useToast();
	const handleSubmit = async () => {
		try {
			const updatedRec = timesheetData.find((record) => record._id === formData.recordId);
			formData.clockIn = updatedRec.clockIn;
			formData.clockOut = updatedRec.clockOut;
			formData.company = updatedRec.companyName;
			formData.empId = updatedRec.employee._id;
			formData.payType = updatedRec.payType;
			formData.source = updatedRec?.source || TIMESHEET_SOURCE.MANAGER;

			if (formData.recordId) {
				const { data } = await TimesheetService.updateTimesheet(formData, formData.recordId);
				if (data.message)
					toast({
						title: data.message,
						status: "success",
						duration: 1500,
						isClosable: true,
					});
				setRefresh((prev) => !prev);
			}
		} catch (error) {}
	};

	useEffect(() => {
		if (formData.approve !== undefined) {
			handleSubmit();
		}
	}, [formData.approve, formData.recordId]);

	useEffect(() => {
		if (formData.clockIn) {
			handleTimeChange("clockIn", formData.clockIn);
		}
	}, [formData.clockIn]);

	useEffect(() => {
		if (formData.clockOut) {
			handleTimeChange("clockOut", formData.clockOut);
		}
	}, [formData.clockOut]);

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

	const cols = [
		COLS.EMP_NAME,
		"Worked Date",
		"Department",
		"Source",
		"Pay Rate",
		"Pay Type",
		"Start Time",
		"End Time",
		"Break",
		"Total Hours",
		"Status",
		"Action",
	];

	const handleUpdateData = (id, field, value, param_hours) => {
		const updatedData = timesheetData?.map((record) =>
			record._id === id ? { ...record, [field]: value } : record,
		);
		setFormData({
			param_hours,
			recordId: id,
			[field]: value,
		});
		setTimesheetData(updatedData);
	};

	return (
		<>
			<TableLayout cols={cols} position="sticky" zIndex={3} top={-1} height="72vh">
				<Tbody>
					{(!timesheetData || timesheetData?.length === 0) && (
						<EmptyRowRecord data={timesheetData} colSpan={cols.length} />
					)}
					{timesheetData?.map(
						(
							{
								_id,
								approveStatus,
								payType,
								regPay,
								statWorkPay,
								dblOverTimePay,
								overTimePay,
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
								clockIn,
								notDevice,
								employee,
								startTime,
								endTime,
								regBreakHoursWorked,
								source,
								isEditable,
								isActionDisabled,
								showAddBreak,
							},
							index,
						) => {
							const sourceBtnCss = getSourceStyle(source);
							const approveStatusBtnCss = getStatusStyle(approveStatus);
							const { type, color, rowBg } = getPayTypeStyle(payType);

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
									: param_hours === "regBreakHoursWorked"
									? regBreakHoursWorked
									: 0;

							const isStatPay = payType === PAY_TYPES_TITLE.STAT_PAY;

							return (
								<Tr
									key={_id}
									bg={rowBg ?? ""}
									_hover={{ bg: rowBg ?? "var(--phoneCall_bg_light)" }}
								>
									<Td py={0}>
										<TextTitle title={employee?.fullName} />
									</Td>
									<Td py={0}>
										<TextTitle title={clockIn && getTimeCardFormat(clockIn, notDevice, true)} />
									</Td>
									<Td py={0}>
										<NormalTextTitle size="sm" title={employee?.department?.[0]} />
									</Td>
									<Td p={0} position={"sticky"} right={"0"} zIndex="1">
										{source && (
											<PrimaryButton
												cursor="text"
												color={sourceBtnCss?.color}
												bg={sourceBtnCss?.bg}
												name={source}
												size="xs"
												px={0}
												hover={{
													bg: sourceBtnCss.bg,
													color: sourceBtnCss.color,
												}}
											/>
										)}
									</Td>
									<Td textAlign={"right"} py={0} w={"90px"}>
										{getAmount(param_pay_type)}
									</Td>
									<Td py={0}>
										<NormalTextTitle color={color} size="sm" title={type} />
									</Td>
									<Td p={0.5}>
										<Input
											cursor={isEditable ? "pointer" : "auto"}
											size={"sm"}
											onBlur={() => isEditable && handleSubmit(param_hours)}
											className={`timeClockInInput ${_id}`}
											type="time"
											name="startTime"
											value={startTime || ""}
											onClick={() => isEditable && showPicker(`timeClockInInput ${_id}`)}
											onChange={(e) =>
												isEditable &&
												handleUpdateData(_id, "startTime", e.target.value, param_hours)
											}
											required
										/>
									</Td>
									<Td p={0.5} pl={3}>
										<Input
											cursor={isEditable ? "pointer" : "auto"}
											size={"sm"}
											onBlur={() => isEditable && handleSubmit(param_hours)}
											className={`timeClockOutInput ${_id}`}
											type="time"
											name="endTime"
											value={endTime || ""}
											onClick={() => isEditable && showPicker(`timeClockOutInput ${_id}`)}
											onChange={(e) =>
												isEditable && handleUpdateData(_id, "endTime", e.target.value, param_hours)
											}
											required
										/>
									</Td>
									<Td p={0} pl={5}>
										{/* {renderEditableInput(
										_id,
										"totalBreakHours",
										totalBreakHours,
										param_hours,
										isStatPay,
									)} */}
										{regBreakHoursWorked && payType === BREAK_TYPES_TITLE.REG_PAY_BRK ? (
											<NormalTextTitle size="sm" p="0 1em" title={regBreakHoursWorked} />
										) : (
											showAddBreak && (
												<IconButton
													icon={<GoPlusCircle />}
													fontSize="1.8em"
													color="var(--main_color_black)"
													onClick={() => addRow(index)}
												/>
											)
										)}
									</Td>

									<Td py={0} w={"80px"}>
										{regBreakHoursWorked && payType.includes("Break") ? (
											<IconButton
												isDisabled={!isEditable}
												icon={<TbCornerRightUp />}
												fontSize="1.8em"
												ml="-1em"
												onClick={() => addRow(index)}
											/>
										) : (
											<NormalTextTitle size="sm" title={param_hours_worked.toFixed(2)} />
										)}
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
												isDisabled={isActionDisabled}
												size={"xs"}
												icon={<FaCheck />}
												ml={-5}
												variant={"solid"}
												color={"var(--status_button_border)"}
												onClick={() => {
													setFormData((prev) => ({
														...prev,
														param_hours,
														recordId: _id,
														approve: true,
														startTime: null,
														endTime: null,
													}));
												}}
											/>
											<IconButton
												isDisabled={isActionDisabled}
												size={"xs"}
												color={"var(--incorrect_ans)"}
												icon={<IoClose />}
												variant={"solid"}
												onClick={() => {
													setFormData((prev) => ({
														...prev,
														param_hours,
														recordId: _id,
														approve: false,
														startTime: null,
														endTime: null,
													}));
												}}
											/>
											{/* <IconButton
											size={"xs"}
											color={"var(--incorrect_ans)"}
											icon={<FaRProject />}
											variant={"solid"}
											onClick={() => {
												setFormData((prev) => ({
													...prev,
													recordId: _id,
													approve: undefined,
												}));
											}}
										/> */}
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
				{showDeletePopUp && (
					<DeletePopUp
						headerTitle={"Delete Timesheet Entry"}
						textTitle={"Are you sure you want to delete the time entry?"}
						isOpen={showDeletePopUp}
						onClose={handleClose}
						onOpen={handleDelete}
					/>
				)}
			</TableLayout>

			{showAddEntry && (
				<ExtraTimeEntryModal
					company={company}
					showAddEntry={showAddEntry}
					setRefresh={setRefresh}
					setShowAddEntry={setShowAddEntry}
					source={TIMESHEET_SOURCE.MANAGER}
				/>
			)}

			<HStack>
				<PrimaryButton
					size="sm"
					isDisabled={pageNum === 1}
					name="Prev"
					onOpen={() => setPageNum(pageNum - 1)}
				/>

				<NormalTextTitle align="center" width="100px" title={`Page ${pageNum} of ${totalPage}`} />
				<PrimaryButton
					size="sm"
					isDisabled={pageNum === totalPage}
					name="Next"
					onOpen={() => setPageNum(pageNum + 1)}
				/>
			</HStack>
		</>
	);
};

export default Timesheet;
