import { COLS, CONTRIBUTION } from "constant";
import useEmployeeEEContribution from "hooks/useEmployeeEEContribution";
import WorkviewTab from "./WorkviewTab";

const EmployeeContribution = ({ company, closestRecord, groupId }) => {
	const data = useEmployeeEEContribution(company, closestRecord, groupId);

	return (
		<WorkviewTab
			overflowX="hidden"
			cols={[
				{
					key: COLS.EMP_NAME,
					pair: "obj",
					pair_key: "fullName",
					round: true,
				},
				{
					key: `${CONTRIBUTION.EI} (EE)`,
					pair: "EI",
					align: "center",
					round: true,
				},
				{
					key: `${CONTRIBUTION.CPP} (EE)`,
					pair: "CPP",
					align: "center",
					round: true,
				},
				{ key: COLS.UNION_DUE, pair: "unionDues", align: "center", round: true },
				{
					key: `Employer ${CONTRIBUTION.PENSION_PLAN} (EE)`,
					pair: "EPP",
					align: "center",
					round: true,
				},
				{
					key: `Employer ${CONTRIBUTION.HEALTH_PLAN} (EE)`,
					pair: "EHP",
					align: "center",
					round: true,
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
		/>
	);
};

export default EmployeeContribution;
