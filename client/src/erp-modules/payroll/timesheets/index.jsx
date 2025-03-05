import { Flex, HStack, IconButton, useToast } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import DeletePopUp from "components/ui/modal/DeletePopUp";
import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";
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
import DateFilterPopup from "./DateFilterPopup";
import OtherFilter from "./OtherFilter";
import Timecard from "./Timecard";
import Timesheet from "./Timesheet";

const Timesheets = () => {
	const { id } = useParams();
	const toast = useToast();
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const loggedInUser = LocalStorageService.getItem("user");
	const isManagerView = isManager(loggedInUser?.role);
	const userId = id ? id : isManagerView ? null : loggedInUser._id;

	const { payGroupSchedule, closestRecord, closestRecordIndex } = usePaygroup(company, false);
	const lastRecord = payGroupSchedule?.length > 0 && payGroupSchedule[closestRecordIndex - 1];

	const [dataRefresh, setDataRefresh] = useState(false);
	const [filter, setFilter] = useState(null);
	const { employees } = useEmployees(false, company, false, true);
	const departments = useDepartment(company);
	const cc = useCostCenter(company);

	const [date, setDate] = useState(getDefaultDate);

	const [timesheets, setTimesheets] = useState(null);
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
	const [filteredDept, setFilteredDept] = useState([]);
	const [filteredCC, setFilteredCC] = useState([]);

	const toggleDateFilter = () => setShowDateFilter(!showDateFilter);
	const toggleEmpFilter = () => setShowEmpFilter((prev) => (employees?.length ? !prev : prev));
	const toggleDeptFilter = () => setShowDeptFilter((prev) => (departments?.length ? !prev : prev));
	const toggleCCFilter = () => setShowCCFilter((prev) => !prev);
	const handleFilter = () => console.log(filteredEmployees);

	const [refresh, setRefresh] = useState(false);
	const [isAllChecked, setIsAllChecked] = useState(true);
	const [allTimesheetIDs, setAllTimesheetIDs] = useState([]);
	const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);

	// useEffect(() => {
	// 	if (closestRecord && !startDate && !endDate) {
	// 		setStartDate(todayDate);
	// 		setEndDate(todayDate);
	// 	}
	// }, [closestRecord]);

	useEffect(() => {
		setStartDate(moment().format("YYYY-MM-DD"));
		setEndDate(moment().format("YYYY-MM-DD"));
	}, []);

	const handleRefresh = () => setDataRefresh(!dataRefresh);

	const TABS = [
		{
			id: 0,
			type: "Timesheet",
			name: (
				<Timesheet
					setTimesheetRefresh={setDataRefresh}
					company={company}
					pageNum={pageNum}
					setPageNum={setPageNum}
					userId={userId}
					filter={filter}
					showAddEntry={showAddEntry}
					setShowAddEntry={setShowAddEntry}
					timesheets={timesheets}
					setTimesheets={setTimesheets}
					isAllChecked={isAllChecked}
					setIsAllChecked={setIsAllChecked}
					allTimesheetIDs={allTimesheetIDs}
					setAllTimesheetIDs={setAllTimesheetIDs}
					refresh={refresh}
					setRefresh={setRefresh}
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
					userId={userId}
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
	const showComponent = (viewMode) => TABS.find(({ type }) => type === viewMode)?.name;

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

	const handleClose = () => setShowConfirmationPopUp(false);

	const handleApprove = async () => {
		handleClose();
		const { data } = await TimesheetService.approveTimesheets(allTimesheetIDs);
		if (data) {
			toast({
				title: "Approved successfully!",
				description: "Your action was completed successfully.",
				status: "success",
				duration: 1500,
				isClosable: true,
			});
			setRefresh((prev) => !prev);
		}
	};

	return (
		<PageLayout
			width="full"
			title={"Timesheets"}
			showDate
			valueText1={date}
			handleChange={(value) => setDate(value)}
			isTimesheet
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

			<HStack justifyContent="space-between" position="sticky" zIndex={4}>
				<Flex w="80%" gap={5}>
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
						data={departments}
						filteredData={filteredDept}
						setFilteredData={setFilteredDept}
						helperText="department"
					/>
					<OtherFilter
						showOtherFilter={timesheets && showCCFilter}
						toggleOtherFilter={toggleCCFilter}
						handleFilter={handleFilter}
						data={cc}
						filteredData={filteredCC}
						setFilteredData={setFilteredCC}
						helperText="cost center"
					/>
				</Flex>
				<Flex w="10%">
					<PrimaryButton
						isDisabled={!isAllChecked || !timesheets?.length}
						color="var(--primary_bg)"
						bg="var(--correct_ans)"
						name="Approve All"
						px={0}
						hover={{
							bg: "var(--correct_ans)",
							color: "var(--primary_bg)",
						}}
						onOpen={() => setShowConfirmationPopUp(true)}
					/>
				</Flex>
			</HStack>

			{showConfirmationPopUp && (
				<DeletePopUp
					headerTitle="Please confirm"
					textTitle="Are you sure you want to approve all timesheet records?"
					isOpen={showConfirmationPopUp}
					onClose={handleClose}
					onOpen={handleApprove}
				/>
			)}

			{showComponent(viewMode)}
		</PageLayout>
	);
};

export default Timesheets;
