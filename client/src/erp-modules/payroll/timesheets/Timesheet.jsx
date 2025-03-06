import {
	Box,
	Checkbox,
	HStack,
	IconButton,
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
import SelectList from "components/ui/form/select/SelectList";
import DeletePopUp from "components/ui/modal/DeletePopUp";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import { COLS } from "constant";
import { useEffect, useState } from "react";
import { GoPlusCircle } from "react-icons/go";
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
import ActionAll from "./ActionAll";
import {
	BREAK_TYPES_TITLE,
	getParamKey,
	getPayTypeStyle,
	getSourceStyle,
	getStatusStyle,
	PAY_TYPES,
	PAY_TYPES_TITLE,
	TIMESHEET_SOURCE,
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
		COLS.EMP_NAME,
		"Worked Date",
		"Role",
		"Department",
		"Source",
		"Pay Rate",
		"Pay Type",
		"Start Time",
		"End Time",
		"Break",
		"Total Hours",
		"Status",
		"",
		"Action",
	];
	const toast = useToast();

	const [totalPage, setTotalPages] = useState(1);
	const limit = 20;
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
				const ids = timesheetData.filter((_) => _.clockOut)?.map((item) => item._id);
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

	const handleSubmit = async () => {
		try {
			const updatedRec = timesheetData.find((record) => record._id === formData.recordId);
			formData.clockIn = updatedRec.clockIn;
			formData.clockOut = updatedRec.clockOut;
			formData.company = updatedRec.companyName;
			formData.empId = updatedRec.employeeId?._id;
			formData.payType = updatedRec.payType;
			formData.source = updatedRec?.source || TIMESHEET_SOURCE.MANAGER;

			if (formData.recordId) {
				const { data } = await TimesheetService.updateTimesheet(formData, formData.recordId);
				// setRefresh((prev) => !prev);

				if (data.message) {
					toast({
						title: data.message,
						status: "success",
						duration: 1500,
						isClosable: true,
					});
				}
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

	useEffect(() => {
		handlePayTypeSubmit();
	}, [formData?.payType]);

	const handlePayTypeSubmit = async () => {
		try {
			const updatedRec = timesheetData.find((record) => record._id === formData.recordId);
			formData.clockIn = updatedRec.clockIn;
			formData.clockOut = updatedRec.clockOut;
			formData.company = updatedRec.companyName;
			formData.empId = updatedRec.employeeId?._id;
			formData.payType = updatedRec.payType;
			formData.regHoursWorked = updatedRec?.regHoursWorked;
			formData.overtimeHoursWorked = updatedRec?.overtimeHoursWorked;
			formData.dblOvertimeHoursWorked = updatedRec?.dblOvertimeHoursWorked;
			formData.statDayHoursWorked = updatedRec?.statDayHoursWorked;
			formData.sickPayHours = updatedRec?.sickPayHours;
			formData.statDayHours = updatedRec?.statDayHours;
			formData.breakHoursWorked = updatedRec?.breakHoursWorked;
			formData.vacationPayHours = updatedRec?.vacationPayHours;

			if (formData.recordId) {
				const { data } = await TimesheetService.updateTimesheetPayType(formData, formData.recordId);
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

	const handleUpdateData = (id, field, value, paramHours, param_hours_worked) => {
		if (field === "payType") {
			const { param_hours } = getParamKey(value);
			const updatedData = timesheetData?.map((record) =>
				record._id === id
					? { ...record, [param_hours]: param_hours_worked, [field]: value }
					: record,
			);
			setFormData({
				param_hours: paramHours,
				recordId: id,
				[field]: value,
			});
			setTimesheetData(updatedData);
			return;
		}
		const updatedData = timesheetData?.map((record) =>
			record._id === id ? { ...record, [field]: value } : record,
		);
		setFormData({
			param_hours: paramHours,
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
								index === 12 ? (
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
											width={col.includes("Hours") && "80px"}
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
							<EmptyRowRecord data={timesheetData} colSpan={cols?.length} progress={progress} />
						)}
						{!loading &&
							timesheetData?.map(
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
										clockOut,
										notDevice,
										employeeId,
										startTime,
										endTime,
										regBreakHoursWorked,
										source,
										isEditable,
										isActionDisabled,
										showAddBreak,
										positions,
										approveStatusAction,
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

									const isDisabled = !clockIn || !clockOut;

									return (
										<Tr
											key={_id}
											bg={rowBg ?? ""}
											_hover={{ bg: rowBg ?? "var(--phoneCall_bg_light)" }}
										>
											<Td py={0}>
												<TextTitle maxW="130px" title={employeeId?.fullName} />
											</Td>
											<Td py={0}>
												<TextTitle title={clockIn && getTimeCardFormat(clockIn, notDevice, true)} />
											</Td>
											<Td py={0}>
												<NormalTextTitle
													maxW="130px"
													size="sm"
													title={positions?.length ? positions[0]?.title : ""}
												/>
											</Td>
											<Td py={0}>
												<NormalTextTitle
													maxW="120px"
													size="sm"
													title={positions?.length ? positions[0]?.employmentDepartment : ""}
												/>
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
											<Td p={0}>
												<SelectList
													w="150px"
													id={_id}
													type="payType"
													handleSelect={(type, value, rowId) =>
														handleUpdateData(rowId, type, value, param_hours, param_hours_worked)
													}
													code="type"
													selectedValue={type}
													data={PAY_TYPES}
													isTimesheetPayType
												/>
											</Td>
											<Td p={0.5}>
												<Input
													cursor={isEditable ? "pointer" : "auto"}
													size={"sm"}
													onBlur={() => isEditable && handleSubmit()}
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
											<Td p={0.5} pl={2}>
												<Input
													cursor={isEditable ? "pointer" : "auto"}
													size={"sm"}
													onBlur={() => isEditable && handleSubmit()}
													className={`timeClockOutInput ${_id}`}
													type="time"
													name="endTime"
													value={endTime || ""}
													onClick={() => isEditable && showPicker(`timeClockOutInput ${_id}`)}
													onChange={(e) =>
														isEditable &&
														handleUpdateData(_id, "endTime", e.target.value, param_hours)
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
											<Td py={0} w="60px" pr={0}>
												<Checkbox
													colorScheme="facebook"
													isChecked={checkedRows.includes(_id)}
													onChange={() => !isDisabled && handleCheckboxChange(_id)}
												/>
											</Td>
											<Td py={0} pl={0}>
												<ActionAll
													id={_id}
													w="100px"
													isRowAction
													status={approveStatus}
													handleButtonClick={(action) => handleAction(_id, action, param_hours)}
													isApproveDisabled={isDisabled}
												/>
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
