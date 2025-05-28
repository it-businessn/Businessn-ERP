import { Flex, HStack, IconButton, useToast } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import DeletePopUp from "components/ui/modal/DeletePopUp";
import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";
import { ROLES } from "constant";
import useCompany from "hooks/useCompany";
import useCostCenter from "hooks/useCostCenter";
import useDepartment from "hooks/useDepartment";
import useEmployees from "hooks/useEmployees";
import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import moment from "moment";
import { useEffect, useState } from "react";
import { IoRefresh } from "react-icons/io5";
import { useParams } from "react-router-dom";
import LocalStorageService from "services/LocalStorageService";
import TimesheetService from "services/TimesheetService";
import { isManager } from "utils";
import { getDefaultDate, getMomentDate } from "utils/convertDate";
import ActionAll from "./ActionAll";
import DateFilterPopup from "./DateFilterPopup";
import OtherFilter from "./OtherFilter";
import Timecard from "./Timecard";
import Timesheet from "./Timesheet";
import { convertToMinutes, TIMESHEET_STATUS, TIMESHEET_STATUS_LABEL } from "./data";

const Timesheets = () => {
	const loggedInUser = LocalStorageService.getItem("user");
	const deptName = loggedInUser?.role === ROLES.MANAGER ? loggedInUser?.department : null;
	const isManagerView = isManager(loggedInUser?.role);
	const { id } = useParams();
	const userId = id ? id : isManagerView ? null : loggedInUser._id;
	const toast = useToast();
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const { employees } = useEmployees(false, company, false, true, null, deptName);
	const departments = useDepartment(company);
	const cc = useCostCenter(company);
	const {
		hasMultiPaygroups,
		selectedPayGroupOption,
		setSelectedPayGroupOption,
		payGroups,
		selectedPayGroup,
		payGroupSchedule,
		closestRecord,
		closestRecordIndex,
	} = usePaygroup(company, false);

	const lastRecord = payGroupSchedule?.length > 0 && payGroupSchedule[closestRecordIndex - 1];
	const [dataRefresh, setDataRefresh] = useState(false);
	const [filter, setFilter] = useState(null);
	const [date, setDate] = useState(getDefaultDate);
	const [timesheets, setTimesheets] = useState(null);
	const [timesheetData, setTimesheetData] = useState([]);
	// const [selectedFilter, setSelectedFilter] = useState("This pay period");
	const [pageNum, setPageNum] = useState(1);
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [showDateFilter, setShowDateFilter] = useState(false);
	const [showEmpFilter, setShowEmpFilter] = useState(false);
	const [showDeptFilter, setShowDeptFilter] = useState(false);
	const [showCCFilter, setShowCCFilter] = useState(false);
	const [showAddEntry, setShowAddEntry] = useState(false);
	const [filteredEmployees, setFilteredEmployees] = useState([]);
	const [filteredDept, setFilteredDept] = useState(deptName ? [deptName] : []);
	const [filteredCC, setFilteredCC] = useState([]);
	const [refresh, setRefresh] = useState(false);
	const [isAllChecked, setIsAllChecked] = useState(true);
	const [isActioned, setIsActioned] = useState(false);
	const [allTimesheetIDs, setAllTimesheetIDs] = useState([]);
	const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);
	const [isAllSameStatus, setIsAllSameStatus] = useState(false);
	const [isActionSwitched, setIsActionSwitched] = useState(TIMESHEET_STATUS_LABEL.APPROVED);
	const [checkedRows, setCheckedRows] = useState([]);
	const [actionName, setActionName] = useState(TIMESHEET_STATUS_LABEL.APPROVED);

	// useEffect(() => {
	// 	if (closestRecord && !startDate && !endDate) {
	// 		setStartDate(todayDate);
	// 		setEndDate(todayDate);
	// 	}
	// }, [closestRecord]);

	useEffect(() => {
		if (selectedPayGroup) {
			setSelectedPayGroupOption(selectedPayGroup?.name);
		}
	}, [selectedPayGroup]);

	useEffect(() => {
		if (timesheets?.length) {
			setIsAllSameStatus(timesheets?.every((_) => _?.approveStatus.includes(isActionSwitched)));
		} else {
			setIsAllSameStatus(true);
		}
	}, [isActionSwitched, timesheets]);

	useEffect(() => {
		if (id) {
			setFilteredEmployees([id]);
			setStartDate(getMomentDate(closestRecord?.payPeriodStartDate).format("YYYY-MM-DD"));
			setEndDate(getMomentDate(closestRecord?.payPeriodEndDate).format("YYYY-MM-DD"));
		} else {
			setStartDate(moment().format("YYYY-MM-DD"));
			setEndDate(moment().format("YYYY-MM-DD"));
		}
	}, [id, closestRecord]);

	const handleRefresh = () => setDataRefresh(!dataRefresh);
	const toggleDateFilter = () => setShowDateFilter(!showDateFilter);
	const toggleEmpFilter = () => setShowEmpFilter((prev) => (employees?.length ? !prev : prev));
	const toggleDeptFilter = () => setShowDeptFilter((prev) => (departments?.length ? !prev : prev));
	const toggleCCFilter = () => setShowCCFilter((prev) => !prev);
	const handleFilter = () => console.log(filteredEmployees);

	const checkOverlaps = (currentRecord) => {
		if (!currentRecord) return;

		const newStart = convertToMinutes(currentRecord.startTime);
		const newEnd = convertToMinutes(currentRecord.endTime);

		if (newStart === null || newEnd === null || newStart >= newEnd) {
			toast({
				title: "Invalid time range.",
				description: "Please make sure the start time is earlier than the end time.",
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "top-right",
			});
			return;
		}
		const currentDate = moment(currentRecord.clockIn).format("YYYY-MM-DD");
		const sameDayRecords = timesheetData.filter(
			(record) =>
				record._id !== currentRecord._id &&
				record.employeeId._id === currentRecord.employeeId._id &&
				moment(record.clockIn).format("YYYY-MM-DD") === currentDate,
		);
		if (sameDayRecords.length <= 1) return false;
		const hasOverlap = sameDayRecords.some((record) => {
			const otherStart = convertToMinutes(record.startTime);
			const otherEnd = convertToMinutes(record.endTime);
			return newStart < otherEnd && newEnd > otherStart;
		});
		return hasOverlap;
	};

	const TABS = [
		{
			id: 0,
			type: "Timesheet",
			name: (
				<Timesheet
					deptName={deptName}
					setTimesheetRefresh={setDataRefresh}
					company={company}
					pageNum={pageNum}
					setPageNum={setPageNum}
					filter={filter}
					showAddEntry={showAddEntry}
					setShowAddEntry={setShowAddEntry}
					timesheets={timesheets}
					setTimesheets={setTimesheets}
					timesheetData={timesheetData}
					setTimesheetData={setTimesheetData}
					isAllChecked={isAllChecked}
					setIsAllChecked={setIsAllChecked}
					setIsActioned={setIsActioned}
					isActioned={isActioned}
					allTimesheetIDs={allTimesheetIDs}
					setAllTimesheetIDs={setAllTimesheetIDs}
					refresh={refresh}
					setRefresh={setRefresh}
					checkedRows={checkedRows}
					setCheckedRows={setCheckedRows}
					checkOverlaps={checkOverlaps}
				/>
			),
		},
		{
			id: 1,
			type: "Timecards",
			name: (
				<Timecard
					setTimecardRefresh={setDataRefresh}
					company={company}
					timecardRefresh={dataRefresh}
					pageNum={pageNum}
					setPageNum={setPageNum}
					filter={{
						startDate: getMomentDate(closestRecord?.payPeriodStartDate).format("YYYY-MM-DD"),
						endDate: getMomentDate(closestRecord?.payPeriodEndDate).format("YYYY-MM-DD"),
					}}
					startDate
				/>
			),
		},
	];

	const [viewMode, setViewMode] = useState(TABS[0].type);
	useEffect(() => {
		setPageNum(1);
		setFilter((prev) => ({
			...prev,
			endDate,
			startDate,
			filteredEmployees,
			filteredDept,
		}));
		setShowEmpFilter(false);
		setShowDeptFilter(false);
		setShowCCFilter(false);
	}, [startDate, endDate, filteredEmployees, filteredDept, filteredCC, viewMode]);

	const showComponent = (viewMode) => TABS.find(({ type }) => type === viewMode)?.name;

	const CHECK_FILTER = [
		{
			label: "Shift Hours",
			onChange: (e) => handleCheckboxChange(e),
		},
		{
			label: "Breaks",
			onChange: (e) => handleCheckboxChange(e),
		},
	];
	const handleCheckboxChange = (e) => console.log(e);
	const handleClose = () => setShowConfirmationPopUp(false);

	const handleActionClick = (action) => {
		if (action === TIMESHEET_STATUS_LABEL.DELETE) {
			setActionName(action);
		} else {
			setActionName(TIMESHEET_STATUS.find((_) => _.value.includes(action)).value);
		}
		if (!checkedRows.length) {
			toast({
				title: "Action Incomplete!",
				description: "Please check the row to apply the action.",
				status: "warning",
				duration: 1500,
				isClosable: true,
			});
			return;
		}

		setShowConfirmationPopUp(true);
	};

	const handleActionAll = async () => {
		const getValidIDs = () => {
			if (actionName !== TIMESHEET_STATUS_LABEL.APPROVED) return checkedRows;
			return checkedRows.filter((id) => {
				const record = timesheetData.find((row) => row._id === id);
				return !checkOverlaps(record);
			});
		};

		const validIDs = getValidIDs();
		handleClose();
		try {
			const { data } = await TimesheetService.actionAllTimesheets({
				timesheetIDs: validIDs,
				approveStatus: actionName,
			});
			const isErrorMsg = Boolean(data?.message);

			toast({
				title: data?.message || "Action successful!",
				description: isErrorMsg
					? "Please make sure the start time is earlier than the end time."
					: "Your action was completed successfully.",
				status: isErrorMsg ? "error" : "success",
				duration: 3000,
				isClosable: true,
				position: "top-right",
			});
		} catch (error) {
			toast({
				title: "Something went wrong.",
				description: "Unable to perform the action.",
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "top-right",
			});
		}
		setRefresh((prev) => !prev);
		setCheckedRows([]);
	};

	const handleChange = (value) => {
		if (value !== "") {
			setSelectedPayGroupOption(value);
		}
	};

	return (
		<PageLayout
			width="35%"
			title={"Timesheets"}
			handleChange={handleChange}
			hasMultiPaygroups={hasMultiPaygroups}
			showPayGroup={true}
			selectedValue={selectedPayGroupOption}
			data={payGroups}
			selectPlaceholder="Select Paygroup"
			selectAttr="name"
			// handleChange={(value) => setDate(value)}
			isTimesheet
			// showCheckBox={
			// 	<VStack ml={5} alignItems="self-start">
			// 		{CHECK_FILTER.map(({ label, onChange }) => (
			// 			<Checkbox key={label} colorScheme="facebook" isChecked={true} onChange={onChange}>
			// 				{label}
			// 			</Checkbox>
			// 		))}
			// 	</VStack>
			// }
		>
			<HStack spacing={3} justify={"flex-end"} mt={-8}>
				<IconButton
					size={"sm"}
					bg={"var(--primary_button_bg)"}
					color={"var(--main_color)"}
					icon={<IoRefresh style={{ fontSize: "20px" }} />}
					variant={"solid"}
					onClick={handleRefresh}
				/>
				<PrimaryButton size={"sm"} name={"Add record"} onOpen={() => setShowAddEntry(true)} />
			</HStack>

			<HStack justifyContent="space-between">
				<Flex w="100%" gap={3}>
					<TabsButtonGroup
						mt={4}
						isOutlineTab
						tabs={TABS}
						setViewMode={setViewMode}
						viewMode={viewMode}
					/>
					<DateFilterPopup
						toggleDateFilter={toggleDateFilter}
						setEndDate={setEndDate}
						setStartDate={setStartDate}
						closestRecord={closestRecord}
						lastRecord={lastRecord}
						startDate={startDate}
						endDate={endDate}
					/>
					<OtherFilter
						showOtherFilter={timesheets && showEmpFilter}
						toggleOtherFilter={toggleEmpFilter}
						handleFilter={handleFilter}
						data={employees}
						filteredData={filteredEmployees}
						setFilteredData={setFilteredEmployees}
						helperText="employee"
					/>
					<OtherFilter
						showOtherFilter={timesheets && showDeptFilter}
						toggleOtherFilter={toggleDeptFilter}
						handleFilter={handleFilter}
						data={deptName ? departments?.filter((_) => _?.name === deptName) : departments}
						filteredData={filteredDept}
						setFilteredData={setFilteredDept}
						helperText="department"
					/>
					<OtherFilter
						isDisabled={deptName}
						showOtherFilter={timesheets && showCCFilter}
						toggleOtherFilter={toggleCCFilter}
						handleFilter={handleFilter}
						data={cc}
						filteredData={filteredCC}
						setFilteredData={setFilteredCC}
						helperText="cost center"
					/>
				</Flex>
				{viewMode === "Timesheet" && (
					<ActionAll
						isDisabled={isAllSameStatus}
						handleButtonClick={(action) => {
							handleActionClick(action);
						}}
						setIsActionSwitched={setIsActionSwitched}
					/>
				)}
			</HStack>

			{showConfirmationPopUp && (
				<DeletePopUp
					headerTitle="Please confirm"
					textTitle="Are you sure you want to apply the action?"
					isOpen={showConfirmationPopUp}
					onClose={handleClose}
					onOpen={handleActionAll}
				/>
			)}

			{showComponent(viewMode)}
		</PageLayout>
	);
};

export default Timesheets;
