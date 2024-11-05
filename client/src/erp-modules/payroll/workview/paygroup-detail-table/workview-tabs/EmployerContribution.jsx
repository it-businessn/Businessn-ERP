import useEmployeeERContribution from "hooks/useEmployeeERContribution";
import WorkviewTab from "./WorkviewTab";

const EmployerContribution = ({ company, closestRecord, groupId }) => {
	const data = useEmployeeERContribution(company, closestRecord, groupId);

	return (
		<WorkviewTab
			overflowX="hidden"
			cols={[
				{ key: "Employee Name", pair: "obj", pair_key: "fullName" },
				// {
				// 	key: "Employment Insurance (ER)",
				// 	pair: "EI",
				// 	round: true,
				// },
				// {
				// 	key: "Canada Pension Plan (ER)",
				// 	pair: "CPP",
				// 	round: true,
				// },
				{
					key: "ER Pension Plan",
					pair: "EPP",
					round: true,
					align: "center",
				},
				{
					key: "ER Health Plan",
					pair: "EHP",
					align: "center",
					round: true,
				},
				{
					key: "er1",
				},
				{
					key: "er2",
				},
				{
					key: "er3",
				},
				{
					key: "er4",
				},
				{
					key: "er5",
				},
				{
					key: "er6",
				},
				{
					key: "er7",
				},
				{
					key: "er8",
				},
				{
					key: "er9",
				},
				{
					key: "er10",
				},
				{
					key: "er11",
				},
			]}
			data={data}
			label="Setup"
		/>
	);
};

export default EmployerContribution;
