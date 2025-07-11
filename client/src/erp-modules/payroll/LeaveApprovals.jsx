import { Badge, Box, Checkbox, Table, Tbody, Td, Th, Thead, Tr, useToast } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import TimesheetService from "services/TimesheetService";
import { formatDateBar } from "utils/convertDate";
import { tabScrollCss } from "./onboard-user/customInfo";
import ActionAll from "./timesheets/ActionAll";
import { ACTION_STATUS, getStatusStyle, TIMESHEET_STATUS } from "./timesheets/data";

const LeaveApprovals = () => {
	const leaveRequestCols = [
		"Employee Name",
		"Type",
		"Start Date",
		"End Date",
		"Status",
		"Total Days",
		"",
		"Action",
	];
	const company = LocalStorageService.getItem("selectedCompany");
	const toast = useToast();
	const initialFormData = {
		status: "",
		company,
		recordId: null,
	};
	const [formData, setFormData] = useState(initialFormData);
	const [leaveRecords, setLeaveRecords] = useState(null);
	const [isAllChecked, setIsAllChecked] = useState(true);
	const [checkedRows, setCheckedRows] = useState([]);
	const [allRequestIDs, setAllRequestIDs] = useState([]);
	const [rowAction, setRowAction] = useState(ACTION_STATUS[0].title);
	const [rowId, setRowId] = useState("");

	useEffect(() => {
		if (rowId && !checkedRows.includes(rowId)) {
			setCheckedRows([...checkedRows, rowId]);
		}
	}, [rowId]);

	useEffect(() => {
		const fetchLeaveRequests = async () => {
			try {
				const { data } = await TimesheetService.getAllEmployeeLeaveRequests(company);
				data?.map((rec) => (rec.statusBtnCss = getStatusStyle(rec?.status)));
				const ids = data?.map((item) => item._id);
				setAllRequestIDs(ids);
				setLeaveRecords(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchLeaveRequests();
	}, []);

	useEffect(() => {
		const updateLeaveRequest = async () => {
			try {
				const { data } = await TimesheetService.updateLeave(formData, formData.recordId);
				toast({
					title: "Action completed successfully!",
					status: "success",
					duration: 1500,
					isClosable: true,
				});
				const updatedRecordIndex = leaveRecords?.findIndex(
					(record) => record._id === formData?.recordId,
				);
				if (updatedRecordIndex > -1) {
					const updatedData = leaveRecords?.map((record) =>
						record._id === formData?.recordId
							? {
									...record,
									status: data?.status,
									statusBtnCss: getStatusStyle(data?.status),
							  }
							: record,
					);
					setLeaveRecords(updatedData);
				}
			} catch (error) {}
		};
		if (formData?.recordId) updateLeaveRequest();
	}, [formData?.recordId]);

	const handleHeaderCheckboxChange = (e) => {
		setIsAllChecked(e.target.checked);
		if (e.target.checked) setCheckedRows(allRequestIDs);
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

	const handleAction = (id, value) => {
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
		value = TIMESHEET_STATUS.find((_) => _.value.includes(value)).value;
		setFormData((prev) => ({
			...prev,
			recordId: id,
			status: value,
		}));
	};
	return (
		<PageLayout title={"Leave Requests"}>
			<Box overflow="auto" height="calc(100vh - 230px)" w={"100%"} css={tabScrollCss}>
				<Table bg="var(--lead_cards_bg)" variant="simple">
					<Thead position="sticky" top={-1} zIndex={3}>
						<Tr>
							{leaveRequestCols?.map((col, colIndex) =>
								colIndex === leaveRequestCols?.length - 2 ? (
									<Th key={`action_${col}_${colIndex}`} bg="var(--th_bg)">
										<Checkbox
											isChecked={isAllChecked}
											colorScheme="facebook"
											onChange={(e) => handleHeaderCheckboxChange(e)}
										/>
									</Th>
								) : (
									<Th
										position={colIndex === 0 && "sticky"}
										left={colIndex === 0 && "0"}
										zIndex={colIndex === 0 && 1}
										key={`${col}_${colIndex}`}
										pl={colIndex === 0 && "1em !important"}
										bg="var(--th_bg)"
									>
										<TextTitle title={col} />
									</Th>
								),
							)}
						</Tr>
					</Thead>
					<Tbody>
						{(!leaveRecords || leaveRecords?.length === 0) && (
							<EmptyRowRecord data={leaveRecords} colSpan={leaveRequestCols?.length} />
						)}
						{leaveRecords?.map(
							({
								_id,
								employeeId,
								type,
								startDate,
								endDate,
								status,
								totalLeaveDays,
								statusBtnCss,
							}) => (
								<Tr key={_id} _hover={{ bg: "var(--phoneCall_bg_light)" }}>
									<Td py={0}>
										<TextTitle maxW="130px" size="sm" title={employeeId?.fullName} />
									</Td>
									<Td py={0}>
										<NormalTextTitle size="sm" title={type} />
									</Td>
									<Td py={0}>
										<NormalTextTitle maxW="120px" size="sm" title={formatDateBar(startDate)} />
									</Td>
									<Td py={0}>
										<NormalTextTitle maxW="120px" size="sm" title={formatDateBar(endDate)} />
									</Td>
									<Td py={0}>
										<Badge
											bg={statusBtnCss?.bg}
											color={statusBtnCss?.color}
											px={3}
											py={1}
											borderRadius="md"
											fontWeight="medium"
											textTransform={"capitalize"}
										>
											{status}
										</Badge>
									</Td>
									<Td py={0}>
										<NormalTextTitle maxW="120px" size="sm" title={totalLeaveDays || "NA"} />
									</Td>
									<Td py={0} w="60px" pr={0}>
										<Checkbox
											colorScheme="facebook"
											isChecked={checkedRows.includes(_id)}
											onChange={() => handleCheckboxChange(_id)}
										/>
									</Td>
									<Td py={0} pl={0}>
										<ActionAll
											w="108px"
											id={_id}
											isRowAction
											status={status}
											handleButtonClick={(action) => handleAction(_id, action)}
											setRowAction={setRowAction}
											setRowId={setRowId}
										/>
									</Td>
								</Tr>
							),
						)}
					</Tbody>
				</Table>
			</Box>
		</PageLayout>
	);
};

export default LeaveApprovals;
