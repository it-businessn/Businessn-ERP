import useEmployeeHoursWorked from "hooks/useEmployeeHoursWorked";
import { ROUTE_PATH } from "routes";
import WorkviewTab from "./WorkviewTab";

const EmployeeContribution = ({ company, closestRecord, groupId }) => {
	const data = useEmployeeHoursWorked(company, closestRecord, groupId);

	return (
		<WorkviewTab
			cols={[
				{ key: "Employee Name", pair: "obj", pair_key: "fullName" },
				{
					key: "Employment Insurance (EE)",
					pair: "federalEmploymentInsuranceEE",
				},
				{ key: "Canada Pension Plan (EE)", pair: "federalPensionEE" },
				{ key: "Union Dues", pair: "unionDues" },
				{
					key: "Employer Pension Plan (EE)",
					pair: "currentEmployeePensionContributions",
				},
				{ key: "Employer Health Plan (EE)", pair: "regionalEmployeeHealth" },
			]}
			data={data}
			label="Setup"
			path={`${ROUTE_PATH.PAYROLL}${ROUTE_PATH.TIMESHEETS}`}
		/>
	);
};

export default EmployeeContribution;
