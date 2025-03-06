import {
	Box,
	Checkbox,
	HStack,
	Input,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	useToast,
} from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import DeletePopUp from "components/ui/modal/DeletePopUp";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useState } from "react";
import TimesheetService from "services/TimesheetService";
import { getAmount } from "utils/convertAmt";
import {
	getClockInTimeFormat,
	getTimeCardFormat,
	getTimeFormat,
	getUTCTime,
} from "utils/convertDate";
import ActionAll from "./ActionAll";
import {
	getParamKey,
	getPayTypeStyle,
	getStatusStyle,
	PAY_TYPES_TITLE,
	TIMESHEET_STATUS,
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
	isAllChecked,
	setIsAllChecked,
	allTimesheetIDs,
	setAllTimesheetIDs,
	setRefresh,
	refresh,
	isActioned,
	setIsActioned,
	checkedRows,
	setCheckedRows,
}) => {
	const cols = [
		"Employee Name",
		"Worked Date",
		"Role",
		"Department",
		"Pay Rate",
		"Pay Type",
		"Start Time",
		"End Time",
		// "Break/Lunch",
		"Total Hours",
		"Status",
		"",
		"Action",
	];

	const toast = useToast();
	const [totalPage, setTotalPages] = useState(1);
	const limit = 40;
	const [progress, setProgress] = useState(0);
	const [loading, setLoading] = useState(false);

	const [deleteRecordId, setDeleteRecordId] = useState(false);
	const [showDeletePopUp, setShowDeletePopUp] = useState(false);

	useEffect(() => {
		const fetchAllEmployeeTimesheet = async () => {
			setTimesheetData(null);
			setLoading(true);
			setProgress(1);

			const interval = setInterval(() => {
				setProgress((prev) => (prev < 100 ? prev + 2 : prev));
			}, 2000);

			try {
				const { data } = await TimesheetService.getFilteredTimesheets(company, filter, {
					page: pageNum,
					limit,
				});

				const { totalPages, page, items } = data;
				clearInterval(interval);
				items?.map((_) => {
					_.approveStatusAction = _.approveStatus;
					const isOvertime = _.payType === PAY_TYPES_TITLE.OVERTIME_PAY;
					if (isOvertime) {
						_.startTime = getUTCTime(_.clockIn);
						_.endTime = getUTCTime(_.clockOut);
					} else {
						_.startTime = getClockInTimeFormat(_.clockIn);
						_.endTime = _.clockOut ? getTimeFormat(_.clockOut) : "";
					}
					return _;
				});
				setTimesheets(items);
				setTotalPages(totalPages > 0 ? totalPages : 1);
				setPageNum(page);
			} catch (error) {
				console.error(error);
				clearInterval(interval);
				setLoading(false);
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
		totalBreakHours: "",
		approve: undefined,
		company,
		recordId: null,
		empId: null,
		payType: "",
	};

	const [formData, setFormData] = useState(initialFormData);
	const [timesheetData, setTimesheetData] = useState([]);

	useEffect(() => {
		if (timesheets) {
			setTimesheetData(timesheets);
			setTimesheetRefresh(false);
			setProgress(100);
			setTimeout(() => setLoading(false), 500);
		}
	}, [timesheets]);

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

	const showPicker = (className) => {
		const timeInput = document.getElementsByClassName(className);
		if (timeInput) {
			timeInput[0].showPicker();
		}
	};

	useEffect(() => {
		if (timesheetData?.length) {
			if (isActioned) {
				setCheckedRows(checkedRows.filter((id) => id !== formData?.recordId));
				setAllTimesheetIDs(allTimesheetIDs.filter((id) => id !== formData?.recordId));
				setIsAllChecked(false);
			} else {
				const ids = timesheetData.map((item) => item._id);
				setAllTimesheetIDs(ids);
				setCheckedRows(ids);
				setIsAllChecked(true);
			}
		}
	}, [timesheetData, isActioned]);

	useEffect(() => {
		if (checkedRows.length === timesheetData?.length) {
			setIsAllChecked(true);
		}
	}, [checkedRows]);

	const handleHeaderCheckboxChange = (e) => {
		setIsActioned(false);
		setIsAllChecked(e.target.checked);
		if (e.target.checked) setCheckedRows(allTimesheetIDs);
		if (!e.target.checked) setCheckedRows([]);
	};

	const handleCheckboxChange = (rowId) => {
		if (checkedRows.includes(rowId)) {
			setIsAllChecked(false);
			setCheckedRows(checkedRows.filter((id) => id !== rowId));
		} else {
			setCheckedRows([...checkedRows, rowId]);
		}
	};

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

	const handleSubmit = async () => {
		try {
			const updatedRec = timesheetData.find((record) => record._id === formData.recordId);
			formData.clockIn = updatedRec.clockIn;
			formData.clockOut = updatedRec.clockOut;
			formData.company = updatedRec.companyName;
			formData.empId = updatedRec.employeeId?._id;
			formData.payType = updatedRec.payType;

			if (formData.recordId) {
				const { data } = await TimesheetService.updateTimesheet(formData, formData.recordId);
				// setRefresh((prev) => !prev);
				if (data) {
					const updatedData = timesheetData?.map((record) =>
						record._id === formData.recordId
							? {
									...record,
									clockIn: data?.clockIn,
									clockOut: data?.clockOut,
									regHoursWorked: data?.regHoursWorked,
									overtimeHoursWorked: data?.overtimeHoursWorked,
									dblOvertimeHoursWorked: data?.dblOvertimeHoursWorked,
									statDayHoursWorked: data?.statDayHoursWorked,
									statDayHours: data?.statDayHours,
									sickPayHours: data?.sickPayHours,
									vacationPayHours: data?.vacationPayHours,
									breakHoursWorked: data?.breakHoursWorked,
									approveStatus: data?.approveStatus,
							  }
							: record,
					);
					setTimesheetData(updatedData);
					setIsActioned(true);
				}
			}
		} catch (error) {}
	};

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

	const handleAction = (id, value, param_hours) => {
		if (!checkedRows.includes(id)) {
			toast({
				title: "Action Incomplete!",
				description: "Please check the row to apply the action.",
				status: "warning",
				duration: 1500,
				isClosable: true,
			});
			return;
		}
		if (value === TIMESHEET_STATUS_LABEL.DELETE) {
			setShowDeletePopUp(true);
			setDeleteRecordId(id);
		} else {
			value = TIMESHEET_STATUS.find((_) => _.value.includes(value)).value;
			setFormData((prev) => ({
				...prev,
				recordId: id,
				approve:
					value === TIMESHEET_STATUS_LABEL.APPROVED
						? true
						: value === TIMESHEET_STATUS_LABEL.REJECTED
						? false
						: null,
				startTime: null,
				endTime: null,
				param_hours,
			}));
		}
	};

	return (
		<>
			<Box overflow="auto" height="72vh" w={"100%"}>
				<Table bg="var(--lead_cards_bg)" variant="simple">
					<Thead position="sticky" top={-1} zIndex={3}>
						<Tr>
							{cols?.map((col, index) =>
								index === 10 ? (
									<Th key={`action_${index}`}>
										<Checkbox
											isChecked={isAllChecked}
											colorScheme="facebook"
											onChange={(e) => handleHeaderCheckboxChange(e)}
										/>
									</Th>
								) : (
									<Th key={`${col}_${index}`} pl={index === 0 && "1em !important"}>
										<TextTitle
											width={col.includes("Hours") && "100px"}
											whiteSpace={col.includes("Hours") && "wrap"}
											title={col}
										/>
									</Th>
								),
							)}
						</Tr>
					</Thead>
					<Tbody>
						{(!timesheetData || timesheetData?.length === 0 || loading) && (
							<EmptyRowRecord data={timesheetData} colSpan={cols.length} progress={progress} />
						)}
						{!loading &&
							timesheetData?.map(
								({
									_id,
									approveStatus,
									payType,
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
									totalBreakHours,
									totalWorkedHours,
									notDevice,
									employeeId,
									startTime,
									endTime,
									positions,
									approveStatusAction,
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
											: param_hours === "breakHoursWorked"
											? breakHoursWorked
											: 0;

									const isStatPay = payType === PAY_TYPES_TITLE.STAT_PAY;

									const isDisabled = !clockIn || !clockOut;

									return (
										<Tr key={_id} _hover={{ bg: "var(--phoneCall_bg_light)" }}>
											<Td py={0}>
												<TextTitle maxW="150px" title={employeeId?.fullName} />
											</Td>
											<Td py={0}>
												<TextTitle title={clockIn && getTimeCardFormat(clockIn, notDevice, true)} />
											</Td>
											<Td py={0}>
												<NormalTextTitle
													maxW="150px"
													size="sm"
													title={positions.length ? positions[0]?.title : ""}
												/>
											</Td>
											<Td py={0}>
												<NormalTextTitle
													maxW="150px"
													size="sm"
													title={positions.length ? positions[0]?.employmentDepartment : ""}
												/>
											</Td>
											<Td textAlign={"right"} py={0} w={"90px"}>
												{getAmount(param_pay_type)}
											</Td>
											<Td py={0}>
												{/* <SelectList
													id={_id}
													type="payType"
													handleSelect={(type, value, rowId) =>
														handleUpdateData(rowId, type, value, param_hours)
													}
													code="type"
													selectedValue={type}
													data={PAY_TYPES}
													isTimesheetPayType
												/> */}
											</Td>
											<Td p={0.5}>
												<Input
													cursor={"pointer"}
													size={"sm"}
													onBlur={() => handleSubmit()}
													className={`timeClockInInput ${_id}`}
													type="time"
													name="startTime"
													value={startTime || ""}
													onClick={() => !isDisabled && showPicker(`timeClockInInput ${_id}`)}
													onChange={(e) => {
														if (!isDisabled) {
															handleUpdateData(_id, "startTime", e.target.value, param_hours);
														}
													}}
													required
												/>
											</Td>
											<Td p={0.5} pl={3}>
												<Input
													cursor={"pointer"}
													size={"sm"}
													onBlur={() => handleSubmit()}
													className={`timeClockOutInput ${_id}`}
													type="time"
													name="endTime"
													value={endTime || ""}
													onClick={() => showPicker(`timeClockOutInput ${_id}`)}
													onChange={(e) =>
														handleUpdateData(_id, "endTime", e.target.value, param_hours)
													}
													required
												/>
											</Td>
											{/* <Td p={0} pl={3}>
								{renderEditableInput(
									_id,
									"totalBreakHours",
									totalBreakHours,
									param_hours,
									isStatPay,
								)}
							</Td> */}

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
												<Checkbox
													colorScheme="facebook"
													isChecked={checkedRows.includes(_id)}
													onChange={() => handleCheckboxChange(_id)}
												/>
											</Td>
											<Td py={0}>
												<ActionAll
													id={_id}
													w="150px"
													isRowAction
													status={approveStatus}
													handleButtonClick={(action) => handleAction(_id, action, param_hours)}
												/>
												{/* <SelectList
													id={_id}
													type="approveStatusAction"
													handleSelect={(type, value, rowId) =>
														handleUpdateData(rowId, type, value, param_hours)
													}
													code="name"
													selectedValue={approveStatusAction}
													data={ACTION_STATUS}
													isTimesheetAction
												/> */}
											</Td>
										</Tr>
									);
								},
							)}
					</Tbody>
				</Table>
			</Box>
			{showDeletePopUp && (
				<DeletePopUp
					headerTitle={"Delete Timesheet Entry"}
					textTitle={"Are you sure you want to delete the time entry?"}
					isOpen={showDeletePopUp}
					onClose={handleClose}
					onOpen={handleDelete}
				/>
			)}

			{showAddEntry && (
				<ExtraTimeEntryModal
					company={company}
					showAddEntry={showAddEntry}
					setRefresh={setRefresh}
					setShowAddEntry={setShowAddEntry}
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
