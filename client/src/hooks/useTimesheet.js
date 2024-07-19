import { useEffect, useState } from "react";
import TimesheetService from "services/TimesheetService";

const useTimesheet = (isManagerView, userId) => {
	const [timesheets, setTimesheets] = useState(null);

	const fetchAllEmployeeTimesheet = async () => {
		try {
			const response = isManagerView
				? await TimesheetService.getTimesheets()
				: await TimesheetService.getTimesheetById(userId);
			setTimesheets(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchAllEmployeeTimesheet();
	}, []);

	return timesheets;
};

export default useTimesheet;
