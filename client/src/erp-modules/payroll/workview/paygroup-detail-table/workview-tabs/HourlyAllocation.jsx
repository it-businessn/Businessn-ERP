import OutlineButton from "components/ui/button/OutlineButton";
import useEmployeeHoursWorked from "hooks/useEmployeeHoursWorked";
import { ROUTE_PATH } from "routes";
import WorkviewTab from "./WorkviewTab";

const HourlyAllocation = ({ company, closestRecord, groupId }) => {
	const data = useEmployeeHoursWorked(company, closestRecord, groupId);

	return (
		<WorkviewTab
			isHourly
			cols={[
				{ key: "Employee Name", pair: "obj", pair_key: "fullName" },
				{ key: "Regular Hours", pair: "totalRegHoursWorked" },
				{ key: "Overtime Hours", pair: "totalOvertimeHoursWorked" },
				{ key: "Double Overtime Hours", pair: "totalDblOvertimeHoursWorked" },
				{ key: "Stat. Pay Hours", pair: "totalStatHours" },
				{ key: "Stat. Worked Hours", pair: "totalStatDayHoursWorked" },
				{ key: "Vacation Hours", pair: "totalVacationHoursWorked" },
				{ key: "Sick Pay Hours", pair: "totalSickHoursWorked" },
				{
					key: "",
					pair: <OutlineButton name="setup" label="View Timesheets" />,
				},
			]}
			data={data}
			label="Setup"
			path={`${ROUTE_PATH.PAYROLL}${ROUTE_PATH.TIMESHEETS}`}
		/>
	);
};

export default HourlyAllocation;
