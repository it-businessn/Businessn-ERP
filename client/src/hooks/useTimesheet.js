import { useEffect, useState } from "react";
import TimesheetService from "services/TimesheetService";

const useTimesheet = (company, userId, refresh, filter) => {
	const [timesheets, setTimesheets] = useState(null);

	const fetchAllEmployeeTimesheet = async () => {
		try {
			const { data } = userId
				? await TimesheetService.getTimesheetById(company, userId)
				: filter
				? await TimesheetService.getFilteredTimesheets(company, filter)
				: await TimesheetService.getTimesheets(company);
			setTimesheets(data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (
			refresh ||
			filter?.startDate ||
			filter?.filteredEmployees.length ||
			filter?.filteredDept.length
		) {
			fetchAllEmployeeTimesheet();
		}
	}, [
		company,
		refresh,
		filter?.startDate,
		filter?.filteredEmployees,
		filter?.filteredDept,
		filter?.filteredCC,
	]);

	return timesheets;
};

export default useTimesheet;
