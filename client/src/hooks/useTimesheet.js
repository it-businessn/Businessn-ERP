import { useEffect, useState } from "react";
import TimesheetService from "services/TimesheetService";

const useTimesheet = (company, userId, refresh, filter) => {
	const [timesheets, setTimesheets] = useState(null);

	const fetchAllEmployeeTimesheet = async () => {
		try {
			const response = userId
				? await TimesheetService.getTimesheetById(company, userId)
				: filter
				? await TimesheetService.getFilteredTimesheets(company, filter)
				: await TimesheetService.getTimesheets(company);
			setTimesheets(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchAllEmployeeTimesheet();
	}, [company, refresh, filter]);

	return timesheets;
};

export default useTimesheet;
