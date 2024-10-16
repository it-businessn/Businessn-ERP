import useEmployeeERContribution from "hooks/useEmployeeERContribution";
import { ROUTE_PATH } from "routes";
import WorkviewTab from "./WorkviewTab";

const EmployerContribution = ({ company, closestRecord, groupId }) => {
	const data = useEmployeeERContribution(company, closestRecord, groupId);

	return (
		<WorkviewTab
			cols={[
				{ key: "Employee Name", pair: "obj", pair_key: "fullName" },
				{
					key: "Employment Insurance (ER)",
					pair: "EI",
					round: true,
				},
				{
					key: "Canada Pension Plan (ER)",
					pair: "CPP",
					round: true,
				},
				{
					key: "Employer Pension Plan (ER)",
					pair: "EPP",
					round: true,
				},
				{ key: "Employer Health Plan (ER)", pair: "EHP", round: true },
			]}
			data={data}
			label="Setup"
			path={`${ROUTE_PATH.PAYROLL}${ROUTE_PATH.TIMESHEETS}`}
		/>
	);
};

export default EmployerContribution;
