import { useEffect, useState } from "react";
import TimesheetService from "services/TimesheetService";

const useTimesheet = (company, userId, refresh) => {
	const [timesheets, setTimesheets] = useState(null);

	const fetchAllEmployeeTimesheet = async () => {
		try {
			const response = userId
				? await TimesheetService.getTimesheetById(company, userId)
				: await TimesheetService.getTimesheets(company);
			setTimesheets(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchAllEmployeeTimesheet();
	}, [company, refresh]);

	return timesheets;
};

export default useTimesheet;
