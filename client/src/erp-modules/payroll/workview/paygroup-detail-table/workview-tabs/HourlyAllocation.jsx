import OutlineButton from "components/ui/button/OutlineButton";
import useEmployeeHoursWorked from "hooks/useEmployeeHoursWorked";
import { ROUTE_PATH } from "routes";
import WorkviewTab from "./WorkviewTab";

const HourlyAllocation = ({ company, closestRecord }) => {
	const data = useEmployeeHoursWorked(company, closestRecord);

	return (
		<WorkviewTab
			cols={[
				{ key: "Employee Name", pair: "obj", pair_key: "fullName" },
				{ key: "Regular Hours", pair: "totalRegHoursWorked" },
				{ key: "Overtime Hours", pair: "totalOvertimeHoursWorked" },
				{ key: "Double Overtime Hours", pair: "totalDblOvertimeHoursWorked" },
				{ key: "Stat. Pay Hours", pair: "totalStatDayHoursWorked" },
				{ key: "Vacation Hours", pair: "totalStatHoursWorked" },
				{ key: "Sick Pay Hours", pair: "totalSickHoursWorked" },
				{ key: "", pair: <OutlineButton label="View Timesheets" /> },
			]}
			data={data}
			label="Setup"
			path={`${ROUTE_PATH.PAYROLL}${ROUTE_PATH.TIMESHEETS}`}
		/>
	);
};

export default HourlyAllocation;