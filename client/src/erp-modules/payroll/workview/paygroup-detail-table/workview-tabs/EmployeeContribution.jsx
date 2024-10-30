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
				// {
				// 	key: "Employment Insurance (EE)",
				// 	pair: "EI",
				// 	round: true,
				// },
				// {
				// 	key: "Canada Pension Plan (EE)",
				// 	pair: "CPP",
				// 	round: true,
				// },
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
				{
					key: "ee1",
				},
				{
					key: "ee2",
				},
				{
					key: "ee3",
				},
				{
					key: "ee4",
				},
				{
					key: "ee5",
				},
				{
					key: "ee6",
				},
				{
					key: "ee7",
				},
				{
					key: "ee8",
				},
				{
					key: "ee9",
				},
				{
					key: "ee10",
				},
			]}
			data={data}
			label="Setup"
			path={`${ROUTE_PATH.PAYROLL}${ROUTE_PATH.TIMESHEETS}`}
		/>
	);
};

export default EmployeeContribution;
