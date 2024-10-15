import useEmployeeHoursWorked from "hooks/useEmployeeHoursWorked";
import { ROUTE_PATH } from "routes";
import WorkviewTab from "./WorkviewTab";

const EmployerContribution = ({ company, closestRecord, groupId }) => {
	const data = useEmployeeHoursWorked(company, closestRecord, groupId);

	return (
		<WorkviewTab
			cols={[
				{ key: "Employee Name", pair: "obj", pair_key: "fullName" },
				{
					key: "Employment Insurance (ER)",
					pair: "federalEmploymentInsuranceER",
				},
				{ key: "Canada Pension Plan (ER)", pair: "federalPensionER" },
				{
					key: "Employer Pension Plan (ER)",
					pair: "currentEmployerPensionContributions",
				},
				{ key: "Employer Health Plan (ER)", pair: "regionalEmployerHealth" },
			]}
			data={data}
			label="Setup"
			path={`${ROUTE_PATH.PAYROLL}${ROUTE_PATH.TIMESHEETS}`}
		/>
	);
};

export default EmployerContribution;
