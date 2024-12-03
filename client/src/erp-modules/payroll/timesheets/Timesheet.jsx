import { Box, Input, Spinner } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import { useCallback, useEffect, useState } from "react";
import { FixedSizeList as List } from "react-window";
import TimesheetService from "services/TimesheetService";

const Timesheet = ({ company, setShowAddEntry, showAddEntry, filter, setTimesheetRefresh }) => {
	const [timesheets, setTimesheets] = useState(null);
	const [refresh, setRefresh] = useState(false);

	const PAGE_SIZE = 20;
	const [items, setItems] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [page, setPage] = useState(1);

	const [deleteRecordId, setDeleteRecordId] = useState(false);
	const [showDeletePopUp, setShowDeletePopUp] = useState(false);

	const showPicker = (className) => {
		const timeInput = document.getElementsByClassName(className);
		if (timeInput) {
			timeInput[0].showPicker();
		}
	};

	// useEffect(() => {
	// 	const fetchAllTimecards = async () => {
	// 		try {
	// 			const post = await TimesheetService.addTimecard([]);
	// 			if (post.data) {
	// 				setRefresh(true);
	// 			}
	// 		} catch (error) {
	// 			console.error(error);
	// 		}
	// 	};
	// 	fetchAllTimecards();
	// }, []);

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
	const [timesheetData, setTimesheetData] = useState(timesheets);
	// useEffect(() => {
	// 	const fetchAllEmployeeTimesheet = async () => {
	// 		setIsLoading(true);
	// 		try {
	// 			const { data } = await TimesheetService.getFilteredTimesheets(company, filter, {
	// 				params: { page, limit: PAGE_SIZE },
	// 			});
	// 			setItems((prevItems) => [...prevItems, ...data]);
	// 			setHasMore(data.length === PAGE_SIZE); // Check if more items are available

	// 			setTimesheets(data);
	// 		} catch (error) {
	// 			console.error(error);
	// 		} finally {
	// 			setIsLoading(false);
	// 		}
	// 	};
	// 	if (filter?.startDate) {
	// 		fetchAllEmployeeTimesheet();
	// 	}
	// }, [
	// 	filter?.startDate,
	// 	filter?.endDate,
	// 	filter?.filteredEmployees,
	// 	filter?.filteredDept,
	// 	refresh,
	// ]);
	const fetchData = useCallback(async (page, company, filter) => {
		setIsLoading(true);
		try {
			const { data } = await TimesheetService.getFilteredTimesheets(company, filter, {
				params: { page, limit: PAGE_SIZE },
			});
			setItems((prevItems) => [...prevItems, ...data]);
			setHasMore(data.length === PAGE_SIZE); // Check if more items are available
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		if (filter?.startDate) {
			fetchData(page, company, filter);
		}
	}, [
		page,
		fetchData,
		filter?.startDate,
		filter?.endDate,
		filter?.filteredEmployees,
		filter?.filteredDept,
		refresh,
	]);

	const Row = ({ index, style }) => {
		const item = items[index];
		if (!item) return null;
		return (
			<Box style={style} padding="4" borderBottom="1px solid #e2e8f0">
				<TextTitle title={item?.employeeId?.fullName} />
			</Box>
		);
	};

	useEffect(() => {
		if (timesheets) {
			setTimesheetData(timesheets);
			setTimesheetRefresh(false);
		}
	}, [timesheets]);

	const loadMoreItems = () => {
		if (isLoading || !hasMore) return;
		setPage((prevPage) => prevPage + 1);
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
			const record = await TimesheetService.deleteEntry({}, deleteRecordId);
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
			formData.empId = updatedRec.employeeId._id;

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
		"Employee Name",
		"Worked Date",
		"Department",
		"Pay Rate",
		"Pay Type",
		"Start Time",
		"End Time",
		// "Break/Lunch",
		"Total Hours",
		"Status",
		"Action",
	];
	return (
		<Box height="400px" width="300px" border="1px solid #e2e8f0" overflow="hidden">
			<List
				height={400}
				itemCount={items.length + (hasMore ? 1 : 0)} // Add extra row for loading spinner
				itemSize={50}
				width={300}
				onItemsRendered={({ visibleStopIndex }) => {
					if (visibleStopIndex + 1 >= items.length) loadMoreItems();
				}}
			>
				{({ index, style }) =>
					index < items.length ? (
						<Row index={index} style={style} />
					) : (
						<Box style={style} textAlign="center" padding="4">
							{isLoading && <Spinner />}
						</Box>
					)
				}
			</List>
		</Box>
	);
};

export default Timesheet;
