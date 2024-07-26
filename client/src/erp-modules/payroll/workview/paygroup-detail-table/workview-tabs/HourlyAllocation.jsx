import OutlineButton from "components/ui/button/OutlineButton";
import useEmployeePayInfo from "hooks/useEmployeePayInfo";
import { ROUTE_PATH } from "routes";
import WorkviewTab from "./WorkviewTab";

const HourlyAllocation = ({ company }) => {
	const data = useEmployeePayInfo(company);

	return (
		<WorkviewTab
			cols={[
				{ key: "Employee Name", pair: "obj", pair_key: "fullName" },
				{ key: "Regular Hours", pair: "dailyHours" },
				{ key: "Overtime Hours", pair: "overTimePay" },
				{ key: "Stat. Pay Hours", pair: "statPay" },
				{ key: "Vacation Hours", pair: "vacationPay" },
				{ key: "Sick Pay Hours", pair: "sickPay" },
				{ key: "", pair: <OutlineButton label="View Timesheets" /> },
			]}
			data={data}
			label="Setup"
			path={`${ROUTE_PATH.PAYROLL}${ROUTE_PATH.TIMESHEETS}`}
		/>
	);
};

export default HourlyAllocation;
