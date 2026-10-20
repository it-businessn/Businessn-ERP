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

	// F-13: the filter arrays are rebuilt by the parent on every render, so
	// depending on their identity refetched on unrelated re-renders. Compare by
	// value instead.
	const filterKey = JSON.stringify([
		filter?.startDate,
		filter?.filteredEmployees,
		filter?.filteredDept,
		filter?.filteredCC,
	]);

	useEffect(() => {
		if (
			refresh ||
			filter?.startDate ||
			filter?.filteredEmployees?.length ||
			filter?.filteredDept?.length
		) {
			fetchAllEmployeeTimesheet();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [company, refresh, filterKey]);

	return timesheets;
};

export default useTimesheet;
