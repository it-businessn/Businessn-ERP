import OutlineButton from "components/ui/button/OutlineButton";
import useEmployeeHoursWorked from "hooks/useEmployeeHoursWorked";
import { ROUTE_PATH } from "routes";
import WorkviewTab from "./WorkviewTab";

const HourlyAllocation = ({ company, closestRecord }) => {
	const data = useEmployeeHoursWorked(company, closestRecord);
	const filteredEmp = [];
	const isExtraRun = closestRecord?.isExtraRun;

	if (isExtraRun && data) {
		const selectedEmp = closestRecord.selectedEmp;
		selectedEmp.forEach((emp) => {
			const empExists = data?.find((_) => _.empId.fullName === emp);
			if (empExists) {
				filteredEmp.push(empExists);
			}
		});
	}

	filteredEmp.map((_) => {
		_.totalDblOvertimeHoursWorked = 0;
		_.totalOvertimeHoursWorked = 0;
		_.totalRegHoursWorked = 0;
		_.totalSickHoursWorked = 0;
		_.totalStatDayHoursWorked = 0;
		_.totalStatHours = 0;
		_.totalVacationHoursWorked = 0;
		return _;
	});
	const hourlyData = isExtraRun ? filteredEmp : data;

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
				{ key: "", pair: <OutlineButton label="View Timesheets" /> },
			]}
			data={hourlyData}
			label="Setup"
			path={`${ROUTE_PATH.PAYROLL}${ROUTE_PATH.TIMESHEETS}`}
		/>
	);
};

export default HourlyAllocation;
