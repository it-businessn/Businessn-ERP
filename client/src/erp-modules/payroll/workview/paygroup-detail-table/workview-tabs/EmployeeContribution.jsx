import useEmployeeEEContribution from "hooks/useEmployeeEEContribution";
import { ROUTE_PATH } from "routes";
import WorkviewTab from "./WorkviewTab";

const EmployeeContribution = ({ company, closestRecord, groupId }) => {
	const data = useEmployeeEEContribution(company, closestRecord, groupId);

	return (
		<WorkviewTab
			cols={[
				{
					key: "Employee Name",
					pair: "obj",
					pair_key: "fullName",
					round: true,
				},
				{
					key: "Employment Insurance (EE)",
					pair: "EI",
					round: true,
				},
				{
					key: "Canada Pension Plan (EE)",
					pair: "CPP",
					round: true,
				},
				{ key: "Union Dues", pair: "unionDues", round: true },
				{
					key: "Employer Pension Plan (EE)",
					pair: "EPP",
					round: true,
				},
				{
					key: "Employer Health Plan (EE)",
					pair: "EHP",
					round: true,
				},
			]}
			data={data}
			label="Setup"
			path={`${ROUTE_PATH.PAYROLL}${ROUTE_PATH.TIMESHEETS}`}
		/>
	);
};

export default EmployeeContribution;
