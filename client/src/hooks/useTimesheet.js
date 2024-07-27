import { useEffect, useState } from "react";
import TimesheetService from "services/TimesheetService";

const useTimesheet = (company, isManagerView, userId) => {
	const [timesheets, setTimesheets] = useState(null);

	const fetchAllEmployeeTimesheet = async () => {
		try {
			const response = isManagerView
				? await TimesheetService.getTimesheets(company)
				: await TimesheetService.getTimesheetById(userId);
			// const response = userId
			// 	? await TimesheetService.getTimesheetById(userId)
			// 	: await TimesheetService.getTimesheets();
			setTimesheets(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchAllEmployeeTimesheet();
	}, [company]);

	return timesheets;
};

export default useTimesheet;
